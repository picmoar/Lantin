interface StatsGridProps {
  userArtworks: any[];
  favorites: any[];
  followers: any[];
  setShowFavoritesModal: (show: boolean) => void;
  setShowFollowersModal: (show: boolean) => void;
}

export function StatsGrid({ userArtworks, favorites, followers, setShowFavoritesModal, setShowFollowersModal }: StatsGridProps) {
  const saleArtworksCount = userArtworks.filter(art => art.price && art.price > 0).length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#fafafb',
        borderRadius: '8px',
        padding: '10px'
      }}>
        <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{userArtworks.length}</div>
        <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>Art</div>
      </div>
      <div
        onClick={() => setShowFollowersModal(true)}
        style={{
        backgroundColor: '#fafafb',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid transparent'
        }}
        onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f4f6';
        e.currentTarget.style.borderColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#fafafb';
        e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{followers.length}</div>
        <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>Follower</div>
      </div>
      <div
        onClick={() => setShowFavoritesModal(true)}
        style={{
        backgroundColor: '#fafafb',
        borderRadius: '8px',
        padding: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid transparent'
        }}
        onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f4f6';
        e.currentTarget.style.borderColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#fafafb';
        e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{favorites.length}</div>
        <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>Following</div>
      </div>
      <div style={{
        backgroundColor: '#fafafb',
        borderRadius: '8px',
        padding: '10px'
      }}>
        <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{saleArtworksCount}</div>
        <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>On Sale</div>
      </div>
    </div>
  );
}