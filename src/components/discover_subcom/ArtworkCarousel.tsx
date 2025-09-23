import React from 'react';
import { getValidImageUrl } from '../../utils/imageUtils';

interface Artwork {
  id: string;
  title: string;
  image: string;
  medium?: string;
  year?: string;
  dimensions?: string;
  description?: string;
  photos: Array<{
    id: string;
    url: string;
  }>;
}

interface Artist {
  id: number;
  name: string;
  specialty: string;
  location: string;
  description: string;
  fullBio: string;
  image: string;
  profileImage: string;
  artworkImages: string[];
  featured: boolean;
  followers: string;
  artworks: number;
  exhibitions: number;
  isRealUser?: boolean;
  userId?: string;
  userEmail?: string;
}

interface ArtworkCarouselProps {
  // Data
  currentArtist: Artist;
  galleryArtworks: Artwork[];
  galleryArtworksLoading: boolean;

  // State
  currentGalleryIndex: number;
  setCurrentGalleryIndex: (index: number) => void;

  // Functions
  isCurrentUserProfile: (artist: Artist) => boolean;
  setShowArtworkSelector: (show: boolean) => void;
  setSelectedArtwork: (artwork: any) => void;
}

export default function ArtworkCarousel({
  currentArtist,
  galleryArtworks,
  galleryArtworksLoading,
  currentGalleryIndex,
  setCurrentGalleryIndex,
  isCurrentUserProfile,
  setShowArtworkSelector,
  setSelectedArtwork
}: ArtworkCarouselProps) {
  return (
    <>
      {/* Artworks Gallery */}
      <div style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '18px'}}>🎨</span>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Gallery</h3>
            <span style={{fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px'}}>
              {isCurrentUserProfile(currentArtist)
                ? `${galleryArtworks.length} pieces`
                : `${currentArtist.artworkImages?.length || 0} pieces`
              }
            </span>
          </div>
          {isCurrentUserProfile(currentArtist) && (
            <button
              onClick={() => setShowArtworkSelector(true)}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              ✏️ Edit
            </button>
          )}
        </div>
        <div style={{ position: 'relative', height: '360px', overflow: 'hidden', marginBottom: '16px' }}>
          {galleryArtworksLoading ? (
            // Loading state
            <div style={{
              display: 'flex',
              gap: '12px',
              height: '100%'
            }}>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  style={{
                    width: 'calc(33.333% - 8px)',
                    height: '360px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                    Loading...
                  </span>
                </div>
              ))}
            </div>
          ) : galleryArtworks.length > 0 ? (
            // Show real gallery artworks when available (for any user)
              <>
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollBehavior: 'smooth',
                    gap: '16px',
                    paddingRight: '16px'
                  }}
                >
                  {galleryArtworks.map((artwork, idx) => {
                    console.log('🎨 Carousel artwork data:', artwork);
                    return (
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
                            ...artwork,
                            artist: currentArtist.name,
                            photos: artwork.photos
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
                          {artwork.photos && artwork.photos.length > 0 ? (
                            <>
                              {/* Main photo */}
                              <img
                                src={artwork.photos[0].url}
                                alt={artwork.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  console.warn('Failed to load artwork image:', artwork.title, artwork.photos[0].url);
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop';
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
                            </>
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px'
                            }}>
                              🎨
                            </div>
                          )}
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
                            margin: '0 0 2px 0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.2'
                          }}>
                            {artwork.medium} {artwork.year && `• ${artwork.year}`}
                          </p>
                          {artwork.dimensions && (
                            <p style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: '1.2'
                            }}>
                              {artwork.dimensions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>


              </>
            ) : currentArtist.artworkImages?.length > 0 ? (
            // Fallback: show static artwork images horizontally scrollable
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollBehavior: 'smooth',
                  gap: '16px',
                  paddingRight: '16px'
                }}
              >
                {currentArtist.artworkImages.map((image, idx) => (
                  <div
                    key={idx}
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
                          id: `${currentArtist.id}-artwork-${idx}`,
                          title: `Artwork ${idx + 1}`,
                          medium: currentArtist.specialty || 'Mixed Media',
                          year: '2025',
                          artist: currentArtist.name,
                          description: `A beautiful ${currentArtist.specialty || 'artwork'} piece by ${currentArtist.name}`,
                          photos: [{ id: '1', url: image }]
                        })}
                        style={{
                          width: '240px',
                          height: '240px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid #e5e7eb',
                          cursor: 'pointer',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          marginBottom: '8px'
                        }}
                      >
                        <img
                          src={image}
                          alt={`Artwork ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      {/* Artwork Info */}
                      <div style={{ textAlign: 'left', maxWidth: '240px' }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          margin: '0 0 4px 0',
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          Artwork {idx + 1}
                        </h4>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '0 0 2px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {currentArtist.specialty || 'Mixed Media'} • 2025
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty state
              <div style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: isCurrentUserProfile(currentArtist) ? '2px dashed #d1d5db' : '2px solid #e5e7eb',
                padding: '24px',
                textAlign: 'center',
                color: '#6b7280',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎨</div>
                <p style={{ fontSize: '12px', margin: 0 }}>
                  {isCurrentUserProfile(currentArtist)
                    ? 'Click Edit to feature your artworks here'
                    : 'No artworks to display'
                  }
                </p>
              </div>
            )}
        </div>
      </div>
    </>
  );
}