import React, { useState, useEffect } from 'react';
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
  const [currentAttendeeCount, setCurrentAttendeeCount] = useState(0);

  // Load real attendee count and check registration status on component mount
  useEffect(() => {
    const loadEventData = async () => {
      if (!supabase) return;

      try {
        // Get real attendee count from database
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('attendee_count')
          .eq('id', event.id)
          .single();

        if (eventData && !eventError) {
          setCurrentAttendeeCount(eventData.attendee_count || 0);
        }

        // Check if current user has registered (only if logged in)
        if (user) {
          const { data: registrationData, error: registrationError } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', event.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (registrationData && !registrationError) {
            setHasRegistered(true);
          }
        }
      } catch (error) {
        console.warn('Error loading event data:', error);
      }
    };

    loadEventData();
  }, [event.id, user, supabase]);

  const handleRegistrationToggle = async () => {
    if (!user || !supabase) {
      alert('Please log in to register for events');
      return;
    }

    try {
      if (hasRegistered) {
        // Cancel registration - remove from database
        const { error: deleteError } = await supabase
          .from('event_registrations')
          .delete()
          .eq('event_id', event.id)
          .eq('user_id', user.id);

        if (!deleteError) {
          // Decrement attendee count
          const { error: updateError } = await supabase
            .from('events')
            .update({ attendee_count: Math.max(0, currentAttendeeCount - 1) })
            .eq('id', event.id);

          if (!updateError) {
            setCurrentAttendeeCount(Math.max(0, currentAttendeeCount - 1));
            setHasRegistered(false);
          }
        }
      } else {
        // Add registration - insert into database
        const { error: registrationError } = await supabase
          .from('event_registrations')
          .insert([{
            event_id: event.id,
            user_id: user.id
          }]);

        if (!registrationError) {
          // Increment attendee count
          const { error: updateError } = await supabase
            .from('events')
            .update({ attendee_count: currentAttendeeCount + 1 })
            .eq('id', event.id);

          if (!updateError) {
            setCurrentAttendeeCount(currentAttendeeCount + 1);
            setHasRegistered(true);
          }
        } else if (registrationError.code === '23505') {
          // Duplicate key - user already registered, just update local state
          setHasRegistered(true);
        }
      }
    } catch (error) {
      console.warn('Error toggling event registration:', error);
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
      zIndex: 1010,
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


          {/* Attendee Count */}
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'rgba(97, 133, 139, 0.1)',
              borderRadius: '12px'
            }}>
              <div style={{fontSize: '20px', fontWeight: '700', color: '#61858b', marginBottom: '4px'}}>
                {currentAttendeeCount}
                {event.max_attendees && `/${event.max_attendees}`}
              </div>
              <div style={{fontSize: '13px', color: '#61858b', fontWeight: '500'}}>
                Attendees
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={handleRegistrationToggle}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: hasRegistered ? '#dc2626' : '#61858b',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (hasRegistered) {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                } else {
                  e.currentTarget.style.backgroundColor = '#57717a';
                }
              }}
              onMouseLeave={(e) => {
                if (hasRegistered) {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                } else {
                  e.currentTarget.style.backgroundColor = '#61858b';
                }
              }}
            >
              {hasRegistered ? 'Cancel Registration' : 'Join Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;