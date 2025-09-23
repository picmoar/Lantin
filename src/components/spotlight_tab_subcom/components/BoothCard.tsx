import React from 'react';

interface BoothCardProps {
  booth: any;
  index: number;
  currentUserId?: string;
  onBoothClick: (boothData: any) => void;
  onDelete: (boothId: any) => void;
}

const BoothCard: React.FC<BoothCardProps> = ({
  booth,
  index,
  currentUserId,
  onBoothClick,
  onDelete
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (!e.target.closest('.booth-delete-button')) {
      const selectedBoothData = {
        id: booth.id,
        name: booth.name,
        artist: booth.artist,
        operator_name: booth.operator_name,
        location: booth.location,
        image: booth.image,
        description: booth.description,
        start_date: booth.start_date,
        end_date: booth.end_date,
        start_time: booth.start_time,
        end_time: booth.end_time,
        highlight_photos: booth.highlight_photos || [],
        visitors: 45 + (index * 15)
      };
      console.log('Booth clicked, data being passed to modal:', selectedBoothData);
      console.log('Original booth data:', booth);
      onBoothClick(selectedBoothData);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(booth.id);
  };

  return (
    <div
      style={{
        minWidth: '280px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={handleCardClick}
    >
      <img
        src={booth.image}
        alt={booth.name}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover'
        }}
      />
      <div style={{padding: '12px'}}>
        <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}>
          {booth.name}
        </h3>
        <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '8px'}}>
          {booth.artist}
        </p>
        <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px'}}>
          <svg style={{width: '14px', height: '14px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span style={{fontSize: '13px', color: '#6b7280'}}>{booth.location}</span>
        </div>
        <div style={{display: 'flex', gap: '8px'}}>
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
            Visit
          </button>
          {currentUserId && booth.artist_id === currentUserId && (
            <button
              onClick={handleDeleteClick}
              className="booth-delete-button"
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoothCard;