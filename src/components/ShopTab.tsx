interface ShopTabProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
  };
  userArtworks: any[];
  addToCart: (item: any) => void;
  setSelectedImage: (image: any) => void;
  setShowFullImageModal: (show: boolean) => void;
}

export default function ShopTab({ 
  auth,
  userArtworks, 
  addToCart, 
  setSelectedImage, 
  setShowFullImageModal 
}: ShopTabProps) {
  // Helper function to check login before adding to cart
  const handleAddToCart = (item: any) => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to purchase artwork! 🛒\n\nTap the Profile tab to create your account.');
      return;
    }
    addToCart(item);
  };
  return (
    <div style={{ padding: '16px 16px 80px 16px' }}>
      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '16px'
      }}>
        <input 
          type="text" 
          placeholder="Search artworks, prints..."
          style={{
            width: '100%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 12px 12px 40px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <svg style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          width: '16px',
          height: '16px',
          color: '#9ca3af'
        }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', 
        gap: '6px', 
        marginBottom: '24px', 
        overflowX: 'auto',
        scrollBehavior: 'smooth',
        paddingBottom: '4px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {['All Items', 'Paintings', 'Prints', 'Ceramics'].map((filter, idx) => (
          <button
            key={idx}
            style={{
              padding: '6px 12px',
              backgroundColor: idx === 0 ? '#dbeafe' : '#f3f4f6',
              color: idx === 0 ? '#1d4ed8' : '#6b7280',
              border: 'none',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              minWidth: 'fit-content',
              flexShrink: 0
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
          <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '12px'}}>All Products</h2>
          <select style={{
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '14px',
            color: '#374151'
          }}>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>
        
        {userArtworks.filter(artwork => artwork.price && artwork.price > 0).length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 16px',
            color: '#6b7280'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px', opacity: 0.5}}>🛒</div>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px'}}>No items for sale</h3>
            <p style={{fontSize: '14px', margin: 0}}>Create artworks with prices to see them here</p>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            {userArtworks
              .filter(artwork => artwork.price && artwork.price > 0)
              .map(product => (
                <div key={product.id} 
                  onClick={() => {
                    if (product.image || (product.photos && product.photos.length > 0)) {
                      const imageUrl = product.image || product.photos[0].url;
                      setSelectedImage({
                        image: imageUrl,
                        title: product.title,
                        artist: product.artist
                      });
                      setShowFullImageModal(true);
                    }
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{position: 'relative'}}>
                    <img 
                      src={product.image || (product.photos && product.photos.length > 0 ? product.photos[0].url : 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop')} 
                      alt={product.title}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover'
                      }}
                    />
                    {product.featured && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#fbbf24',
                        color: '#111827',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Featured
                      </div>
                    )}
                    <button style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      ❤️
                    </button>
                  </div>
                  
                  <div style={{padding: '12px'}}>
                    <h4 style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>{product.title}</h4>
                    <p style={{color: '#6b7280', fontSize: '12px', marginBottom: '4px'}}>{product.artist}</p>
                    <span style={{fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'block'}}>{product.type || product.medium || 'Artwork'}</span>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <span style={{fontWeight: 'bold', color: '#111827'}}>${product.price}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        style={{
                          backgroundColor: '#111827',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
