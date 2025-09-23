import React from 'react';

interface EventCardProps {
  event: any;
  variant: 'user' | 'public';
  onEventClick: (eventData: any) => void;
  onEdit?: () => void;
  onDelete?: (eventId: any) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  variant,
  onEventClick,
  onEdit,
  onDelete
}) => {
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
    attendees: event.attendees || 0
  });

  const handleCardClick = () => {
    onEventClick(createEventData());
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
              <span style={{fontSize: '13px', color: '#6b7280'}}>{event.attendees || 0}</span>
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
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={handleEditClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
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
              <button style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Join Event
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