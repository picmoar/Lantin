import { StatsGrid } from './StatsGrid';

interface ProfileHeaderProps {
  auth: {
    userProfile: any;
  };
  userArtworks: any[];
  favorites: any[];
  setShowFavoritesModal: (show: boolean) => void;
  onEditClick: () => void;
}

export function ProfileHeader({
  auth,
  userArtworks,
  favorites,
  setShowFavoritesModal,
  onEditClick
}: ProfileHeaderProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '12px',
      margin: '0 4px 12px 4px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Profile Info - Compact */}
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginRight: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          flexShrink: 0
        }}>
          <img
          src={auth.userProfile.profileImage}
          alt="Profile"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          />
        </div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px'}}>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827'}}>{auth.userProfile.name}</h2>
            <button
            onClick={onEditClick}
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
          >
            <svg style={{width: '14px', height: '14px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
            </button>
          </div>
          <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '2px'}}>{auth.userProfile.specialty}</p>
          <p style={{color: '#9ca3af', fontSize: '12px', marginBottom: '4px'}}>{auth.userProfile.location}</p>
          {auth.userProfile.bio && (
            <p style={{
            color: '#4b5563',
            fontSize: '13px',
            marginBottom: '0',
            lineHeight: '1.4',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {auth.userProfile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid
        userArtworks={userArtworks}
        favorites={favorites}
        setShowFavoritesModal={setShowFavoritesModal}
      />
    </div>
  );
}