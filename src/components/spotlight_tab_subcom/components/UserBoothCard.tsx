import React from 'react';

interface UserBoothCardProps {
  userBooths: any[];
  currentUserBoothIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onEdit: () => void;
  onDelete: (boothId: any) => void;
}

const UserBoothCard: React.FC<UserBoothCardProps> = ({
  userBooths,
  currentUserBoothIndex,
  onPrevious,
  onNext,
  onEdit,
  onDelete
}) => {
  const currentBooth = userBooths[currentUserBoothIndex];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '2px solid #10b981',
        padding: '16px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h3 style={{color: '#10b981', fontSize: '18px', fontWeight: 'bold', margin: 0}}>
            {currentBooth.name}
          </h3>
        </div>

        <p style={{color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0'}}>
          Location: {currentBooth.location}
        </p>
        <p style={{color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0'}}>
          Status: Active • {currentBooth.visitors} visitors
        </p>

        {userBooths.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ‹
            </button>
            <button
              onClick={onNext}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          </>
        )}

        <div style={{display: 'flex', gap: '8px'}}>
          <button
            onClick={onEdit}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(97, 133, 139, 1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(87, 113, 119, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(97, 133, 139, 1)'}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(currentBooth.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>

        {userBooths.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {currentUserBoothIndex + 1} of {userBooths.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBoothCard;