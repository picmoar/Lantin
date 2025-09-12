interface HeaderProps {
  auth: {
    isLoggedIn: boolean;
  };
  handleLogin: () => void;
  handleLogout: () => void;
}

export default function Header({ auth, handleLogin, handleLogout }: HeaderProps) {
  const styles = {
    header: {
      backgroundColor: 'white',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoText: {
      fontWeight: 'bold',
      fontSize: '18px'
    }
  };

  return (
    <div style={styles.header}>
      {/* Left side - Login/Profile */}
      <div style={{ width: '60px', display: 'flex', justifyContent: 'flex-start' }}>
        {auth.isLoggedIn ? (
          <button 
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#6b7280'
            }}
          >
            👤 Logout
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#3b82f6'
            }}
          >
            Login
          </button>
        )}
      </div>
      
      {/* Center - Logo */}
      <div style={{...styles.logoContainer, position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
        <img 
          src="/lantinlogo.png" 
          alt="Lantin Logo" 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px'
          }}
        />
        <div style={styles.logoText}>Lantin</div>
      </div>
    </div>
  );
}
