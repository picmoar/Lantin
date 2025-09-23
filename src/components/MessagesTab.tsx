import { useState } from 'react';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';

interface MessagesTabProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
  };
}

export default function MessagesTab({ auth }: MessagesTabProps) {
  const [showLantinChat, setShowLantinChat] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Swipe gesture states
  const [swipeStates, setSwipeStates] = useState<Record<string, {
    startX: number;
    currentX: number;
    isDragging: boolean;
    showDelete: boolean;
    isDeleteRevealed: boolean;
  }>>({});
  const [lantinMessages, setLantinMessages] = useState([
    {
      id: 1,
      sender: 'lantin',
      text: "Welcome to Lantin! We're excited to have you join our community of artists and art lovers. 🎨",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]);

  // Real messaging hooks
  const { conversations, loading: conversationsLoading, createConversation, deleteConversation } = useConversations({
    userId: auth.user?.id,
    enabled: auth.isLoggedIn
  });

  const { messages, loading: messagesLoading, sendMessage, sending } = useMessages({
    conversationId: selectedConversationId,
    userId: auth.user?.id,
    enabled: !!selectedConversationId
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !content.trim()) return;

    const success = await sendMessage(content);
    if (success) {
      setNewMessage('');
    }
  };

  const openConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowConversationModal(true);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent, conversationId: string) => {
    const touch = e.touches[0];
    const currentState = swipeStates[conversationId];

    // If delete is already revealed, don't start new swipe
    if (currentState?.isDeleteRevealed) return;

    setSwipeStates(prev => ({
      ...prev,
      [conversationId]: {
        startX: touch.clientX,
        currentX: touch.clientX,
        isDragging: true,
        showDelete: false,
        isDeleteRevealed: false
      }
    }));
  };

  const handleTouchMove = (e: React.TouchEvent, conversationId: string) => {
    const touch = e.touches[0];
    const state = swipeStates[conversationId];
    if (!state?.isDragging || state.isDeleteRevealed) return;

    const deltaX = state.startX - touch.clientX;
    setSwipeStates(prev => ({
      ...prev,
      [conversationId]: {
        ...state,
        currentX: touch.clientX,
        showDelete: deltaX > 60
      }
    }));
  };

  const handleTouchEnd = (conversationId: string) => {
    const state = swipeStates[conversationId];
    if (!state?.isDragging || state.isDeleteRevealed) return;

    const deltaX = state.startX - state.currentX;

    if (deltaX > 80) {
      // Reveal delete button and freeze
      setSwipeStates(prev => ({
        ...prev,
        [conversationId]: {
          ...state,
          isDragging: false,
          showDelete: true,
          isDeleteRevealed: true
        }
      }));
    } else {
      // Reset to original position
      setSwipeStates(prev => ({
        ...prev,
        [conversationId]: {
          startX: 0,
          currentX: 0,
          isDragging: false,
          showDelete: false,
          isDeleteRevealed: false
        }
      }));
    }
  };

  const hideDeleteButton = (conversationId: string) => {
    setSwipeStates(prev => ({
      ...prev,
      [conversationId]: {
        startX: 0,
        currentX: 0,
        isDragging: false,
        showDelete: false,
        isDeleteRevealed: false
      }
    }));
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const success = await deleteConversation(conversationId);
    if (success && selectedConversationId === conversationId) {
      setSelectedConversationId(null);
      setShowConversationModal(false);
    }
  };

  // MessagesTab now only handles messaging functionality
  return (
    <div style={{
      padding: '0',
      minHeight: 'calc(100vh - 140px)',
      backgroundColor: '#ffffff'
    }}>
      {/* Messages Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Messages
        </h2>
      </div>
      
      {/* Messages Content - User is logged in at this point */}
      <div style={{backgroundColor: '#ffffff'}}>
          {/* Conversation List */}
          <div>
            {/* Real Conversations */}
            {conversations.map((conversation) => {
              const swipeState = swipeStates[conversation.id];
              const deltaX = swipeState ? swipeState.startX - swipeState.currentX : 0;
              const translateX = swipeState?.isDragging ? Math.min(0, -deltaX) :
                                 swipeState?.isDeleteRevealed ? -80 : 0;

              return (
                <div
                  key={conversation.id}
                  style={{
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Delete background */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '80px',
                      backgroundColor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: swipeState?.showDelete ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                      cursor: swipeState?.isDeleteRevealed ? 'pointer' : 'default'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (swipeState?.isDeleteRevealed) {
                        handleDeleteConversation(conversation.id);
                        hideDeleteButton(conversation.id);
                      }
                    }}
                  >
                    <span style={{
                      color: 'white',
                      fontSize: '18px',
                      pointerEvents: 'none'
                    }}>🗑️</span>
                  </div>

                  {/* Conversation item */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: swipeState?.isDragging ? 'none' : 'transform 0.3s ease, background-color 0.15s',
                      transform: `translateX(${translateX}px)`,
                      backgroundColor: 'white'
                    }}
                    onClick={(e) => {
                      if (swipeState?.isDeleteRevealed) {
                        // Cancel delete mode
                        hideDeleteButton(conversation.id);
                      } else if (!swipeState?.isDragging) {
                        openConversation(conversation.id);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!swipeState?.isDragging) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!swipeState?.isDragging) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                    onTouchStart={(e) => handleTouchStart(e, conversation.id)}
                    onTouchMove={(e) => handleTouchMove(e, conversation.id)}
                    onTouchEnd={() => handleTouchEnd(conversation.id)}
                  >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  marginRight: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                  backgroundColor: '#f3f4f6'
                }}>
                  {conversation.otherUser?.profileImage ? (
                    <img
                      src={conversation.otherUser.profileImage}
                      alt={conversation.otherUser.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎨</div>';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      🎨
                    </div>
                  )}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                    <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827'}}>
                      {conversation.otherUser?.name || 'Unknown User'}
                    </h4>
                    {conversation.last_message_at && (
                      <span style={{fontSize: '12px', color: '#6b7280'}}>
                        {formatTimeAgo(conversation.last_message_at)}
                      </span>
                    )}
                  </div>
                  <p style={{margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {conversation.last_message || 'No messages yet'}
                  </p>
                </div>
                  </div>
                </div>
              );
            })}
            {/* Lantin Official */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              background: 'linear-gradient(90deg, #fafbff 0%, #ffffff 100%)'
            }}
            onClick={() => setShowLantinChat(true)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f4ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #fafbff 0%, #ffffff 100%)'}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                marginRight: '16px',
                position: 'relative',
                overflow: 'hidden',
                border: '3px solid #8b5cf6',
                backgroundColor: 'white'
              }}>
                <img 
                  src="/logo2.png" 
                  alt="Lantin Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback to emoji if logo not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentNode.innerHTML = '<div style="width: 100%; height: 100%; background: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎨</div>';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  border: '3px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{color: 'white', fontSize: '8px'}}>✓</span>
                </div>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                  <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    Lantin Official 
                    <span style={{background: '#8b5cf6', color: 'white', padding: '2px 6px', borderRadius: '12px', fontSize: '10px', fontWeight: '500'}}>OFFICIAL</span>
                  </h4>
                  <span style={{fontSize: '12px', color: '#6b7280'}}>2h</span>
                </div>
                <p style={{margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  Welcome to Lantin! We're excited to have you join our community of artists and art lovers. 🎨
                </p>
              </div>
            </div>

          </div>

          {/* Empty state */}
          {!conversationsLoading && conversations.length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{fontSize: '32px', marginBottom: '12px'}}>💬</div>
              <p style={{fontSize: '14px', margin: 0}}>
                Connect with artists on Discover tab to start new conversations
              </p>
            </div>
          )}

          {/* Loading state */}
          {conversationsLoading && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{fontSize: '32px', marginBottom: '12px'}}>💬</div>
              <p style={{fontSize: '14px', margin: 0}}>
                Loading conversations...
              </p>
            </div>
          )}
        </div>

      {/* Lantin Chat Modal */}
      {showLantinChat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowLantinChat(false);
          }
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #8b5cf6'
                }}>
                  <img 
                    src="/logo2.png" 
                    alt="Lantin Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentNode.innerHTML = '<div style="width: 100%; height: 100%; background: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎨</div>';
                    }}
                  />
                </div>
                <div>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827'}}>
                    Lantin Official
                  </h3>
                  <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>Usually responds instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLantinChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px'
            }}>
              {lantinMessages.map((message) => (
                <div key={message.id} style={{
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  {message.sender === 'lantin' ? (
                    <>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img 
                          src="/logo2.png" 
                          alt="Lantin"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentNode.innerHTML = '<div style="width: 100%; height: 100%; background: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 16px;">🎨</div>';
                          }}
                        />
                      </div>
                      <div style={{
                        backgroundColor: '#f3f4f6',
                        padding: '12px 16px',
                        borderRadius: '16px 16px 16px 4px',
                        maxWidth: '70%'
                      }}>
                        <p style={{margin: 0, fontSize: '14px', color: '#111827', lineHeight: '1.4'}}>
                          {message.text}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{flex: 1}} />
                      <div style={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '16px 16px 4px 16px',
                        maxWidth: '70%'
                      }}>
                        <p style={{margin: 0, fontSize: '14px', lineHeight: '1.4'}}>
                          {message.text}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    setLantinMessages([...lantinMessages, {
                      id: lantinMessages.length + 1,
                      sender: 'user',
                      text: newMessage,
                      timestamp: new Date()
                    }]);
                    setNewMessage('');

                    // Simulate Lantin response
                    setTimeout(() => {
                      const responses = [
                        "Thanks for reaching out! How can I help you today?",
                        "Great question! Let me help you with that.",
                        "I'm here to help! What would you like to know about Lantin?",
                        "Welcome to Lantin! Feel free to ask me anything about our platform."
                      ];
                      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                      setLantinMessages(prev => [...prev, {
                        id: prev.length + 1,
                        sender: 'lantin',
                        text: randomResponse,
                        timestamp: new Date()
                      }]);
                    }, 1000);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newMessage.trim()) {
                    setLantinMessages([...lantinMessages, {
                      id: lantinMessages.length + 1,
                      sender: 'user',
                      text: newMessage,
                      timestamp: new Date()
                    }]);
                    setNewMessage('');

                    // Simulate Lantin response
                    setTimeout(() => {
                      const responses = [
                        "Thanks for reaching out! How can I help you today?",
                        "Great question! Let me help you with that.",
                        "I'm here to help! What would you like to know about Lantin?",
                        "Welcome to Lantin! Feel free to ask me anything about our platform."
                      ];
                      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                      setLantinMessages(prev => [...prev, {
                        id: prev.length + 1,
                        sender: 'lantin',
                        text: randomResponse,
                        timestamp: new Date()
                      }]);
                    }, 1000);
                  }
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Conversation Modal */}
      {showConversationModal && selectedConversationId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowConversationModal(false);
            setSelectedConversationId(null);
          }
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6'
                }}>
                  {conversations.find(c => c.id === selectedConversationId)?.otherUser?.profileImage ? (
                    <img
                      src={conversations.find(c => c.id === selectedConversationId)?.otherUser?.profileImage}
                      alt={conversations.find(c => c.id === selectedConversationId)?.otherUser?.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 16px;">🎨</div>';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      🎨
                    </div>
                  )}
                </div>
                <div>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827'}}>
                    {conversations.find(c => c.id === selectedConversationId)?.otherUser?.name || 'Unknown User'}
                  </h3>
                  <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>Artist</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowConversationModal(false);
                  setSelectedConversationId(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px'
            }}>
              {messagesLoading ? (
                <div style={{textAlign: 'center', color: '#6b7280', padding: '20px'}}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{textAlign: 'center', color: '#6b7280', padding: '20px'}}>
                  <div style={{fontSize: '24px', marginBottom: '8px'}}>💬</div>
                  <p>Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} style={{
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    flexDirection: message.sender_id === auth.user?.id ? 'row-reverse' : 'row'
                  }}>
                    {message.sender_id !== auth.user?.id && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        🎨
                      </div>
                    )}
                    <div style={{
                      backgroundColor: message.sender_id === auth.user?.id ? '#8b5cf6' : '#f3f4f6',
                      color: message.sender_id === auth.user?.id ? 'white' : '#111827',
                      padding: '12px 16px',
                      borderRadius: message.sender_id === auth.user?.id ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      maxWidth: '70%'
                    }}>
                      <p style={{margin: 0, fontSize: '14px', lineHeight: '1.4'}}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div style={{
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessage.trim() && !sending) {
                    handleSendMessage(newMessage);
                  }
                }}
              />
              <button
                onClick={() => handleSendMessage(newMessage)}
                disabled={!newMessage.trim() || sending}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: (!newMessage.trim() || sending) ? '#d1d5db' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                {sending ? '...' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
