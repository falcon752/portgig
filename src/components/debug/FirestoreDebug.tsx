"use client";
import { useEffect, useState } from 'react';
import { db } from '@/src/lib/firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const FirestoreDebug = ({ chatId }: { chatId?: string }) => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [chatDetails, setChatDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchChatDetails(chatId);
    }
  }, [chatId]);

  const testConnection = async () => {
    try {
      console.log('Testing Firestore connection...');
      setConnectionStatus('Connecting...');
      
      const chatsRef = collection(db, 'chats');
      const snapshot = await getDocs(chatsRef);
      
      console.log('Firestore connection successful!');
      console.log('Total chat rooms found:', snapshot.size);
      
      setConnectionStatus(`Connected! Found ${snapshot.size} chat rooms`);
      
      const rooms: any[] = [];
      snapshot.forEach((doc) => {
        rooms.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setChatRooms(rooms);
      setError(null);
      
    } catch (err: any) {
      console.error('Firestore connection failed:', err);
      setConnectionStatus('Connection failed');
      setError(err.message);
    }
  };

  const fetchChatDetails = async (chatId: string) => {
    try {
      console.log('Fetching chat details for:', chatId);
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        console.log('Chat data:', chatData);
        setChatDetails({ id: chatDoc.id, ...chatData });
      } else {
        console.log('Chat not found:', chatId);
        setChatDetails(null);
      }
    } catch (err: any) {
      console.error('Error fetching chat details:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">🔍 Firestore Debug Info</h3>
      
      <div className="mb-4">
        <p><strong>Connection Status:</strong> {connectionStatus}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>

      {chatId && (
        <div className="mb-4">
          <h4 className="font-semibold">Chat Details ({chatId}):</h4>
          {chatDetails ? (
            <pre className="text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(chatDetails, null, 2)}
            </pre>
          ) : (
            <p>No chat data found</p>
          )}
        </div>
      )}

      <div>
        <h4 className="font-semibold">All Chat Rooms ({chatRooms.length}):</h4>
        {chatRooms.length > 0 ? (
          <div className="max-h-40 overflow-y-auto">
            {chatRooms.map((room) => (
              <div key={room.id} className="text-sm border-b py-1">
                <strong>{room.id}</strong> - Participants: {Object.keys(room.participants || {}).join(', ')}
              </div>
            ))}
          </div>
        ) : (
          <p>No chat rooms found</p>
        )}
      </div>

      <button 
        onClick={testConnection}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Connection Test
      </button>
    </div>
  );
};

export default FirestoreDebug;