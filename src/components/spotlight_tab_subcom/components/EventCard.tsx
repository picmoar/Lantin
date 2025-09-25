import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface EventCardProps {
  event: any;
  variant: 'user' | 'public';
  user?: any;
  onEventClick: (eventData: any) => void;
  onEdit?: () => void;
  onDelete?: (eventId: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  variant,
  user,
  onEventClick,
  onEdit,
  onDelete
}) => {
  const [hasRegistered, setHasRegistered] = useState(false);
  const [currentAttendeeCount, setCurrentAttendeeCount] = useState(0);

  // Load registration status and attendee count on mount
  useEffect(() => {
    const loadRegistrationData = async () => {
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
        console.warn('Error loading registration data for event card:', error);
      }
    };

    loadRegistrationData();
  }, [event.id, user]);

  const handleRegistrationToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

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

  const createEventData = () => ({
    id: event.id,
    title: event.title,
    organizer: event.organizer_name || event.organizer || 'Unknown Organizer',
    organizer_name: event.organizer_name,
    location: event.location,
    image: event.image,
    description: event.description,
    start_date: event.start_date,
    end_date: event.end_date,
    start_time: event.start_time,
    end_time: event.end_time,
    highlight_photos: event.highlight_photos || [],
    price: event.price || 0,
    type: event.type,
    max_attendees: event.max_attendees,
    attendees: currentAttendeeCount
  });

  const handleCardClick = (e: React.MouseEvent) => {
    if (!e.target.closest('.event-delete-button') && !e.target.closest('.event-join-button')) {
      onEventClick(createEventData());
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(createEventData());
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event.id);
    }
  };

  return (
    <div
      style={{
        minWidth: '280px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: variant === 'user' ? '2px solid #8b5cf6' : undefined,
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={handleCardClick}
    >
      <img
        src={event.image || 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=300&h=150&fit=crop'}
        alt={event.title}
        style={{
          width: '100%',
          height: variant === 'user' ? '120px' : '150px',
          objectFit: 'cover'
        }}
      />

      <div style={{padding: variant === 'user' ? '16px' : '12px'}}>
        <h3 style={{
          color: variant === 'user' ? '#8b5cf6' : '#111827',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: variant === 'user' ? '8px' : '4px'
        }}>
          {event.title}
        </h3>

        {variant === 'public' && (
          <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>
            {event.organizer_name || event.organizer || 'Unknown Organizer'}
          </p>
        )}

        {/* Date */}
        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px'}}>
          {variant === 'user' ? (
            <span style={{fontSize: '12px'}}>🗓️</span>
          ) : (
            <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          )}
          <span style={{fontSize: '13px', color: '#6b7280'}}>
            {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'Date TBD'}
          </span>
          {variant === 'user' && event.start_time && (
            <>
              <span style={{fontSize: '13px', color: '#6b7280'}}> • </span>
              <span style={{fontSize: '13px', color: '#6b7280'}}>{event.start_time}</span>
            </>
          )}
        </div>

        {/* Location */}
        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: variant === 'user' ? '4px' : '8px'}}>
          {variant === 'user' ? (
            <span style={{fontSize: '12px'}}>📍</span>
          ) : (
            <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          )}
          <span style={{fontSize: '13px', color: '#6b7280'}}>{event.location}</span>
        </div>

        {variant === 'user' && (
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              <span style={{fontSize: '12px'}}>💰</span>
              <span style={{fontSize: '13px', color: '#6b7280', fontWeight: '500'}}>
                {event.price > 0 ? `$${event.price}` : 'Free'}
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              <span style={{fontSize: '12px'}}>👥</span>
              <span style={{fontSize: '13px', color: '#6b7280'}}>{currentAttendeeCount}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{display: 'flex', gap: '8px'}}>
          {variant === 'user' ? (
            <>
              <button
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: 'rgba(97, 133, 139, 1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={handleEditClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(87, 113, 119, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(97, 133, 139, 1)'}
              >
                Edit
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: 'white',
                  color: '#8b5cf6',
                  border: '1px solid #8b5cf6',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={handleDetailsClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#8b5cf6';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#8b5cf6';
                }}
              >
                Details
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRegistrationToggle}
                className="event-join-button"
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  backgroundColor: hasRegistered ? '#dc2626' : '#61858b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {event.price > 0 ? `$${event.price}` : 'Free'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete button for user variant */}
      {variant === 'user' && onDelete && (
        <button
          className="event-delete-button"
          onClick={handleDeleteClick}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '24px',
            height: '24px',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default EventCard;