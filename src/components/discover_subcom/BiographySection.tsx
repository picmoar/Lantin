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
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            ✏️ Edit
          </button>
        )}
      </div>
      <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '14px', margin: 0, whiteSpace: 'pre-wrap'}}>
        {artist.fullBio}
      </p>
    </div>
  );
}