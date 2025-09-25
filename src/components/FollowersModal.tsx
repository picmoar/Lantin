import React from 'react';

interface Follower {
  id: string;
  name: string;
  profileImage: string;
  specialty?: string;
  location?: string;
}

interface FollowersModalProps {
  followers: Follower[];
  onClose: () => void;
}

export default function FollowersModal({ followers, onClose }: FollowersModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            color: '#111827'
          }}>
            Followers ({followers.length})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {followers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.5
            }}>
              👥
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#374151'
            }}>
              No followers yet
            </h3>
            <p style={{
              fontSize: '14px',
              margin: 0,
              lineHeight: '1.5'
            }}>
              When people follow you, they'll appear here
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {followers.map((follower) => (
              <div
                key={follower.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fafafb',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '12px',
                  flexShrink: 0,
                  border: '2px solid #e5e7eb'
                }}>
                  <img
                    src={follower.profileImage}
                    alt={follower.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    margin: '0 0 2px 0',
                    color: '#111827'
                  }}>
                    {follower.name}
                  </h4>
                  {follower.specialty && (
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: '0 0 1px 0'
                    }}>
                      {follower.specialty}
                    </p>
                  )}
                  {follower.location && (
                    <p style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      margin: 0
                    }}>
                      {follower.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}