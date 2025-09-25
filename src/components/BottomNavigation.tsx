interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const tabs = [
  { id: 'booths', icon: '/booth.png', label: 'Booths' },
  { id: 'map', icon: '/map.png', label: 'Map' },
  { id: 'discover', icon: '/discover.png', label: 'Discover' },
  { id: 'message', icon: '/message.png', label: 'Messages' },
  { id: 'profile', icon: '/profile.png', label: 'Profile' }
];

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const styles = {
    bottomNavContainer: {
      position: 'fixed' as const,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '375px',
      height: '92px', // Navigation + safe area
      backgroundColor: 'white',
      zIndex: 1002
    },
    bottomNav: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      paddingBottom: '12px',
    },
    navButton: {
      background: 'none',
      border: 'none',
      padding: '12px',
      cursor: 'pointer',
      fontSize: '20px'
    }
  };

  return (
    <div style={styles.bottomNavContainer}>
      <div style={styles.bottomNav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.navButton,
              color: tab.id === activeTab ? '#2563eb' : '#9ca3af',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <img
              src={tab.icon}
              alt={tab.label}
              style={{
                width: '30px',
                height: '30px',
                opacity: tab.id === activeTab ? 1 : 0.6,
                transition: 'opacity 0.2s ease'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
