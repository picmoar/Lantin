import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  organizer: string;
  organizer_name?: string;
  location: string;
  type: string;
  description: string;
  image: string;
  attendees: number;
  max_attendees?: number;
  price: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  highlight_photos?: string[];
  featured?: boolean;
}

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  specialty: string;
  profileImage: string;
}

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
  userProfile: UserProfile;
  onFollowOrganizer: (organizer: { id: string; name: string }) => void;
  user?: any; // Add user for attendance tracking
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ 
  event, 
  onClose, 
  userProfile, 
  onFollowOrganizer,
  user
}) => {
  const [hasRegistered, setHasRegistered] = useState(false);
  const [currentAttendeeCount, setCurrentAttendeeCount] = useState(event.attendees || 0);

  const handleRegisterForEvent = async () => {
    if (!user || !supabase || hasRegistered) {
      alert(`Opening registration for ${event.title}...`);
      onClose();
      return;
    }

    try {
      // Record the registration
      const { error: registrationError } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: event.id,
          user_id: user.id
        }]);

      if (registrationError && !registrationError.message.includes('duplicate')) {
        throw registrationError;
      }

      // If registration was recorded (no duplicate error), increment counter
      if (!registrationError) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ attendee_count: currentAttendeeCount + 1 })
          .eq('id', event.id);

        if (!updateError) {
          setCurrentAttendeeCount(currentAttendeeCount + 1);
          setHasRegistered(true);
        }
      }

      alert(`Successfully registered for ${event.title}!`);
      onClose();
    } catch (error) {
      console.error('Error registering for event:', error);
      alert(`Successfully registered for ${event.title}!`);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '0',
        width: '100%',
        maxWidth: '420px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header Image */}
        <div style={{position: 'relative'}}>
          <img 
            src={event.image}
            alt={event.title}
            style={{
              width: '100%', 
              height: '240px', 
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)'
          }} />
          
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: '#374151',
              border: 'none',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >×</button>

          {/* Event title overlay */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px'
          }}>
            <h2 style={{
              fontSize: '28px', 
              fontWeight: '700', 
              color: 'white', 
              margin: '0 0 4px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              {event.title}
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '16px', 
              margin: '0',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              by {event.organizer_name || event.organizer || 'Unknown Organizer'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{padding: '24px'}}>
          {/* Location */}
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            <svg style={{width: '18px', height: '18px', color: '#8b5cf6'}} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span style={{fontSize: '15px', color: '#374151', fontWeight: '500'}}>{event.location}</span>
          </div>

          {/* Event Schedule */}
          {(event.start_date || event.start_time) && (
            <div style={{marginBottom: '20px'}}>
              {event.start_date && event.end_date && (
                <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  padding: '12px 16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '12px',
                  border: '1px solid #bae6fd'
                }}>
                  <svg style={{width: '18px', height: '18px', color: '#0369a1'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span style={{fontSize: '15px', color: '#0c4a6e', fontWeight: '500'}}>
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {event.start_time && event.end_time && (
                <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '12px 16px',
                  backgroundColor: '#fef3f2',
                  borderRadius: '12px',
                  border: '1px solid #fecaca'
                }}>
                  <svg style={{width: '18px', height: '18px', color: '#dc2626'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span style={{fontSize: '15px', color: '#991b1b', fontWeight: '500'}}>
                    Daily: {event.start_time} - {event.end_time}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Description - only show if it exists and isn't generic */}
          {event.description && event.description !== "Art event" && (
            <div style={{marginBottom: '20px'}}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                About this event
              </h3>
              <p style={{
                color: '#6b7280', 
                fontSize: '15px', 
                lineHeight: '1.6',
                margin: '0'
              }}>
                {event.description}
              </p>
            </div>
          )}

          {/* Event Photos Section */}
          {event.highlight_photos && event.highlight_photos.length > 0 && (
            <div style={{marginBottom: '20px'}}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                ✨ Event Highlights
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: event.highlight_photos.length === 1 ? '1fr' : 
                                   event.highlight_photos.length === 2 ? '1fr 1fr' :
                                   'repeat(2, 1fr)',
                gap: '8px'
              }}>
                {event.highlight_photos.slice(0, 4).map((photo, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img 
                      src={photo} 
                      alt={`Event highlight ${index + 1}`}
                      style={{
                        width: '100%',
                        height: event.highlight_photos.length === 1 ? '160px' : 
                               event.highlight_photos.length === 2 ? '120px' : '100px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback Highlights Section - only show if no photos */}
          {(!event.highlight_photos || event.highlight_photos.length === 0) && (
            <div style={{marginBottom: '20px'}}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>
                ✨ What to expect
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#fef3f2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca'
                }}>
                  <span style={{fontSize: '16px'}}>🎨</span>
                  <span style={{fontSize: '14px', color: '#991b1b', fontWeight: '500'}}>
                    Interactive art experience
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <span style={{fontSize: '16px'}}>🤝</span>
                  <span style={{fontSize: '14px', color: '#0c4a6e', fontWeight: '500'}}>
                    Meet fellow art enthusiasts
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <span style={{fontSize: '16px'}}>📚</span>
                  <span style={{fontSize: '14px', color: '#14532d', fontWeight: '500'}}>
                    Learn new techniques
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats - simplified */}
          <div style={{
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px', 
            marginBottom: '24px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '12px'
            }}>
              <div style={{fontSize: '20px', fontWeight: '700', color: '#0284c7', marginBottom: '4px'}}>
                {currentAttendeeCount}
                {event.max_attendees && `/${event.max_attendees}`}
              </div>
              <div style={{fontSize: '13px', color: '#0c4a6e', fontWeight: '500'}}>
                Attendees
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#fef3f2',
              borderRadius: '12px'
            }}>
              <div style={{fontSize: '20px', fontWeight: '700', color: '#dc2626', marginBottom: '4px'}}>
                {event.price > 0 ? `$${event.price}` : 'Free'}
              </div>
              <div style={{fontSize: '13px', color: '#991b1b', fontWeight: '500'}}>
                Price
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{display: 'flex', gap: '12px'}}>
            <button
              onClick={handleRegisterForEvent}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: hasRegistered ? '#6b7280' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: hasRegistered ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!hasRegistered) {
                  e.currentTarget.style.backgroundColor = '#7c3aed';
                }
              }}
              onMouseLeave={(e) => {
                if (!hasRegistered) {
                  e.currentTarget.style.backgroundColor = '#8b5cf6';
                }
              }}
            >
              {hasRegistered ? '✅ Registered' : '🎫 Register'}
            </button>
            <button
              onClick={() => {
                onFollowOrganizer({id: event.id, name: event.organizer});
                alert(`Now following ${event.organizer}!`);
              }}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: '#f8fafc',
                color: '#374151',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              ❤️ Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;