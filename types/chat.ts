import { FieldValue, Timestamp } from 'firebase/firestore'

export interface ChatParticipant {
  id: string;
  name: string;
  userType: 'recruiter' | 'creative';
  lastSeen: Timestamp | FieldValue;
}

export interface ChatRoom {
  participants: Record<string, {
    id: string;
    name: string;
    userType: 'recruiter' | 'creative';
    lastSeen: any;
    profilePicture?: string | null;
  }>;
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: any;
  } | null;
  createdAt: any;
  updatedAt: any;
  unreadCounts: Record<string, number>;
}

export interface Message {
  senderId: string;
  senderName: string;
  senderType: 'recruiter' | 'creative';
  type: 'text' | 'image' | 'file';
  text?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: Timestamp | FieldValue;
  read: boolean;
}

export interface UserPresence {
  id: string;
  name: string;
  userType: 'recruiter' | 'creative';
  isOnline: boolean;
  lastSeen: Timestamp;
  profilePicture?: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'recruiter' | 'creative';
  type: 'text' | 'image' | 'file'; 
  text?: string;                    
  url?: string;                    
  fileName?: string;                
  fileSize?: number;                
  timestamp: Timestamp | FieldValue;
  read: boolean;                  
}

export interface UserPresence {
  id: string;
  name: string;
  userType: 'recruiter' | 'creative';
  isOnline: boolean;
  lastSeen: Timestamp;
}