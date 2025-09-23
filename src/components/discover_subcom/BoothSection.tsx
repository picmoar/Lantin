import React from 'react';

interface BoothInfo {
  name: string;
  artistName: string;
  location: string;
  description: string;
  image: string;
}

interface Artist {
  name: string;
  location: string;
  isRealUser?: boolean;
  boothData?: BoothInfo;
}

interface BoothSectionProps {
  boothInfo: BoothInfo;
  artist: Artist;
  isOwner: boolean;
  isLoading: boolean;
  onEdit: () => void;
}

export default function BoothSection({
  boothInfo,
  artist,
  isOwner,
  isLoading,
  onEdit
}: BoothSectionProps) {
  const displayName = boothInfo.name ||
                     (artist as any).boothData?.name ||
                     (isOwner ? 'Click Edit to add booth info' : `${artist.name}'s Studio`);

  const displayArtistName = boothInfo.artistName ||
                           (artist as any).boothData?.artistName ||
                           artist.name;

  const displayLocation = boothInfo.location ||
                         (artist as any).boothData?.location ||
                         (isOwner ? 'Click Edit to add location' : artist.location);

  const displayImage = boothInfo.image ||
                      (artist as any).boothData?.image ||
                      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop';

  const handleVisit = () => {
    const realUser = artist as any;
    const boothName = boothInfo.name || (artist as any).boothData?.name || `${artist.name}'s Studio`;
    const boothLocation = boothInfo.location || (artist as any).boothData?.location || artist.location;

    if (realUser.isRealUser && (boothInfo.name || (artist as any).boothData)) {
      // For real users with booth data
      alert(`Visit ${boothName} at ${boothLocation}! Contact them for more details about their studio hours and location.`);
    } else if (realUser.isRealUser) {
      // For real users without booth data
      alert(`Contact ${artist.name} for more details about their studio and location.`);
    } else {
      // For static artists, show generic message
      alert(`Visit ${artist.name}'s booth for an exclusive art experience!`);
    }
  };

  return (
    <div style={{marginBottom: '32px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
        <img
          src="/shop.png"
          alt="Booth"
          style={{
            width: '18px',
            height: '18px',
            objectFit: 'contain'
          }}
        />
        <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Booth</h3>
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
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <img
          src={displayImage}
          alt="Booth"
          style={{
            width: '100%',
            height: '80px',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop';
          }}
        />
        <div style={{padding: '8px'}}>
          <h3 style={{fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>
            {isLoading ? 'Loading...' : displayName}
          </h3>
          <p style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>
            {isLoading ? 'Loading...' : displayArtistName}
          </p>
          <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px'}}>
            <svg style={{width: '12px', height: '12px', color: '#6b7280'}} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span style={{fontSize: '11px', color: '#6b7280'}}>
              {isLoading ? 'Loading...' : displayLocation}
            </span>
          </div>
          <button
            onClick={handleVisit}
            style={{
              width: '100%',
              padding: '4px 8px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '11px',
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
            Visit
          </button>
        </div>
      </div>
    </div>
  );
}