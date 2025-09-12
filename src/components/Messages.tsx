import React, { useState } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, Heart, Image, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { mockArtists } from '../data/artists';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'artwork';
  isRead: boolean;
  artworkImage?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isArtist: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Elena Rodriguez',
    participantImage: mockArtists[0].profileImage,
    lastMessage: 'Thank you for appreciating my artwork! Would love to discuss a commission piece.',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    isOnline: true,
    isArtist: true
  },
  {
    id: '2',
    participantId: '2',
    participantName: 'Marcus Chen',
    participantImage: mockArtists[1].profileImage,
    lastMessage: 'The gallery opening is next Friday at 7 PM. Hope to see you there!',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    isOnline: false,
    isArtist: true
  },
  {
    id: '3',
    participantId: '3',
    participantName: 'Sofia Andersson',
    participantImage: mockArtists[2].profileImage,
    lastMessage: 'Your feedback on my ceramic work means a lot. Let me know if you\'d like to visit my studio!',
    lastMessageTime: '3h ago',
    unreadCount: 1,
    isOnline: true,
    isArtist: true
  },
  {
    id: '4',
    participantId: '4',
    participantName: 'Art Collector',
    participantImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'I\'m interested in purchasing one of your saved artworks. Can we discuss pricing?',
    lastMessageTime: '1d ago',
    unreadCount: 0,
    isOnline: false,
    isArtist: false
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: 'me',
    content: 'Hi! I saw you saved my abstract painting "Midnight Reflections". Thank you so much!',
    timestamp: '2:30 PM',
    type: 'text',
    isRead: true
  },
  {
    id: '2',
    senderId: 'me',
    receiverId: '1',
    content: 'I absolutely love your work! The way you use colors is incredible.',
    timestamp: '2:32 PM',
    type: 'text',
    isRead: true
  },
  {
    id: '3',
    senderId: '1',
    receiverId: 'me',
    content: 'Thank you for appreciating my artwork! Would love to discuss a commission piece.',
    timestamp: '2:35 PM',
    type: 'text',
    isRead: false
  },
  {
    id: '4',
    senderId: '1',
    receiverId: 'me',
    content: 'Here\'s one of my latest pieces I think you might like',
    timestamp: '2:36 PM',
    type: 'artwork',
    artworkImage: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop',
    isRead: false
  }
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        receiverId: selectedConversation.participantId,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        isRead: false
      };
      
      // Update conversation with new message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: 'now', unreadCount: 0 }
          : conv
      ));
      
      setNewMessage('');
    }
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedConversation(null)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <img
              src={selectedConversation.participantImage}
              alt={selectedConversation.participantName}
              className="w-10 h-10 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{selectedConversation.participantName}</h3>
                {selectedConversation.isArtist && (
                  <Badge variant="secondary" className="text-xs">Artist</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.isOnline ? 'Online' : 'Last seen 2h ago'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages
            .filter(msg => 
              (msg.senderId === selectedConversation.participantId && msg.receiverId === 'me') ||
              (msg.senderId === 'me' && msg.receiverId === selectedConversation.participantId)
            )
            .map((message) => (
            <div key={message.id} className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                {message.senderId !== 'me' && (
                  <img
                    src={selectedConversation.participantImage}
                    alt={selectedConversation.participantName}
                    className="w-8 h-8 rounded-full mb-1"
                  />
                )}
                
                <div className={`p-3 rounded-2xl ${
                  message.senderId === 'me' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-gray-100'
                }`}>
                  {message.type === 'artwork' && message.artworkImage && (
                    <div className="mb-2">
                      <img
                        src={message.artworkImage}
                        alt="Shared artwork"
                        className="w-full rounded-lg max-w-48"
                      />
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                
                <p className={`text-xs text-muted-foreground mt-1 ${
                  message.senderId === 'me' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp}
                  {message.senderId === 'me' && (
                    <span className="ml-1">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Image className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={handleSendMessage} size="sm" className="p-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-white pb-20">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Connect with artists and art enthusiasts in your community.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" className="p-4 h-auto flex flex-col gap-2">
            <Heart className="h-6 w-6" />
            <span className="text-sm">Message Saved Artists</span>
          </Button>
          <Button variant="outline" className="p-4 h-auto flex flex-col gap-2">
            <Search className="h-6 w-6" />
            <span className="text-sm">Find New Artists</span>
          </Button>
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          <h2 className="mb-4">Recent Conversations</h2>
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                setSelectedConversation(conversation);
                markAsRead(conversation.id);
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="relative">
                <img
                  src={conversation.participantImage}
                  alt={conversation.participantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{conversation.participantName}</h4>
                  {conversation.isArtist && (
                    <Badge variant="secondary" className="text-xs">Artist</Badge>
                  )}
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {conversation.lastMessageTime}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No conversations found</h3>
            <p className="text-muted-foreground mb-4">
              Start connecting with artists to begin conversations.
            </p>
            <Button>Discover Artists</Button>
          </div>
        )}
      </div>
    </div>
  );
}
