import { useState, useEffect } from 'react';
import { useDiscoverableArtists } from '../hooks/useDiscoverableArtists';
import { useSaleArtworks, useGalleryArtworks, useContactInfo, useBoothInfo } from './discover_subcom';
import { useConversations } from '../hooks/useConversations';
import { supabase } from '../lib/supabase';
import { getValidImageUrl } from '../utils/imageUtils';
import {
  BiographyEditor,
  ArtworkSelector,
  ContactEditor,
  SaleEditor,
  BoothEditor,
  BiographySection,
  ContactSection,
  BoothSection,
  ArtistCard,
  ArtworkCarousel,
  SaleArtworkSection
} from './discover_subcom';

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
  onViewRealUserProfile?: (userId: string, userEmail: string) => void;
  setSelectedArtwork: (artwork: any) => void;
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
  followingCount,
  onViewRealUserProfile,
  setSelectedArtwork
}: DiscoverTabProps) {
  // State for section editing modals
  const [showBioEditor, setShowBioEditor] = useState(false);
  const [showArtworkSelector, setShowArtworkSelector] = useState(false);
  const [showContactEditor, setShowContactEditor] = useState(false);
  const [showSaleEditor, setShowSaleEditor] = useState(false);
  const [showBoothEditor, setShowBoothEditor] = useState(false);





  // Helper function to check if current artist is the logged-in user
  const isCurrentUserProfile = (artist: any) => {
    return auth.isLoggedIn &&
           (artist as any).isRealUser &&
           (artist as any).userEmail === auth.user?.email;
  };

  // Helper functions to check login before actions
  const handleAddToFavorites = (artist: any) => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to like artists! 💕\n\nTap the Profile tab to create your account.');
      return;
    }
    addToFavorites(artist);
  };

  const handleFollowArtist = async (artist: any) => {
    console.log('🎯 DiscoverTab handleFollowArtist called', { artistName: artist.name, artistId: artist.id });
    if (!auth.isLoggedIn) {
      alert('Please sign in to follow artists! 👥\n\nTap the Profile tab to create your account.');
      return;
    }
    console.log('🚀 Calling followArtist from DiscoverTab');
    await followArtist(artist);
    console.log('✅ DiscoverTab followArtist completed');
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
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // Use the discoverable artists hook
  const { artists, error, refetch, isLoading } = useDiscoverableArtists();

  // Always refetch when component mounts - ensures fresh data on every tab switch
  useEffect(() => {
    console.log('🔄 DiscoverTab mounted - fetching fresh data');
    refetch();
  }, []); // Run once when component mounts

  // Always refresh on window/tab focus for fresh content (like Instagram)
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only refresh when tab becomes visible (not when hidden)
      if (!document.hidden) {
        console.log('🔄 Tab became visible - refreshing discover feed');
        refetch();
      }
    };

    const handleFocus = () => {
      // Also refresh when window regains focus (mobile app behavior)
      console.log('🔄 Window focused - refreshing discover feed');
      refetch();
    };

    // Listen for both visibility change and window focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]); // Depend on refetch function

  // Ensure currentArtistIndex is valid when artists array changes
  useEffect(() => {
    if (artists.length > 0 && currentArtistIndex >= artists.length) {
      setCurrentArtistIndex(0);
    }
  }, [artists, currentArtistIndex]);

  const currentArtist = artists[currentArtistIndex];

  // Sale artworks hook
  const { saleArtworks, saleArtworksLoading, refetchSaleArtworks } = useSaleArtworks({
    auth,
    currentArtist,
    isCurrentUserProfile
  });

  // Gallery artworks hook
  const { galleryArtworks, galleryArtworksLoading, refetchGalleryArtworks } = useGalleryArtworks({
    auth,
    currentArtist,
    isCurrentUserProfile
  });

  // Contact info hook
  const { contactInfo, contactLoading, refetchContactInfo } = useContactInfo({
    auth,
    currentArtist,
    isCurrentUserProfile
  });

  // Booth info hook
  const { boothInfo, boothLoading, refetchBoothInfo } = useBoothInfo({
    auth,
    currentArtist,
    isCurrentUserProfile
  });

  // Messaging hook
  const { createConversation } = useConversations({
    userId: auth.user?.id,
    enabled: auth.isLoggedIn
  });

  // Message artist handler
  const handleMessageArtist = async (artist: any) => {
    if (!auth.isLoggedIn) {
      alert('Please sign in to message artists! 💬\n\nTap the Profile tab to create your account.');
      return;
    }

    if (!artist.isRealUser || !artist.userId) {
      alert('This artist is not available for messaging.');
      return;
    }

    if (artist.userId === auth.user?.id) {
      alert('You cannot message yourself!');
      return;
    }

    try {
      const conversationId = await createConversation(artist.userId);
      if (conversationId) {
        alert(`Started conversation with ${artist.name}! Check the Messages tab to continue chatting.`);
      } else {
        alert('Failed to start conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  // Manual refresh function (like Instagram's pull-to-refresh)
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    try {
      console.log('🔄 Manual refresh triggered - button clicked!');
      setIsRefreshing(true);
      await refetch();
      localStorage.setItem('lastDiscoverRefresh', Date.now().toString());
      console.log('✅ Manual refresh completed successfully');
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Biography update function
  const handleUpdateBiography = async (newBio: string) => {
    if (!supabase || !auth.user) {
      alert('Please log in to update biography');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('artists')
        .update({ discover_bio: newBio })
        .eq('email', auth.user.email)
        .select();

      if (error) throw error;

      // Refresh the artist data to reflect the change
      await refetch();
      alert('Biography updated successfully!');
    } catch (error) {
      console.error('Error updating biography:', error);
      alert('Failed to update biography: ' + (error as Error).message);
    }
  };





  // Contact info update function
  const handleUpdateContactInfo = async (email: string, location: string) => {
    // Refresh contact info to show updated values
    await refetchContactInfo();
    alert('Contact information updated successfully!');
  };

  // Booth update function
  const handleUpdateBooth = async (selectedBoothId: string) => {
    if (!supabase || !auth.user) {
      alert('Please log in to update booth selection');
      return;
    }

    try {
      console.log('🏪 handleUpdateBooth: Starting update with booth ID:', selectedBoothId);
      console.log('🏪 handleUpdateBooth: User ID:', auth.user.id);

      // Save the selected booth ID to the user's profile for discover page
      const { data, error } = await supabase
        .from('artists')
        .update({
          discover_booth_id: selectedBoothId
        })
        .eq('id', auth.user.id)
        .select('discover_booth_id'); // Return the updated field to verify

      if (error) {
        console.error('🏪 handleUpdateBooth: Database update error:', error);
        throw error;
      }

      console.log('🏪 handleUpdateBooth: Database update successful, returned data:', data);

      // Add a small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 100));

      // Refresh booth info to show updated values
      console.log('🏪 handleUpdateBooth: Refreshing booth info...');
      await refetchBoothInfo();
      alert('Featured booth updated successfully!');
    } catch (error) {
      console.error('🏪 handleUpdateBooth: Error updating featured booth:', error);
      alert('Failed to update featured booth: ' + (error as Error).message);
    }
  };

  // Artwork update function
  const handleUpdateFeaturedArtworks = async (selectedArtworkIds: string[]) => {
    console.log('🔄 handleUpdateFeaturedArtworks called with:', selectedArtworkIds);

    // Update the artist's updated_at timestamp first
    if (supabase && auth.user) {
      const newTimestamp = new Date().toISOString();
      console.log('🔄 Updating artist timestamp in callback...', newTimestamp);

      const { data, error } = await supabase
        .from('artists')
        .update({ updated_at: newTimestamp })
        .eq('id', auth.user.id)
        .select('id, updated_at, created_at');

      if (error) {
        console.error('❌ Failed to update artist timestamp in callback:', error);
      } else {
        console.log('✅ Artist timestamp updated in callback:', data);
      }
    }

    // Refresh the artist data to reflect the changes
    await refetch();
    // Refresh gallery artworks to show updated selections
    await refetchGalleryArtworks();
    // Refresh sale artworks to show updated selections
    await refetchSaleArtworks();
    alert('Featured artworks updated successfully!');
  };

  // Navigation functions
  const nextArtist = () => {
    setSwipeDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentArtistIndex((prev) => (prev + 1) % artists.length);
      setCurrentArtworkIndex(0);
      setCurrentGalleryIndex(0);
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
      setCurrentGalleryIndex(0);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const likeArtist = async () => {
    console.log('❤️ Liked artist:', currentArtist.name);

    setLikeAnimation(true);
    setShowHearts(true);
    handleAddToFavorites(currentArtist);
    await handleFollowArtist(currentArtist);

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

  // Fetch sale artworks when current artist changes - using same pattern as ArtworkSelector
  useEffect(() => {
    if (currentArtist && isCurrentUserProfile(currentArtist)) {
      // Reset state every time to prevent stale data

      // Only fetch if user is authenticated
      if (auth.user) {
        refetchGalleryArtworks();
        refetchSaleArtworks();
      }
    } else {
      // Clean up state when not viewing user's own profile
    }
  }, [currentArtist]); // Removed auth.user dependency to prevent unnecessary re-runs

  // Fetch contact info when current artist changes - same pattern as sale artworks
  useEffect(() => {
    if (currentArtist && isCurrentUserProfile(currentArtist)) {

      // Only fetch if user is authenticated
      if (auth.user) {
        refetchContactInfo();
      }
    }
  }, [currentArtist]);

  // Fetch booth info when current artist changes - same pattern as contact info
  useEffect(() => {
    if (currentArtist && isCurrentUserProfile(currentArtist)) {
      // Reset state every time to prevent stale data

      // Only fetch if user is authenticated
      if (auth.user) {
        refetchBoothInfo();
      }
    } else {
      // Clean up state when not viewing user's own profile
    }
  }, [currentArtist]);

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


  // Error state
  if (error) {
    return (
      <div style={{
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{fontSize: '48px'}}>⚠️</div>
        <p style={{fontSize: '16px', color: '#ef4444'}}>Failed to load artists</p>
        <p style={{fontSize: '14px', color: '#6b7280'}}>{error}</p>
      </div>
    );
  }

  // No artists state - show nothing until data loads
  if (!currentArtist || artists.length === 0) {
    return <div style={{ minHeight: '100vh' }}></div>;
  }

  return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes floatHeart0 {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-30px, -80px) scale(1); opacity: 1; }
            100% { transform: translate(-40px, -120px) scale(0.5); opacity: 0; }
          }

          @keyframes floatHeart1 {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(30px, -80px) scale(1); opacity: 1; }
            100% { transform: translate(40px, -120px) scale(0.5); opacity: 0; }
          }

          @keyframes floatHeart2 {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-60px, -60px) scale(1); opacity: 1; }
            100% { transform: translate(-80px, -100px) scale(0.5); opacity: 0; }
          }

          @keyframes floatHeart3 {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(60px, -60px) scale(1); opacity: 1; }
            100% { transform: translate(80px, -100px) scale(0.5); opacity: 0; }
          }

          @keyframes floatHeart4 {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-10px, -90px) scale(1); opacity: 1; }
            100% { transform: translate(-20px, -130px) scale(0.5); opacity: 0; }
          }

          @keyframes floatHeart5 {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(10px, -90px) scale(1); opacity: 1; }
            100% { transform: translate(20px, -130px) scale(0.5); opacity: 0; }
          }
        `}
      </style>

      <div style={{
        padding: '8px',
        position: 'relative'
      }}>
        {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        paddingLeft: '8px',
        paddingRight: '8px',
        opacity: 1 - scrollProgress * 0.8,
        transform: `translateY(${-scrollProgress * 20}px)`,
        transition: 'opacity 0.2s ease, transform 0.2s ease'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <img
            src="/discover.png"
            alt="Discover"
            style={{
              width: '32px',
              height: '32px'
            }}
          />
          <h2 style={{fontSize: '22px', fontWeight: 'bold', color: '#111827'}}>Discover</h2>
          <span style={{fontSize: '14px', color: '#6b7280'}}>   Swipe to explore</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          style={{
            backgroundColor: isRefreshing ? '#f3f4f6' : 'transparent',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            transition: 'all 0.2s ease',
            opacity: isRefreshing ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
          title={isRefreshing ? "Refreshing..." : "Refresh discover feed"}
        >
          <span
            style={{
              fontSize: '16px',
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }}
          >
            🔄
          </span>
        </button>
      </div>

      {/* Artist Card */}
      <ArtistCard
        currentArtist={currentArtist}
        scrollProgress={scrollProgress}
        isAnimating={isAnimating}
        swipeDirection={swipeDirection}
        currentArtworkIndex={currentArtworkIndex}
        setCurrentArtworkIndex={setCurrentArtworkIndex}
        likeAnimation={likeAnimation}
        showHearts={showHearts}
        likeArtist={likeArtist}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        onMessageArtist={handleMessageArtist}
      />

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
        <BiographySection
          artist={currentArtist}
          isOwner={isCurrentUserProfile(currentArtist)}
          onEdit={() => setShowBioEditor(true)}
        />

        {/* Artworks Gallery */}
        <ArtworkCarousel
          currentArtist={currentArtist}
          galleryArtworks={galleryArtworks}
          galleryArtworksLoading={galleryArtworksLoading}
          currentGalleryIndex={currentGalleryIndex}
          setCurrentGalleryIndex={setCurrentGalleryIndex}
          isCurrentUserProfile={isCurrentUserProfile}
          setShowArtworkSelector={setShowArtworkSelector}
          setSelectedArtwork={setSelectedArtwork}
        />

        {/* Artworks on Sale */}
        <SaleArtworkSection
          saleArtworks={saleArtworks}
          artist={{...currentArtist, saleArtworks: (currentArtist as any).saleArtworks}}
          isOwner={isCurrentUserProfile(currentArtist)}
          isLoading={saleArtworksLoading}
          onEdit={() => setShowSaleEditor(true)}
          onAddToCart={handleAddToCart}
          setSelectedArtwork={setSelectedArtwork}
        />

        {/* Contact Information */}
        <ContactSection
          contactInfo={contactInfo}
          artist={currentArtist}
          isOwner={isCurrentUserProfile(currentArtist)}
          isLoading={contactLoading}
          onEdit={() => setShowContactEditor(true)}
        />

        {/* Artist Booth */}
        <BoothSection
          boothInfo={boothInfo}
          artist={currentArtist}
          isOwner={isCurrentUserProfile(currentArtist)}
          isLoading={boothLoading}
          onEdit={() => setShowBoothEditor(true)}
        />
      </div>
      </div>

      {/* Biography Editor Modal */}
      <BiographyEditor
        isOpen={showBioEditor}
        onClose={() => setShowBioEditor(false)}
        currentBio={currentArtist.fullBio}
        onSave={handleUpdateBiography}
      />

      {/* Artwork Selection Modal */}
      <ArtworkSelector
        isOpen={showArtworkSelector}
        onClose={() => setShowArtworkSelector(false)}
        auth={auth}
        onSave={handleUpdateFeaturedArtworks}
      />

      {/* Contact Info Editor Modal */}
      <ContactEditor
        isOpen={showContactEditor}
        onClose={() => setShowContactEditor(false)}
        currentEmail={contactInfo.email}
        currentLocation={contactInfo.location}
        auth={auth}
        onSave={handleUpdateContactInfo}
      />

      {/* Sale Items Editor Modal */}
      <SaleEditor
        isOpen={showSaleEditor}
        onClose={() => setShowSaleEditor(false)}
        auth={auth}
        onSave={handleUpdateFeaturedArtworks}
      />

      {/* Booth Editor Modal */}
      <BoothEditor
        isOpen={showBoothEditor}
        onClose={() => setShowBoothEditor(false)}
        currentLocation={currentArtist.location}
        auth={auth}
        onSave={handleUpdateBooth}
      />
    </>
  );
}
