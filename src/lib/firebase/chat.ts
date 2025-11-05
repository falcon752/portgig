import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "./config";
import { ChatRoom, Message, UserPresence } from "@/types/chat";
import {
  getUserId,
  getUserName,
  getUserProfilePicture,
} from "@/src/utils/chats";

// 🔹 Generate unique chat ID
export const generateChatId = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

// 🔹 Create or get chat room
export const createOrGetChatRoom = async (
  user1Data: any,
  user2Data: any,
  user1Type: "recruiter" | "creative",
  user2Type: "recruiter" | "creative"
): Promise<string> => {
  const normalizedUser1Id = getUserId(user1Data);
  const normalizedUser2Id = getUserId(user2Data);

  if (!normalizedUser1Id || !normalizedUser2Id) {
    throw new Error(
      `Both user IDs are required. Received: user1Id=${normalizedUser1Id}, user2Id=${normalizedUser2Id}`
    );
  }

  if (normalizedUser1Id === normalizedUser2Id) {
    throw new Error("Cannot create chat room with the same user");
  }

  const chatId = generateChatId(normalizedUser1Id, normalizedUser2Id);
  const chatRef = doc(db, "chats", chatId);

  try {
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      const chatRoom: Omit<ChatRoom, "id"> = {
        participants: {
          [normalizedUser1Id]: {
            id: normalizedUser1Id,
            name: getUserName(user1Data),
            userType: user1Type,
            lastSeen: serverTimestamp(),
            profilePicture:
              getUserProfilePicture(user1Data) || "/assets/creativeImage.svg",
          },
          [normalizedUser2Id]: {
            id: normalizedUser2Id,
            name: getUserName(user2Data),
            userType: user2Type,
            lastSeen: serverTimestamp(),
            profilePicture:
              getUserProfilePicture(user2Data) || "/assets/creativeImage.svg",
          },
        },
        lastMessage: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        unreadCounts: {
          [normalizedUser1Id]: 0,
          [normalizedUser2Id]: 0,
        },
      };

      await setDoc(chatRef, chatRoom);
    }

    return chatId;
  } catch (error) {
    console.error("Error creating/getting chat room:", error);
    throw error;
  }
};

// 🔹 Send Message (Cloudinary integrated)
export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  senderType: "recruiter" | "creative",
  content: string | File,
  fileName?: string,
  fileSize?: number
): Promise<void> => {
  try {
    const normalizedSenderId =
      getUserId({ _id: senderId, id: senderId }) || senderId;

    const messageData: Partial<Message> = {
      senderId: normalizedSenderId,
      senderName,
      senderType,
      timestamp: serverTimestamp(),
      read: false,
    };

    // ✅ Handle text or file uploads
    if (typeof content === "string") {
      messageData.type = "text";
      messageData.text = content.trim();
    } else {
      console.log("Uploading file to Cloudinary...");

      const formData = new FormData();
      formData.append("file", content);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      const url = data.secure_url;
      console.log("File uploaded successfully, URL:", url);

      messageData.type = content.type.startsWith("image/") ? "image" : "file";
      messageData.url = url;
      messageData.fileName = fileName || content.name;
      messageData.fileSize = fileSize || content.size;
    }

    // ✅ Add message to Firestore
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, messageData);

    // ✅ Update chat metadata
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) return;

    const participants = chatDoc.data()?.participants || {};
    const recipientId = Object.keys(participants).find(
      (id) => id !== normalizedSenderId
    );

    const updateData: any = {
      lastMessage: {
        text:
          messageData.type === "text"
            ? messageData.text
            : messageData.fileName || "File sent",
        senderId: normalizedSenderId,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    };

    if (recipientId) {
      updateData[`unreadCounts.${recipientId}`] = increment(1);
    }

    await updateDoc(chatRef, updateData);
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// 🔹 Get all chat rooms for a user
export const getUserChatRooms = (
  userId: string,
  callback: (chatRooms: (ChatRoom & { id: string })[]) => void
) => {
  const normalizedUserId = getUserId({ _id: userId, id: userId }) || userId;

  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, orderBy("updatedAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const chatRooms: (ChatRoom & { id: string })[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as ChatRoom;
        if (data.participants && data.participants[normalizedUserId]) {
          chatRooms.push({ ...data, id: doc.id });
        }
      });

      callback(chatRooms);
    },
    (error) => {
      console.error("Error in getUserChatRooms:", error);
      callback([]);
    }
  );
};

// 🔹 Listen to chat messages
export const getChatMessages = (
  chatId: string,
  callback: (messages: (Message & { id: string })[]) => void
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: (Message & { id: string })[] = [];
      snapshot.forEach((doc) => {
        const messageData = doc.data() as Message;
        messages.push({ ...messageData, id: doc.id });
      });
      callback(messages);
    },
    (error) => {
      console.error("Error in getChatMessages for chatId:", chatId, error);
      callback([]);
    }
  );
};

// 🔹 Update user presence
export const updateUserPresence = async (
  userId: string,
  userData: any,
  userType: "recruiter" | "creative",
  isOnline: boolean
): Promise<void> => {
  try {
    const normalizedUserId =
      getUserId({ _id: userId, id: userId }) || userId;

    const userName = getUserName(userData) || "Unknown User";
    const profilePicture =
      getUserProfilePicture(userData) || "/assets/creativeImage.svg";

    const userRef = doc(db, "users", normalizedUserId);
    await setDoc(
      userRef,
      {
        id: normalizedUserId,
        name: userName,
        userType,
        isOnline,
        lastSeen: serverTimestamp(),
        profilePicture,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating user presence:", error);
    throw error;
  }
};

// 🔹 Get user presence in real-time
export const getUserPresence = (
  userId: string,
  callback: (presence: UserPresence | null) => void
) => {
  const normalizedUserId = getUserId({ _id: userId, id: userId }) || userId;
  const userRef = doc(db, "users", normalizedUserId);

  return onSnapshot(
    userRef,
    (doc) => {
      if (doc.exists()) {
        const presence = doc.data() as UserPresence;
        callback(presence);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error in getUserPresence:", error);
      callback(null);
    }
  );
};

// 🔹 Test Firestore
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    return true;
  } catch (error) {
    console.error("Firestore connection failed:", error);
    return false;
  }
};

// 🔹 Current user info helper
export const getCurrentUserInfo = (profile: any, recruiterProfile: any) => {
  const currentUser = profile || recruiterProfile;
  const userType = profile ? "creative" : "recruiter";
  const userId = getUserId(currentUser);
  const userName = getUserName(currentUser);
  const profilePicture = getUserProfilePicture(currentUser);

  return {
    currentUser,
    userType,
    userId,
    userName,
    profilePicture,
  };
};
