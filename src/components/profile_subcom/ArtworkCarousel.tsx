interface ArtworkCarouselProps {
  currentArtworks: any[];
  hasMultiplePages: boolean;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  isCurrentUserProfile: (artist: any) => boolean;
  currentArtist: any;
  deleteArtwork: (id: string) => void;
  handleImageClick: (artwork: any) => void;
  userArtworks: any[];
  artworkPage: number;
  goToPage: (page: number) => void;
}

export function ArtworkCarousel({
  currentArtworks,
  hasMultiplePages,
  goToPrevPage,
  goToNextPage,
  isFirstPage,
  isLastPage,
  isCurrentUserProfile,
  currentArtist,
  deleteArtwork,
  handleImageClick,
  userArtworks,
  artworkPage,
  goToPage
}: ArtworkCarouselProps) {
  return (
    <div style={{position: 'relative'}}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        position: 'relative'
      }}>
      {currentArtworks.map((artwork, index) => (
        <div
          key={artwork.id}
          onClick={() => handleImageClick(artwork)}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Album Preview with Multiple Photos */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {artwork.photos && artwork.photos.length > 0 ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Main photo */}
                <img
                  src={artwork.photos[0].url}
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Album indicator for multiple photos */}
                {artwork.photos.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    📸 {artwork.photos.length}
                  </div>
                )}

                {/* Price tag */}
                {artwork.price && artwork.price > 0 && (
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
                )}
              </div>
            ) : (
              '🎨'
            )}

            {/* Delete button for current user */}
            {isCurrentUserProfile(currentArtist) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${artwork.title}"?`)) {
                    deleteArtwork(artwork.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  opacity: '0.8'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 1)';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Artwork Info */}
          <div style={{padding: '12px'}}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              margin: '0 0 4px 0',
              color: '#111827',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {artwork.title}
            </h4>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '0 0 6px 0',
              lineHeight: '1.3'
            }}>
              {artwork.medium} {artwork.year && `• ${artwork.year}`}
            </p>
            {artwork.tags && artwork.tags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                marginTop: '6px'
              }}>
                {artwork.tags.slice(0, 2).map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      </div>

      {/* Navigation arrows for 2x2 carousel */}
      {hasMultiplePages && (
        <>
          <button
            onClick={goToPrevPage}
            disabled={isFirstPage}
            style={{
              position: 'absolute',
              left: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isFirstPage ? '#f3f4f6' : 'white',
              color: isFirstPage ? '#9ca3af' : '#374151',
              border: '1px solid #e5e7eb',
              cursor: isFirstPage ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 10
            }}
          >
            ‹
          </button>

          <button
            onClick={goToNextPage}
            disabled={isLastPage}
            style={{
              position: 'absolute',
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isLastPage ? '#f3f4f6' : 'white',
              color: isLastPage ? '#9ca3af' : '#374151',
              border: '1px solid #e5e7eb',
              cursor: isLastPage ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 10
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Page indicator */}
      {hasMultiplePages && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '12px'
        }}>
          {Array.from({length: Math.ceil(userArtworks.length / 4)}).map((_, pageIdx) => (
            <div
              key={pageIdx}
              onClick={() => goToPage(pageIdx)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: pageIdx === artworkPage ? '#8b5cf6' : '#e5e7eb',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}