import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserChatRooms, getUserPresence } from '@/src/lib/firebase/chat';
import { ChatRoom, UserPresence } from '@/types/chat';
import { LooadingSpinner } from '@/src/utils/util_component';
import { Search, MessageCircle } from 'lucide-react';
import { useAppSelector } from '@/src/redux/hooks';
import { getUserId } from '@/src/utils/chats';


interface ChatListProps {
  selectedChatId?: string;
}

const ChatList = ({ selectedChatId }: ChatListProps) => {
  const [chatRooms, setChatRooms] = useState<(ChatRoom & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPresences, setUserPresences] = useState<Record<string, UserPresence | null>>({});
  const router = useRouter();

  const { profile } = useAppSelector((state) => state.user);
  const { recruiterProfile } = useAppSelector((state) => state.recruiter);

  const currentUser = profile || recruiterProfile;
  const currentUserId = getUserId(currentUser);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const unsubscribe = getUserChatRooms(currentUserId, (rooms) => {
      setChatRooms(rooms);
      setLoading(false);

      // Subscribe to presence for each participant
      const presenceUnsubscribes: (() => void)[] = [];
      rooms.forEach((room) => {
        const otherParticipant = getOtherParticipant(room.participants);
        if (otherParticipant?.id) {
          const unsubscribePresence = getUserPresence(otherParticipant.id, (presence) => {
            setUserPresences((prev) => ({
              ...prev,
              [otherParticipant.id]: presence,
            }));
          });
          presenceUnsubscribes.push(unsubscribePresence);
        }
      });

      return () => presenceUnsubscribes.forEach((unsub) => unsub());
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserId]);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      if (diff < 60000) return 'now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  const getOtherParticipant = (participants: Record<string, any>) => {
    return Object.values(participants).find(
      (participant: any) => participant.id !== currentUserId
    );
  };

  const filteredChats = chatRooms.filter((room) => {
    const otherParticipant = getOtherParticipant(room.participants);
    return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const recruiterChats = filteredChats.filter((room) => {
    const otherParticipant = getOtherParticipant(room.participants);
    return otherParticipant?.userType === 'recruiter';
  });

  const creativeChats = filteredChats.filter((room) => {
    const otherParticipant = getOtherParticipant(room.participants);
    return otherParticipant?.userType === 'creative';
  });


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LooadingSpinner className="border-primary w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  const ChatItem = ({ room }: { room: ChatRoom & { id: string } }) => {
    const otherParticipant = getOtherParticipant(room.participants);
    const isSelected = selectedChatId === room.id;
    const presence = otherParticipant?.id ? userPresences[otherParticipant.id] : null;
    
    if (!otherParticipant) {
      console.error('No other participant found for room:', room.id);
      return null;
    }

    return (
      <div
        onClick={() => {
          router.push(`/chats/${room.id}`);
        }}
        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
          isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
        }`}
      >
        <div className="relative">
          <Image
            src={otherParticipant?.profilePicture || "/assets/creativeImage.svg"}
            alt={otherParticipant?.name || 'User'}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          {presence?.isOnline ? (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          ) : (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherParticipant?.name || 'Unknown User'}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">
                {formatTimestamp(room.lastMessage?.timestamp)}
              </span>
              {room.unreadCounts?.[currentUserId] > 0 && (
                <span className="mt-1 bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {room.unreadCounts[currentUserId]}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-600 truncate flex-1">
              {room.lastMessage?.text || 'No messages yet'}
            </p>
            <span className="text-xs text-blue-600 ml-2 capitalize">
              {otherParticipant?.userType}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <MessageCircle className="w-6 h-6 text-gray-600" />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-2" />
            <p>No conversations yet</p>
            <p className="text-sm">Start chatting!</p>
          </div>
        ) : (
          <>
            {recruiterChats.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <h3 className="text-sm font-semibold text-gray-700">Recruiters ({recruiterChats.length})</h3>
                </div>
                {recruiterChats.map((room) => (
                  <ChatItem key={room.id} room={room} />
                ))}
              </div>
            )}

            {creativeChats.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <h3 className="text-sm font-semibold text-gray-700">Creatives ({creativeChats.length})</h3>
                </div>
                {creativeChats.map((room) => (
                  <ChatItem key={room.id} room={room} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatList;