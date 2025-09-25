import React from 'react';
import { getValidImageUrl } from '../../utils/imageUtils';

interface SaleArtwork {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface Artist {
  name: string;
  saleArtworks?: SaleArtwork[];
}

interface SaleArtworkSectionProps {
  saleArtworks: SaleArtwork[];
  artist: Artist;
  isOwner: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onAddToCart: (item: any) => void;
  setSelectedArtwork: (artwork: any) => void;
}

export default function SaleArtworkSection({
  saleArtworks,
  artist,
  isOwner,
  isLoading,
  onEdit,
  onAddToCart,
  setSelectedArtwork
}: SaleArtworkSectionProps) {
  return (
    <div style={{marginBottom: '20px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
        <img
          src="/shop.png"
          alt="Shop"
          style={{
            width: '18px',
            height: '18px',
            objectFit: 'contain'
          }}
        />
        <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Shop</h3>
        {isOwner && (
          <button
            onClick={onEdit}
            style={{
              marginLeft: 'auto',
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
            <img src="/edit.png" alt="Edit" style={{width: '16px', height: '16px'}} />
          </button>
        )}
      </div>

      <div style={{ position: 'relative', height: '360px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          gap: '16px',
          paddingRight: '16px'
        }}>
        {isLoading ? (
          // Loading state
          [1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                width: '320px',
                height: '360px',
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '10px'
              }}
            >
              <div style={{
                width: '240px',
                height: '240px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                  Loading...
                </span>
              </div>
            </div>
          ))
        ) : (saleArtworks.length > 0 || artist.saleArtworks?.length > 0) ? (
          // Real sale artworks - check both dynamic data and hook data
          (saleArtworks.length > 0 ? saleArtworks : artist.saleArtworks || []).map((artwork) => (
            <div
              key={artwork.id}
              style={{
                width: '320px',
                height: '360px',
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '10px'
              }}
            >
              <div
                style={{
                  width: '240px',
                  textAlign: 'center'
                }}
              >
                <div
                  onClick={() => setSelectedArtwork({
                    id: artwork.id,
                    title: artwork.title,
                    medium: 'Mixed Media',
                    year: '2025',
                    artist: artist.name,
                    price: artwork.price,
                    description: `A beautiful artwork piece by ${artist.name}, available for purchase.`,
                    photos: [{ id: '1', url: getValidImageUrl(artwork) }]
                  })}
                  style={{
                    width: '240px',
                    height: '240px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '8px',
                    position: 'relative'
                  }}
                >
                  <img
                    src={getValidImageUrl(artwork)}
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.warn('Failed to load sale artwork image:', artwork.title);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop';
                    }}
                  />
                  {/* Price tag overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(34, 197, 94, 0.9)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backdropFilter: 'blur(4px)'
                  }}>
                    ${artwork.price}
                  </div>
                </div>
                {/* Artwork Info */}
                <div style={{
                  textAlign: 'left',
                  maxWidth: '240px',
                  backgroundColor: 'white',
                  padding: '4px 0'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.2'
                  }}>
                    {artwork.title}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 6px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '1.2'
                  }}>
                    Available for Purchase
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart({
                        id: artwork.id,
                        title: artwork.title,
                        price: artwork.price,
                        artist: artist.name,
                        image: getValidImageUrl(artwork)
                      });
                    }}
                    style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#047857';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div style={{
            width: '100%',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: isOwner ? '2px dashed #d1d5db' : '2px solid #e5e7eb',
            padding: '24px',
            textAlign: 'center',
            color: '#6b7280',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <img
                src="/shop.png"
                alt="Shop"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p style={{ fontSize: '12px', margin: 0 }}>
              {isOwner
                ? 'Click Edit to feature your priced artworks here'
                : 'No artworks available for purchase'}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}