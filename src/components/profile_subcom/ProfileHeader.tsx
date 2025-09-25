import { StatsGrid } from './StatsGrid';

interface ProfileHeaderProps {
  auth: {
    userProfile: any;
  };
  userArtworks: any[];
  favorites: any[];
  followers: any[];
  setShowFavoritesModal: (show: boolean) => void;
  setShowFollowersModal: (show: boolean) => void;
  onEditClick: () => void;
}

export function ProfileHeader({
  auth,
  userArtworks,
  favorites,
  followers,
  setShowFavoritesModal,
  setShowFollowersModal,
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
          src={auth.userProfile.profileImage || null}
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
            <img
              src="/edit.png"
              alt="Edit"
              style={{
                width: '16px',
                height: '16px'
              }}
            />
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
        followers={followers}
        setShowFavoritesModal={setShowFavoritesModal}
        setShowFollowersModal={setShowFollowersModal}
      />
    </div>
  );
}