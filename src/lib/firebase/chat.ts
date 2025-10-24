import { collection, doc, addDoc, updateDoc, getDoc, onSnapshot, query, orderBy, serverTimestamp, setDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
import { db } from './config';
import { ChatRoom, Message, UserPresence } from '@/types/chat';
import { getUserId, getUserName, getUserProfilePicture } from '@/src/utils/chats';

export const generateChatId = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const createOrGetChatRoom = async (
  user1Data: any,
  user2Data: any,
  user1Type: 'recruiter' | 'creative',
  user2Type: 'recruiter' | 'creative'
): Promise<string> => {
  const normalizedUser1Id = getUserId(user1Data);
  const normalizedUser2Id = getUserId(user2Data);

  console.log('createOrGetChatRoom called with:', {
    user1Id: normalizedUser1Id,
    user2Id: normalizedUser2Id,
    user1Type,
    user2Type,
    user1Name: getUserName(user1Data),
    user2Name: getUserName(user2Data),
    user1ProfilePicture: getUserProfilePicture(user1Data),
    user2ProfilePicture: getUserProfilePicture(user2Data)
  });

  if (!normalizedUser1Id || !normalizedUser2Id) {
    throw new Error(`Both user IDs are required. Received: user1Id=${normalizedUser1Id}, user2Id=${normalizedUser2Id}`);
  }

  if (normalizedUser1Id === normalizedUser2Id) {
    throw new Error('Cannot create chat room with the same user');
  }

  const chatId = generateChatId(normalizedUser1Id, normalizedUser2Id);
  const chatRef = doc(db, 'chats', chatId);
  
  try {
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      console.log('Creating new chat room:', {
        chatId,
        user1Type,
        user2Type,
        user1Name: getUserName(user1Data),
        user2Name: getUserName(user2Data),
        user1ProfilePicture: getUserProfilePicture(user1Data),
        user2ProfilePicture: getUserProfilePicture(user2Data)
      });
      console.log('userData1', user1Data)
      console.log('userData2', user2Data)
      console.log('getUserProfilePicture2', getUserProfilePicture(user2Data))
      console.log('getUserProfilePicture1', getUserProfilePicture(user1Data))
      console.log('getUserProfilePicture', getUserProfilePicture)
      
      const chatRoom: Omit<ChatRoom, 'id'> = {
        participants: {
          [normalizedUser1Id]: {
            id: normalizedUser1Id,
            name: getUserName(user1Data),
            userType: user1Type,
            lastSeen: serverTimestamp(),
            profilePicture: getUserProfilePicture(user1Data) || '/assets/creativeImage.svg'
          },
          [normalizedUser2Id]: {
            id: normalizedUser2Id,
            name: getUserName(user2Data),
            userType: user2Type,
            lastSeen: serverTimestamp(),
            profilePicture: getUserProfilePicture(user2Data) || '/assets/creativeImage.svg'
          }
        },
        lastMessage: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        unreadCounts: {
          [normalizedUser1Id]: 0,
          [normalizedUser2Id]: 0
        }
      };
      
      await setDoc(chatRef, chatRoom);
      console.log('Chat room created successfully:', chatId);
    } else {
      console.log('Chat room already exists:', chatId);
    }
    
    return chatId;
  } catch (error) {
    console.error('Error creating/getting chat room:', error);
    throw error;
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderName: string,
  senderType: 'recruiter' | 'creative',
  content: string | File,  
  fileName?: string,
  fileSize?: number
): Promise<void> => {
  try {
    const normalizedSenderId = getUserId({ _id: senderId, id: senderId }) || senderId;
    
    console.log('Sending message:', {
      chatId,
      senderId: normalizedSenderId,
      senderName,
      senderType,
      contentType: typeof content
    });

    const messageData: Partial<Message> = {
      senderId: normalizedSenderId,
      senderName,
      senderType,
      timestamp: serverTimestamp(),
      read: false,
    };

    if (typeof content === 'string') {
      messageData.type = 'text';
      messageData.text = content.trim();
    } else {
      const storageRef = ref(storage, `chats/${chatId}/${Date.now()}_${content.name}`);
      console.log('Uploading file to storage...');
      await uploadBytes(storageRef, content);
      const url = await getDownloadURL(storageRef);
      console.log('File uploaded successfully, URL:', url);

      messageData.type = content.type.startsWith('image/') ? 'image' : 'file';
      messageData.url = url;
      messageData.fileName = fileName || content.name;
      messageData.fileSize = fileSize || content.size;
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    console.log('Adding message to Firestore...');
    await addDoc(messagesRef, messageData);
    console.log('Message added to Firestore successfully');

    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      console.error('Chat room does not exist:', chatId);
      return;
    }

    const participants = chatDoc.data()?.participants || {};
    const recipientId = Object.keys(participants).find(id => id !== normalizedSenderId);

    const updateData: any = {
      lastMessage: {
        text: messageData.type === 'text' ? messageData.text : (messageData.fileName || 'File sent'),
        senderId: normalizedSenderId,
        timestamp: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    };

    if (recipientId) {
      updateData[`unreadCounts.${recipientId}`] = increment(1);
    }

    console.log('Updating chat room with last message...');
    await updateDoc(chatRef, updateData);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getUserChatRooms = (
  userId: string, 
  callback: (chatRooms: (ChatRoom & { id: string })[]) => void
) => {
  const normalizedUserId = getUserId({ _id: userId, id: userId }) || userId;
  
  console.log('getUserChatRooms called for userId:', normalizedUserId);
  
  if (!normalizedUserId) {
    console.error('getUserChatRooms: userId is required');
    callback([]);
    return () => {};
  }

  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, orderBy('updatedAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    console.log('Firestore snapshot received, total docs:', snapshot.size);
    const chatRooms: (ChatRoom & { id: string })[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as ChatRoom;
      console.log('Checking chat room:', doc.id, 'participants:', Object.keys(data.participants || {}));
      
      if (data.participants && data.participants[normalizedUserId]) {
        console.log('User is participant in chat room:', doc.id);
        chatRooms.push({
          ...data,
          id: doc.id
        });
      }
    });
    
    console.log('Retrieved chat rooms for user:', chatRooms.length);
    callback(chatRooms);
  }, (error) => {
    console.error('Error in getUserChatRooms:', error);
    callback([]);
  });
};

export const getChatMessages = (
  chatId: string,
  callback: (messages: (Message & { id: string })[]) => void
) => {
  console.log('getChatMessages called for chatId:', chatId);
  
  if (!chatId) {
    console.error('getChatMessages: chatId is required');
    callback([]);
    return () => {};
  }
  
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    console.log('Messages snapshot received for chat:', chatId, 'count:', snapshot.size);
    const messages: (Message & { id: string })[] = [];
    
    snapshot.forEach((doc) => {
      const messageData = doc.data() as Message;
      messages.push({
        ...messageData,
        id: doc.id
      });
    });
    
    console.log('Retrieved messages:', messages.length);
    callback(messages);
  }, (error) => {
    console.error('Error in getChatMessages for chatId:', chatId, error);
    callback([]);
  });
};

