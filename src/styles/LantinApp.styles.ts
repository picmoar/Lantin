export const styles = {
  container: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
  },
  mobileApp: {
    maxWidth: '375px',
    width: '100%',
    backgroundColor: 'white',
    position: 'relative' as const
  },
  header: {
    backgroundColor: 'white',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e7eb'
  },
  notificationBadge: {
    width: '24px',
    height: '24px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    backgroundColor: '#374151',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '18px'
  },
  content: {
    padding: '16px',
    paddingBottom: '100px' // Add bottom padding for navigation space
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  pageTitleIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#374151',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px'
  },
  pageHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0
  },
  searchContainer: {
    position: 'relative' as const,
    marginBottom: '16px'
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 12px 12px 40px',
    fontSize: '14px',
    boxSizing: 'border-box' as const
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '12px',
    width: '16px',
    height: '16px',
    color: '#9ca3af'
  },
  filtersContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px'
  },
  filterSelect: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px'
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  featuredImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover' as const
  },
  cardContent: {
    padding: '16px'
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '16px'
  },
  cardArtist: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '8px'
  },
  locationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '12px'
  },
  locationIcon: {
    width: '14px',
    height: '14px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardDetails: {
    fontSize: '14px',
    color: '#6b7280'
  },
  visitButton: {
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  boothsList: {
    marginTop: '24px'
  },
  boothItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '12px',
    display: 'flex',
    gap: '12px',
    marginBottom: '12px'
  },
  boothImage: {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    objectFit: 'cover' as const
  },
  boothContent: {
    flex: 1
  },
  boothTitle: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px'
  },
  boothArtist: {
    color: '#6b7280',
    fontSize: '12px',
    marginBottom: '4px'
  },
  boothLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6b7280',
    fontSize: '12px',
    marginBottom: '8px'
  },
  smallButton: {
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  bottomNav: {
    position: 'fixed' as const,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '375px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0'
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '12px',
    cursor: 'pointer',
    fontSize: '20px'
  }
};

export const animationStyles = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1.2); }
  }
  
  @keyframes floatHeart0 {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-20px, -40px) scale(1); opacity: 0; }
  }
  
  @keyframes floatHeart1 {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(20px, -35px) scale(0.8); opacity: 0; }
  }
  
  @keyframes floatHeart2 {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-35px, -25px) scale(1.1); opacity: 0; }
  }
  
  @keyframes floatHeart3 {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(30px, -50px) scale(0.9); opacity: 0; }
  }
  
  @keyframes floatHeart4 {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-10px, -60px) scale(1.2); opacity: 0; }
  }
  
  @keyframes floatHeart5 {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(15px, -20px) scale(0.7); opacity: 0; }
  }
`;