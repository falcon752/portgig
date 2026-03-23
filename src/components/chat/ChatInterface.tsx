/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send, Paperclip, X, MoreVertical} from 'lucide-react';
import { getChatMessages, sendMessage, getUserPresence } from '@/src/lib/firebase/chat';
import { Message, UserPresence } from '@/types/chat';
import { LoadingSpinner } from '@/src/utils/util_component';
import { useAppSelector } from '@/src/redux/hooks';
import Link from 'next/link';
import { getUserId, getUserName } from '@/src/utils/chats';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
    chatId: string;
    otherParticipant: {
        id: string;
        name: string;
        userType: 'recruiter' | 'creative';
        profilePicture?: string | null;
    };
}

const ChatInterface = ({ chatId, otherParticipant }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<(Message & { id: string })[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [otherUserPresence, setOtherUserPresence] = useState<UserPresence | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { profile } = useAppSelector((state) => state.user);
    const { recruiterProfile } = useAppSelector((state) => state.recruiter);
    const router = useRouter();

    const currentUser = profile || recruiterProfile;
    const currentUserType = profile ? 'creative' : 'recruiter';
    const currentUserId = getUserId(currentUser);
    const currentUserName = getUserName(currentUser);

    useEffect(() => {
        if (!chatId || !currentUserId) {
            setLoading(false);
            return;
        }

        const unsubscribeMessages = getChatMessages(chatId, (msgs) => {
            setMessages(msgs);
            setLoading(false);
            scrollToBottom();
        });

        const unsubscribePresence = getUserPresence(otherParticipant.id, (presence) => {
            setOtherUserPresence(presence);
        });

        return () => {
            unsubscribeMessages();
            unsubscribePresence();
        };
    }, [chatId, otherParticipant.id, currentUserId]);

    useEffect(() => {
        if (selectedFile) {
            if (selectedFile.type.startsWith('image/')) {
                const previewUrl = URL.createObjectURL(selectedFile);
                setFilePreview(previewUrl);
                return () => URL.revokeObjectURL(previewUrl);
            } else {
                setFilePreview(null);
            }
        } else {
            setFilePreview(null);
        }
    }, [selectedFile]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File must be 10MB or less.");
                e.target.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
    };

    const handleSendMessage = async () => {
        if (sending || !currentUserId) {
            return;
        }

        setSending(true);
        try {
            if (selectedFile) {
                await sendMessage(
                    chatId,
                    currentUserId,
                    currentUserName,
                    currentUserType,
                    selectedFile,
                    selectedFile.name,
                    selectedFile.size
                );
                setSelectedFile(null);
                setFilePreview(null);
            } else if (newMessage.trim()) {
                await sendMessage(
                    chatId,
                    currentUserId,
                    currentUserName,
                    currentUserType,
                    newMessage.trim()
                );
                setNewMessage('');
            }
        } catch{
            toast('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleViewProfile = () => {
        setShowDropdown(false);
        router.push(`/profile-card/${otherParticipant.id}`);
    };

    const formatMessageTime = (timestamp: any) => {
        if (!timestamp) return '';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const isOnline = otherUserPresence?.isOnline;
    const lastSeen = otherUserPresence?.lastSeen;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <LoadingSpinner className="border-primary w-8 h-8 mx-auto mb-4" />
                    <p className="text-gray-600">Loading chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#0A1754] text-white">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Image
                            src={otherParticipant?.profilePicture || "/assets/creativeImage.svg"}
                            alt={otherParticipant.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">{otherParticipant.name}</h3>
                        <p className="text-sm text-white/80">
                            {isOnline
                                ? 'Online'
                                : lastSeen
                                    ? `Last seen ${formatMessageTime(lastSeen)}`
                                    : 'Offline'}
                        </p>
                    </div>
                </div>

                {otherParticipant.userType === 'creative' && (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {showDropdown && (
                            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-50">
                                <button
                                    onClick={handleViewProfile}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    View Profile
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Image
                                src={otherParticipant?.profilePicture || "/assets/creativeImage.svg"}
                                alt={otherParticipant.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <p className="text-lg font-semibold">{otherParticipant.name}</p>
                        <p className="text-sm">Start your conversation</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isCurrentUser = message.senderId === currentUserId;

                        return (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {!isCurrentUser && (
                                    <Image
                                        src={otherParticipant?.profilePicture || "/assets/creativeImage.svg"}
                                        alt={message.senderName || 'User'}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                )}

                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isCurrentUser
                                            ? 'bg-[#0A1754] text-white rounded-br-md'
                                            : 'bg-gray-200 text-gray-900 rounded-bl-md'
                                        }`}
                                >
                                    {message.type === 'text' && <p className="text-sm">{message.text}</p>}
                                    {message.type === 'image' && message.url && (
                                        <img src={message.url} alt="Uploaded image" className="max-w-full rounded-lg" />
                                    )}
                                    {message.type === 'file' && message.url && (
                                        <Link href={message.url} download={message.fileName} className="text-sm underline">
                                            {message.fileName} ({(message.fileSize ? (message.fileSize / 1024).toFixed(2) + ' KB' : '')})
                                        </Link>
                                    )}
                                    <div className="text-xs mt-1 opacity-70">
                                        {formatMessageTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
                {selectedFile && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg relative">
                        <button
                            onClick={handleRemoveFile}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-gray-50"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                        {filePreview ? (
                            <img src={filePreview} alt="Preview" className="max-h-40 rounded-lg" />
                        ) : (
                            <div className="text-sm text-gray-700">
                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <label className="p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                        <Paperclip className="w-5 h-5" />
                        <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 bg-gray-100 rounded-full text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            disabled={sending}
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && !selectedFile) || sending || !currentUserId}
                        className="p-3 bg-[#0A1754] text-white rounded-full hover:bg-[#0A1754]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <LoadingSpinner className="w-5 h-5 border-white" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;