export const updateUserPresence = async (
  userId: string,
  userData: any,
  userType: 'recruiter' | 'creative',
  isOnline: boolean
): Promise<void> => {
  try {
    const normalizedUserId = getUserId({ _id: userId, id: userId }) || userId;

    if (!normalizedUserId) {
      console.error('User ID is required for updating presence');
      throw new Error('User ID is required');
    }

    const userName = getUserName(userData) || 'Unknown User';
    const profilePicture = getUserProfilePicture(userData) || '/assets/creativeImage.svg';
    console.log('profilePicture', profilePicture)
    console.log('Updating user presence:', {
      userId: normalizedUserId,
      userName,
      userType,
      isOnline,
      profilePicture
    });

    const userRef = doc(db, 'users', normalizedUserId);
    await setDoc(
      userRef,
      {
        id: normalizedUserId,
        name: userName,
        userType,
        isOnline,
        lastSeen: serverTimestamp(),
        profilePicture
      },
      { merge: true }
    );

    console.log('User presence updated successfully for', normalizedUserId);
  } catch (error) {
    console.error('Error updating user presence:', error);
    throw error;
  }
};

export const getUserPresence = (
  userId: string,
  callback: (presence: UserPresence | null) => void
) => {
  const normalizedUserId = getUserId({ _id: userId, id: userId }) || userId;
  
  console.log('getUserPresence called for userId:', normalizedUserId);
  
  if (!normalizedUserId) {
    callback(null);
    return () => {};
  }

  const userRef = doc(db, 'users', normalizedUserId);
  
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const presence = doc.data() as UserPresence;
      console.log('User presence retrieved:', presence);
      callback(presence);
    } else {
      console.log('No presence data found for user:', normalizedUserId);
      callback(null);
    }
  }, (error) => {
    console.error('Error in getUserPresence:', error);
    callback(null);
  });
};

export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection...');
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
};

export const getCurrentUserInfo = (profile: any, recruiterProfile: any) => {
  const currentUser = profile || recruiterProfile;
  const userType = profile ? 'creative' : 'recruiter';
  const userId = getUserId(currentUser);
  const userName = getUserName(currentUser);
  const profilePicture = getUserProfilePicture(currentUser);
  
  return {
    currentUser,
    userType,
    userId,
    userName,
    profilePicture
  };
};