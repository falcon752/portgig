"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatList from '@/src/components/chat/ChatList';
import { useAppSelector } from '@/src/redux/hooks';
import { updateUserPresence } from '@/src/lib/firebase/chat';
import { getUserId } from '@/src/utils/chats';

const ChatsPage = () => {
  const router = useRouter();

  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);
  
  const isAuthenticated = profile || recruiterProfile;
  const currentUser = profile || recruiterProfile;
  const currentUserType = profile ? 'creative' : 'recruiter';
  const currentUserId = getUserId(currentUser);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Set user as online when component mounts
    if (currentUserId && currentUser) {
      updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', true);
    }

    // Set user as offline when component unmounts or page is closed
    const handleBeforeUnload = () => {
      if (currentUserId && currentUser) {
        // Use sendBeacon for reliable offline status on page close
        updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', false);
      }
    };

    const handleVisibilityChange = () => {
      if (currentUserId && currentUser) {
        if (document.hidden) {
          // Page is hidden (user switched tabs)
          updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', false);
        } else {
          // Page is visible again
          updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup: Set user offline when leaving page
    return () => {
      if (currentUserId && currentUser) {
        updateUserPresence(currentUserId, currentUser, currentUserType as 'recruiter' | 'creative', false);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, router, currentUserId, currentUser, currentUserType]);

  return (
    <div className="h-screen bg-gray-50">
      <div className="md:hidden h-full">
        <ChatList />
      </div>
      <div className="hidden md:flex h-full">
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <ChatList />
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;