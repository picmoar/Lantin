import { useState, useEffect } from 'react';
import { artists } from '../data/artists';

interface DiscoverTabProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
  };
  favorites: any[];
  following: any[];
  shoppingCart: any[];
  addToFavorites: (artist: any) => void;
  followArtist: (artist: any) => void;
  addToCart: (item: any) => void;
  setFollowingCount: (count: number) => void;
  followingCount: number;
}

export default function DiscoverTab({ 
  auth, 
  favorites, 
  following, 
  shoppingCart,
  addToFavorites,
  followArtist,
  addToCart,
  setFollowingCount,
  followingCount
}: DiscoverTabProps) {
  // Helper functions to check login before actions
  const handleAddToFavorites = (artist: any) => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to like artists! 💕\n\nTap the Profile tab to create your account.');
      return;
    }
    addToFavorites(artist);
  };

  const handleFollowArtist = (artist: any) => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to follow artists! 👥\n\nTap the Profile tab to create your account.');
      return;
    }
    followArtist(artist);
  };

  const handleAddToCart = (item: any) => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to add items to cart! 🛒\n\nTap the Profile tab to create your account.');
      return;
    }
    addToCart(item);
  };

  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const currentArtist = artists[currentArtistIndex];

  // Navigation functions
  const nextArtist = () => {
    setSwipeDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
      setCurrentArtworkIndex(0);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const prevArtist = () => {
    setSwipeDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentArtistIndex((prev) => (prev - 1 + artists.length) % artists.length);
      setCurrentArtworkIndex(0);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const likeArtist = () => {
    console.log('Liked artist:', currentArtist.name);
    
    setLikeAnimation(true);
    setShowHearts(true);
    handleAddToFavorites(currentArtist);
    
    setTimeout(() => {
      setLikeAnimation(false);
      setTimeout(() => {
        setShowHearts(false);
      }, 300);
    }, 500);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.x || !touchStart.y) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    setTouchEnd({ x: currentX, y: currentY });

    const deltaX = Math.abs(touchStart.x - currentX);
    const deltaY = Math.abs(touchStart.y - currentY);
    
    if (deltaX > 50 && deltaX > deltaY * 2) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x || !touchStart.y || !touchEnd.y) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;
    
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    if (horizontalDistance > minSwipeDistance && horizontalDistance > verticalDistance * 1.5) {
      if (deltaX > 0) {
        nextArtist();
      } else {
        prevArtist();
      }
    }
    
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  // Scroll progress for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalScrollNeeded = windowHeight * 0.8;
      let progress = scrollY / totalScrollNeeded;
      progress = Math.pow(progress, 1.5);
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      padding: '8px',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        paddingLeft: '8px',
        opacity: 1 - scrollProgress * 0.8,
        transform: `translateY(${-scrollProgress * 20}px)`,
        transition: 'opacity 0.2s ease, transform 0.2s ease'
      }}>
        <img 
          src="/discover.png" 
          alt="Discover" 
          style={{
            width: '20px',
            height: '20px'
          }}
        />
        <h2 style={{fontSize: '18px', fontWeight: 'bold', color: '#111827'}}>Discover Artists</h2>
        <span style={{fontSize: '14px', color: '#6b7280'}}>Swipe to explore</span>
      </div>

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
            
            {/* Like button overlay */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px'
            }}>
              <button 
                onClick={likeArtist}
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: likeAnimation ? 'rgba(239, 68, 68, 0.95)' : 'rgba(255,255,255,0.95)',
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
                {likeAnimation ? '❤️' : '💛'}
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

            {/* Featured Badge */}
            {currentArtist.featured && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px'
              }}>
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
              </div>
            )}
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
            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '6px',
                lineHeight: '1.2'
              }}>
                {currentArtist.name}
              </h3>
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

      {/* Compact transition area */}
      <div style={{
        height: '12vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: Math.max(0.6 - scrollProgress * 1.2, 0),
        transform: `translateY(${-scrollProgress * 30}px)`,
        transition: 'opacity 0.2s ease, transform 0.2s ease'
      }}>
        <div style={{
          fontSize: '13px',
          color: '#9ca3af',
          textAlign: 'center',
          lineHeight: '1.3'
        }}>
          Scroll for artist details
        </div>
      </div>
      
      {/* Artist Profile Details Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px 20px 0 0',
        padding: '32px 20px',
        marginTop: '-40px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        transform: `translateY(${(1 - scrollProgress) * 80}px)`,
        opacity: Math.min(scrollProgress * 2.5, 1),
        transition: 'transform 0.1s ease, opacity 0.1s ease',
        minHeight: '100vh'
      }}>        
        <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#111827'}}>
          About {currentArtist.name}
        </h2>
        
        {/* Biography */}
        <div style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            <span style={{fontSize: '18px'}}>📝</span>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Biography</h3>
          </div>
          <p style={{color: '#4b5563', lineHeight: '1.6', fontSize: '14px', margin: 0}}>
            {currentArtist.name} is a renowned {currentArtist.specialty.toLowerCase()} artist based in {currentArtist.location}. 
            With over a decade of experience, they have developed a unique style that blends traditional techniques with contemporary themes. 
            Their work has been featured in galleries across the country and has garnered critical acclaim for its innovative approach to visual storytelling.
          </p>
        </div>

        {/* Artworks Gallery */}
        <div style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            <span style={{fontSize: '18px'}}>🎨</span>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Artworks</h3>
            <span style={{fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '12px'}}>47 pieces</span>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {currentArtist.artworkImages.map((image, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '120px',
                  height: '120px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb'
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
            ))}
          </div>
        </div>

        {/* Artworks on Sale */}
        <div style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            <span style={{fontSize: '18px'}}>💰</span>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Available for Purchase</h3>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {[
              { title: 'Abstract Sunset', price: '$850', medium: 'Oil on Canvas' },
              { title: 'Urban Dreams', price: '$1,200', medium: 'Acrylic' },
              { title: 'Nature\'s Symphony', price: '$950', medium: 'Watercolor' }
            ].map((artwork, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: '160px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer'
                }}
                onClick={() => handleAddToCart({
                  id: `artwork-${idx}`,
                  title: artwork.title,
                  price: parseFloat(artwork.price.replace('$', '').replace(',', '')),
                  artist: currentArtist.name,
                  image: currentArtist.artworkImages[idx % currentArtist.artworkImages.length]
                })}
              >
                <div style={{
                  width: '100%',
                  height: '100px',
                  backgroundColor: '#f3f4f6',
                  backgroundImage: `url(${currentArtist.artworkImages[idx % currentArtist.artworkImages.length]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                <div style={{padding: '8px'}}>
                  <h4 style={{fontSize: '12px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#111827'}}>{artwork.title}</h4>
                  <p style={{fontSize: '10px', color: '#6b7280', margin: '0 0 4px 0'}}>{artwork.medium}</p>
                  <p style={{fontSize: '12px', fontWeight: 'bold', color: '#059669', margin: 0}}>{artwork.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            <span style={{fontSize: '18px'}}>📞</span>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Contact Information</h3>
          </div>
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '16px',
            space: '12px'
          }}>
            <div style={{marginBottom: '12px'}}>
              <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>Email</div>
              <div style={{fontSize: '14px', color: '#111827', fontWeight: '500'}}>contact@{currentArtist.name.toLowerCase().replace(' ', '')}.art</div>
            </div>
            <div style={{marginBottom: '12px'}}>
              <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>Studio Location</div>
              <div style={{fontSize: '14px', color: '#111827', fontWeight: '500'}}>{currentArtist.location}</div>
            </div>
            <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
              <button 
                onClick={() => {
                  handleFollowArtist(currentArtist);
                  if (auth.isLoggedIn) {
                    alert(`Now following ${currentArtist.name}!`);
                  }
                }}
                style={{
                backgroundColor: '#1f2937',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Follow Artist
              </button>
              <button style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Artist Booth */}
        <div style={{marginBottom: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            <span style={{fontSize: '18px'}}>🏪</span>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Artist Booth</h3>
          </div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '16px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🎭
              </div>
              <div style={{flex: 1}}>
                <h4 style={{fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0', color: '#111827'}}>{currentArtist.name}'s Studio</h4>
                <p style={{fontSize: '12px', color: '#6b7280', margin: 0}}>{currentArtist.location} • Open Daily 10AM-7PM</p>
              </div>
            </div>
            <p style={{fontSize: '12px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.4'}}>
              Visit the artist's physical booth to see works in person, meet the artist, and discover exclusive pieces not available online.
            </p>
            <button style={{
              width: '100%',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Visit Booth
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}