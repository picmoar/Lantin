import { useState } from 'react';

interface MessagesTabProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
  };
  handleGoogleLogin: () => void;
  handleMobileTestLogin: () => void;
}

export default function MessagesTab({ 
  auth, 
  handleGoogleLogin, 
  handleMobileTestLogin 
}: MessagesTabProps) {
  const [showLantinChat, setShowLantinChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'lantin',
      text: "Welcome to Lantin! We're excited to have you join our community of artists and art lovers. 🎨",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
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
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Messages
        </h2>
      </div>
      
      {auth.isLoggedIn ? (
        <div style={{backgroundColor: '#ffffff'}}>
          {/* Conversation List */}
          <div>
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

            {/* Art Fair Brooklyn Group */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{
                width: '52px',
                height: '52px',
                position: 'relative',
                marginRight: '16px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  border: '2px solid white',
                  zIndex: 3,
                  overflow: 'hidden'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                    alt="Art Fair Member"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '8px',
                  left: '16px',
                  border: '2px solid white',
                  zIndex: 2,
                  overflow: 'hidden'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" 
                    alt="Art Fair Member"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#6366f1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  border: '2px solid white',
                  zIndex: 4
                }}>
                  <span style={{color: 'white', fontWeight: 'bold', fontSize: '10px'}}>+3</span>
                </div>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                  <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827'}}>Art Fair Brooklyn Group</h4>
                  <span style={{fontSize: '12px', color: '#6b7280'}}>1h</span>
                </div>
                <p style={{margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  Maya: Let's coordinate for the weekend event! I'll bring the setup materials.
                </p>
              </div>
            </div>

            {/* Sarah Miller Studio */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                marginRight: '16px',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid #e5e7eb'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616c2ee7dfe?w=100&h=100&fit=crop&crop=face" 
                  alt="Sarah Miller"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}></div>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                  <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827'}}>Sarah Miller Studio</h4>
                  <span style={{fontSize: '12px', color: '#6b7280'}}>3h</span>
                </div>
                <p style={{margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  Thanks for visiting my booth! Check out my new ceramic collection launching next month.
                </p>
              </div>
            </div>

            {/* Gallery Collaboration Group */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{
                width: '52px',
                height: '52px',
                position: 'relative',
                marginRight: '16px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  border: '2px solid white',
                  zIndex: 3,
                  overflow: 'hidden'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" 
                    alt="Gallery Member"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '8px',
                  left: '16px',
                  border: '2px solid white',
                  zIndex: 2,
                  overflow: 'hidden'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face" 
                    alt="Gallery Member"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#dc2626',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  border: '2px solid white',
                  zIndex: 4
                }}>
                  <span style={{color: 'white', fontWeight: 'bold', fontSize: '10px'}}>+7</span>
                </div>
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                  <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827'}}>Gallery Collaboration</h4>
                  <span style={{fontSize: '12px', color: '#6b7280'}}>5h</span>
                </div>
                <p style={{margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  Alex: The exhibition space looks amazing! Ready for the opening night.
                </p>
              </div>
            </div>
          </div>

          {/* Empty state for additional messages */}
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{fontSize: '32px', marginBottom: '12px'}}>💬</div>
            <p style={{fontSize: '14px', margin: 0}}>
              Connect with more booths and artists to start new conversations
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '48px', marginBottom: '20px'}}>🔐</div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Sign in to access messages
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.5',
            marginBottom: '24px'
          }}>
            Connect with artists and start conversations about their work
          </p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px'}}>
            <button 
              onClick={handleGoogleLogin}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                width: '100%'
              }}
            >
              🚀 Sign in with Google
            </button>
            <button 
              onClick={handleMobileTestLogin}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                width: '100%'
              }}
            >
              📱 Mobile Test Login
            </button>
          </div>
        </div>
      )}

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
              {messages.map((message) => (
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
                    setMessages([...messages, {
                      id: messages.length + 1,
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
                      setMessages(prev => [...prev, {
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
                    setMessages([...messages, {
                      id: messages.length + 1,
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
                      setMessages(prev => [...prev, {
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
    </div>
  );
}
