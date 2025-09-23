import React from 'react';

interface ContactInfo {
  email: string;
  location: string;
}

interface Artist {
  name: string;
  location: string;
  discoverEmail?: string;
  discoverLocation?: string;
}

interface ContactSectionProps {
  contactInfo: ContactInfo;
  artist: Artist;
  isOwner: boolean;
  isLoading: boolean;
  onEdit: () => void;
}

export default function ContactSection({
  contactInfo,
  artist,
  isOwner,
  isLoading,
  onEdit
}: ContactSectionProps) {
  const displayEmail = contactInfo.email ||
                      (artist as any).discoverEmail ||
                      (isOwner ? 'Click Edit to add your email' : 'No email provided');

  const displayLocation = contactInfo.location ||
                         (artist as any).discoverLocation ||
                         (isOwner ? 'Click Edit to add your location' : artist.location);

  return (
    <div style={{marginBottom: '32px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
        <span style={{fontSize: '18px'}}>📞</span>
        <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Contact</h3>
        {isOwner && (
          <button
            onClick={onEdit}
            style={{
              marginLeft: 'auto',
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

      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{marginBottom: '12px'}}>
          <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>Email</div>
          <div style={{fontSize: '14px', color: '#111827', fontWeight: '500'}}>
            {isLoading ? 'Loading...' : displayEmail}
          </div>
        </div>

        <div style={{marginBottom: '12px'}}>
          <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>Studio Location</div>
          <div style={{fontSize: '14px', color: '#111827', fontWeight: '500'}}>
            {isLoading ? 'Loading...' : displayLocation}
          </div>
        </div>

        <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
          <button style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#7c3aed';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#8b5cf6';
          }}
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}