interface HeaderProps {
  auth: {
    isLoggedIn: boolean;
  };
  handleLogin: () => void;
}

export default function Header({ auth, handleLogin }: HeaderProps) {
  const styles = {
    header: {
      backgroundColor: 'white',
      padding: '16px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb',
      minHeight: '50px'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoText: {
      fontWeight: 'bold',
      fontSize: '22px'
    }
  };

  return (
    <div style={styles.header}>
      {/* Left side - Login only when not logged in */}
      <div style={{ width: '60px', display: 'flex', justifyContent: 'flex-start' }}>
        {!auth.isLoggedIn && (
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
            borderRadius: '8px'
          }}
        />
        <div style={styles.logoText}>Lantin</div>
      </div>
    </div>
  );
}
