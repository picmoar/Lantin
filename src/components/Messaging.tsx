import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Phone, Video, MoreVertical, Image, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'artwork';
  isOwn: boolean;
}

interface Conversation {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  artworkContext?: {
    title: string;
    image: string;
    price?: number;
  };
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    artistId: '1',
    artistName: 'Elena Rodriguez',
    artistAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b422?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Thanks for your interest in my abstract paintings!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 2,
    isOnline: true,
    artworkContext: {
      title: 'Midnight Reflections',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop',
      price: 850
    }
  },
  {
    id: '2',
    artistId: '2',
    artistName: 'Marcus Chen',
    artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'I\'d love to schedule a photo session with you',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    artistId: '3',
    artistName: 'Sofia Andersson',
    artistAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'The ceramic workshop is next weekend',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    isOnline: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Elena Rodriguez',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b422?w=100&h=100&fit=crop&crop=face',
    content: 'Hi! I saw you liked my abstract painting "Midnight Reflections"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    type: 'text',
    isOwn: false
  },
  {
    id: '2',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    content: 'Yes! It\'s absolutely beautiful. What inspired this piece?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    type: 'text',
    isOwn: true
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'Elena Rodriguez',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b422?w=100&h=100&fit=crop&crop=face',
    content: 'I was inspired by the way city lights reflect on wet pavement at night. There\'s something magical about those fleeting moments.',
    timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
    type: 'text',
    isOwn: false
  },
  {
    id: '4',
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    content: 'That\'s beautiful! Is it still available for purchase?',
    timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
    type: 'text',
    isOwn: true
  },
  {
    id: '5',
    senderId: '1',
    senderName: 'Elena Rodriguez',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b422?w=100&h=100&fit=crop&crop=face',
    content: 'Yes it is! It\'s $850. I can also arrange for you to see it in person at my upcoming exhibition.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: 'text',
    isOwn: false
  }
];

interface MessagingProps {
  onBack?: () => void;
  selectedArtistId?: string;
}

export function Messaging({ onBack, selectedArtistId }: MessagingProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedArtistId || null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'current-user',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        isOwn: true
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate artist reply after a delay
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: currentConversation.artistId,
          senderName: currentConversation.artistName,
          senderAvatar: currentConversation.artistAvatar,
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: new Date(),
          type: 'text',
          isOwn: false
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Chat view for selected conversation
  if (selectedConversation && currentConversation) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="relative">
            <img
              src={currentConversation.artistAvatar}
              alt={currentConversation.artistName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {currentConversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{currentConversation.artistName}</h3>
            <p className="text-sm text-muted-foreground">
              {currentConversation.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Artwork Context */}
        {currentConversation.artworkContext && (
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center gap-3">
              <img
                src={currentConversation.artworkContext.image}
                alt={currentConversation.artworkContext.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{currentConversation.artworkContext.title}</p>
                {currentConversation.artworkContext.price && (
                  <p className="text-sm text-muted-foreground">${currentConversation.artworkContext.price}</p>
                )}
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 h-8 w-8"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list
  return (
    <div className="h-screen overflow-y-auto bg-white pb-16">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Messages</h1>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Conversations */}
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="relative">
                <img
                  src={conversation.artistAvatar}
                  alt={conversation.artistName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium truncate">{conversation.artistName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className={`text-sm truncate ${
                  conversation.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'
                }`}>
                  {conversation.lastMessage}
                </p>
                
                {conversation.artworkContext && (
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={conversation.artworkContext.image}
                      alt={conversation.artworkContext.title}
                      className="w-6 h-6 rounded object-cover"
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {conversation.artworkContext.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              Start connecting with artists to begin conversations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
