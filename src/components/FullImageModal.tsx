import React from 'react';

interface FullImageModalProps {
  image: string | null;
  title: string;
  artist?: string;
  onClose: () => void;
}

const FullImageModal: React.FC<FullImageModalProps> = ({ image, title, artist, onClose }) => {
  if (!image) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div style={{
        position: 'relative',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2001
          }}
        >
          ×
        </button>
        
        {/* Full size image */}
        <img 
          src={image}
          alt={title}
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        />
        
        {/* Image info */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '12px 20px',
          borderRadius: '8px',
          marginTop: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#111827'}}>
            {title}
          </h3>
          {artist && (
            <p style={{margin: '0', fontSize: '14px', color: '#6b7280'}}>
              by {artist}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullImageModal;
