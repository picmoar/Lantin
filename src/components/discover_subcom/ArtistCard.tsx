import React from 'react';

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

interface ArtistCardProps {
  // Artist data
  currentArtist: Artist;

  // Animation state
  scrollProgress: number;
  isAnimating: boolean;
  swipeDirection: 'left' | 'right' | null;

  // Artwork carousel state
  currentArtworkIndex: number;
  setCurrentArtworkIndex: (index: number) => void;

  // Like animation state
  likeAnimation: boolean;
  showHearts: boolean;

  // Event handlers
  likeArtist: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  onMessageArtist?: (artist: Artist) => void;
}

export default function ArtistCard({
  currentArtist,
  scrollProgress,
  isAnimating,
  swipeDirection,
  currentArtworkIndex,
  setCurrentArtworkIndex,
  likeAnimation,
  showHearts,
  likeArtist,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  onMessageArtist
}: ArtistCardProps) {
  return (
    <>
      {/* Artist Card */}
      <div
        style={{
          transform: `translateY(${-scrollProgress * 60}px) scale(${1 - scrollProgress * 0.2})`,
          opacity: Math.max(1 - scrollProgress * 1.2, 0),
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '32px',
          minHeight: '600px',
          transition: 'transform 0.1s ease, opacity 0.1s ease'
        }}
      >
        {/* Background cards for depth */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #ffffff, #f9fafb)',
          borderRadius: '20px',
          transform: 'rotate(2deg) scale(0.96)',
          opacity: 0.3
        }}></div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f9fafb, #ffffff)',
          borderRadius: '20px',
          transform: 'rotate(-1deg) scale(0.98)',
          opacity: 0.5
        }}></div>

        {/* Main Artist Card */}
        <div
          style={{
            position: 'relative',
            height: 'auto',
            minHeight: '600px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
            overflow: 'visible',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease',
            transform: isAnimating ? (swipeDirection === 'left' ? 'translateX(-100px) scale(0.95)' : swipeDirection === 'right' ? 'translateX(100px) scale(0.95)' : 'translateX(0) scale(1)') : 'translateX(0) scale(1)',
            opacity: isAnimating ? 0.3 : 1,
            touchAction: 'pan-y'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Artist Artwork Carousel */}
          <div style={{position: 'relative', height: '400px', overflow: 'hidden', marginBottom: '60px'}}>
            <div
              style={{
                display: 'flex',
                width: (currentArtist.artworkImages.length * 100) + '%',
                height: '100%',
                transform: 'translateX(-' + (currentArtworkIndex * (100 / currentArtist.artworkImages.length)) + '%)',
                transition: 'transform 0.3s ease-out'
              }}
            >
              {currentArtist.artworkImages.map((artwork, index) => (
                <img
                  key={index}
                  src={artwork}
                  alt={currentArtist.name + ' Artwork ' + (index + 1)}
                  style={{
                    width: (100 / currentArtist.artworkImages.length) + '%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                setCurrentArtworkIndex((currentArtworkIndex - 1 + currentArtist.artworkImages.length) % currentArtist.artworkImages.length);
              }}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                zIndex: 10,
                transition: 'background-color 0.2s ease'
              }}
            >
              ‹
            </button>

            <button
              onClick={() => {
                setCurrentArtworkIndex((currentArtworkIndex + 1) % currentArtist.artworkImages.length);
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                zIndex: 10,
                transition: 'background-color 0.2s ease'
              }}
            >
              ›
            </button>

            {/* Carousel indicators */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px'
            }}>
              {currentArtist.artworkImages.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === currentArtworkIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={() => setCurrentArtworkIndex(index)}
                />
              ))}
            </div>

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
            }}></div>

            {/* Action buttons overlay */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center'
            }}>
              {/* Like button */}
              <button
                onClick={likeArtist}
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: likeAnimation ? 'rgba(239, 68, 68, 0.95)' : 'rgba(97, 133, 139, 1)',
                  borderRadius: '50%',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: likeAnimation ? '0 8px 24px rgba(239, 68, 68, 0.4)' : '0 8px 16px -4px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  fontSize: '24px',
                  transition: 'all 0.3s ease',
                  transform: likeAnimation ? 'scale(1.2)' : 'scale(1)',
                  animation: likeAnimation ? 'pulse 0.5s ease-in-out' : 'none'
                }}
              >
                <img
                  src="/heart.png"
                  alt="Like"
                  style={{
                    width: '34px',
                    height: '34px',
                    filter: likeAnimation ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' : 'none',
                    transition: 'filter 0.3s ease'
                  }}
                />
              </button>

              {/* Floating Hearts Animation */}
              {showHearts && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        fontSize: '16px',
                        color: '#ef4444',
                        animation: `floatHeart${i} 0.8s ease-out forwards`,
                        pointerEvents: 'none',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 20
                      }}
                    >
                      ❤️
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Featured Badge or Real User Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {currentArtist.featured && (
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#7c3aed',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15)'
                }}>
                  Featured Artist
                </span>
              )}
              {(currentArtist as any).isRealUser && (
                <span style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.95)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15)'
                }}>
                  Community Artist
                </span>
              )}
            </div>
          </div>

          {/* Artist Profile Picture Circle */}
          <div style={{
            position: 'absolute',
            top: '360px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px solid white',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 25
          }}>
            <img
              src={currentArtist.profileImage}
              alt={`${currentArtist.name} Profile`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Artist Info */}
          <div style={{
            height: 'auto',
            padding: '50px 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '6px',
                  lineHeight: '1.2',
                  flex: 1
                }}>
                  {currentArtist.name}
                </h3>

                {/* Message button - only for real users */}
                {(currentArtist as any).isRealUser && onMessageArtist && (
                  <button
                    onClick={() => onMessageArtist(currentArtist)}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(97, 133, 139, 1)',
                      borderRadius: '50%',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px -2px rgba(128, 150, 147, 0.93)',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      marginLeft: '12px'
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
                      src="/message.png"
                      alt="Message"
                      style={{
                        width: '30px',
                        height: '30px',
                      }}
                    />
                  </button>
                )}
              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '16px',
                marginBottom: '12px'
              }}>
                {currentArtist.specialty} • {currentArtist.location}
              </p>
              <p style={{
                color: '#4b5563',
                fontSize: '14px',
                lineHeight: '1.4',
                marginBottom: '16px'
              }}>
                {currentArtist.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}