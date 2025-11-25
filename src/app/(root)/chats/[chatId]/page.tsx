"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import ChatList from '@/src/components/chat/ChatList';
import ChatInterface from '@/src/components/chat/ChatInterface';
import { db } from '@/src/lib/firebase/config';
import { updateUserPresence } from '@/src/lib/firebase/chat';
import { LoadingSpinner } from '@/src/utils/util_component';
import { useAppSelector } from '@/src/redux/hooks';
import { getUserId } from '@/src/utils/chats';

const ChatPage = () => {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const [loading, setLoading] = useState(true);
  const [chatExists, setChatExists] = useState(false);
  const [otherParticipant, setOtherParticipant] = useState<{
    id: string;
    name: string;
    userType: 'recruiter' | 'creative';
    profilePicture?: string | null;
  } | null>(null);

  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  
  const currentUser = profile || recruiterProfile;
  const currentUserId = getUserId(currentUser);
  const currentUserType = profile ? 'creative' : 'recruiter';
  const isAuthenticated = profile || recruiterProfile;

  // Update user presence
  useEffect(() => {
    if (!isAuthenticated || !currentUserId || !currentUser) return;

    // Set user as online
    updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', true);

    const handleBeforeUnload = () => {
      if (currentUserId && currentUser) {
        updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', false);
      }
    };

    const handleVisibilityChange = () => {
      if (currentUserId && currentUser) {
        if (document.hidden) {
          updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', false);
        } else {
          updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (currentUserId && currentUser) {
        updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', false);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, currentUserId, currentUser, currentUserType]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    const fetchChatDetails = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);
        
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();

          if (!chatData.participants[currentUserId || '']) {
            router.push('/chats');
            return;
          }

          const participants = Object.values(chatData.participants) as any[];
          const other = participants.find((p: any) => p.id !== currentUserId);
          
          if (other) {
            setOtherParticipant({
              id: other.id,
              name: other.name,
              userType: other.userType === 'creator' ? 'creative' : other.userType,
              profilePicture: other.profilePicture || null 
            });
            setChatExists(true);

            const chatRef = doc(db, 'chats', chatId);
            await updateDoc(chatRef, {
              [`unreadCounts.${currentUserId}`]: 0
            });
          }
        } else {
          router.push('/chats');
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
        router.push('/chats');
      } finally {
        setLoading(false);
      }
    };

    if (chatId && currentUserId) {
      fetchChatDetails();
    }
  }, [chatId, currentUserId, router, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner className="border-primary w-8 h-8" />
      </div>
    );
  }

  if (!chatExists || !otherParticipant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Chat not found</p>
          <button
            onClick={() => router.push('/chats')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="md:hidden h-full">
        <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => router.push('/chats')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Back to Chats</h1>
        </div>
        <div className="h-[calc(100vh-80px)]">
          <ChatInterface 
            chatId={chatId} 
            otherParticipant={otherParticipant}
          />
        </div>
      </div>
      <div className="hidden md:flex h-full">
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <ChatList selectedChatId={chatId} />
        </div>
        <div className="flex-1">
          <ChatInterface 
            chatId={chatId} 
            otherParticipant={otherParticipant}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;