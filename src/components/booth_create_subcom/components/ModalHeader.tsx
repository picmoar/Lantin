import React from 'react';

interface ModalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ isEditing, onClose }) => {
  return (
    <>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#10b981',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
            padding: '4px'
          }}>
            <img
              src="/booth.png"
              alt="Booth"
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'contain'
              }}
            />
          </div>
          <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0}}>
            {isEditing ? 'Edit Booth' : 'Create Booth'}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px',
            borderRadius: '4px'
          }}
        >
          ×
        </button>
      </div>

      <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '32px', margin: '0 0 32px 0'}}>
        {isEditing ? 'Update your booth information' : 'Set up your art booth to connect with visitors'}
      </p>
    </>
  );
};

export default ModalHeader;