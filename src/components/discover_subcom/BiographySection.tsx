import React from 'react';

interface Artist {
  name: string;
  fullBio: string;
}

interface BiographySectionProps {
  artist: Artist;
  isOwner: boolean;
  onEdit: () => void;
}

export default function BiographySection({
  artist,
  isOwner,
  onEdit
}: BiographySectionProps) {
  return (
    <div style={{marginBottom: '32px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <img
            src="/profile.png"
            alt="Bio"
            style={{
              width: '18px',
              height: '18px',
              objectFit: 'contain'
            }}
          />
          <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Bio</h3>
        </div>
        {isOwner && (
          <button
            onClick={onEdit}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(97, 133, 139, 1)',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px -2px rgba(128, 150, 147, 0.93)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(97, 133, 139, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(97, 133, 139, 1)';
            }}
          >
            <img src="/edit.png" alt="Edit" style={{width: '16px', height: '16px'}} />
          </button>
        )}
      </div>
      <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap'}}>
        {artist.fullBio}
      </p>
    </div>
  );
}