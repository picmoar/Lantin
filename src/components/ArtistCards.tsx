import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Heart, MapPin, X, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { artistService } from '../services/artists';
import { adaptSupabaseArtist } from '../utils/dataAdapter';
import { mockArtists, type Artist } from '../data/artists';
import { ArtistProfile } from './ArtistProfile';

interface ArtistCardsProps {
  savedArtists: string[];
  onSaveArtist: (artistId: string) => void;
}

export function ArtistCards({ savedArtists, onSaveArtist }: ArtistCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [allArtists, setAllArtists] = useState<Artist[]>(mockArtists); // Start with mock data
  const [cards, setCards] = useState<Artist[]>(mockArtists.slice(0, 3)); // Initialize with mock data
  const [removingDirection, setRemovingDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(false); // Don't show loading initially since we have mock data
  const [error, setError] = useState<string | null>(null);

  // Load artists from Supabase
  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        const supabaseArtists = await artistService.getAllArtists();
        
        if (supabaseArtists.length > 0) {
          // Convert Supabase data to legacy format
          const adaptedArtists = supabaseArtists.map(adaptSupabaseArtist);
          setAllArtists(adaptedArtists);
          setCards(adaptedArtists.slice(0, 3));
        } else {
          // No data in Supabase, use mock data
          console.log('No artists found in Supabase, using mock data');
          setAllArtists(mockArtists);
          setCards(mockArtists.slice(0, 3));
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load artists from Supabase, falling back to mock data:', err);
        // Fallback to mock data on error
        setAllArtists(mockArtists);
        setCards(mockArtists.slice(0, 3));
        setError(null); // Don't show error, just use fallback
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  // Get next cards for the stack
  const getNextCards = () => {
    if (allArtists.length === 0) return [];
    const startIndex = currentIndex;
    const nextCards = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % allArtists.length;
      nextCards.push(allArtists[index]);
    }
    return nextCards;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentArtist = cards[0];
    
    if (direction === 'right' && currentArtist) {
      // Like/Save artist
      onSaveArtist(currentArtist.id);
    }

    setRemovingDirection(direction);
    
    // Remove the top card and add a new one
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % allArtists.length);
      setCards(getNextCards());
      setRemovingDirection(null);
    }, 300);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const swipeVelocity = 500;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > swipeVelocity) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  // Handle scrolling down to view full profile
  const handleCardClick = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  if (selectedArtist) {
    return (
      <ArtistProfile 
        artist={selectedArtist}
        isSaved={savedArtists.includes(selectedArtist.id)}
        onSave={() => onSaveArtist(selectedArtist.id)}
        onBack={() => setSelectedArtist(null)}
        onMessage={() => {
          console.log('Message artist:', selectedArtist.id);
        }}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3>Loading artists...</h3>
          <p className="text-muted-foreground mt-2">Discovering amazing talent for you</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h3 className="text-red-600">Oops! Something went wrong</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No artists state
  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="text-center">
          <h3>You've seen all artists!</h3>
          <p className="text-muted-foreground mt-2">Check back later for new discoveries</p>
          <Button 
            onClick={() => {
              setCurrentIndex(0);
              setCards(getNextCards());
            }}
            className="mt-4"
          >
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* Card Stack */}
      <div className="absolute inset-4 top-20 bottom-32">
        <AnimatePresence mode="popLayout">
          {cards.map((artist, index) => {
            const isTop = index === 0;
            const zIndex = 10 - index;
            const scale = 1 - (index * 0.05);
            const yOffset = index * 8;

            return (
              <motion.div
                key={`${artist.id}-${currentIndex + index}`}
                className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ 
                  zIndex,
                  scale,
                  y: yOffset
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={isTop ? handleDragEnd : undefined}
                whileDrag={isTop ? { rotate: 0, scale: 1.05 } : {}}
                animate={
                  isTop && removingDirection
                    ? {
                        x: removingDirection === 'right' ? 400 : -400,
                        rotate: removingDirection === 'right' ? 30 : -30,
                        opacity: 0
                      }
                    : { x: 0, rotate: 0, opacity: 1 }
                }
                exit={{
                  x: removingDirection === 'right' ? 400 : -400,
                  rotate: removingDirection === 'right' ? 30 : -30,
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                onClick={isTop ? () => handleCardClick(artist) : undefined}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${artist.artworkImages?.[0] || artist.profileImage || artist.profile_image_url})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                  {/* Artist Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={artist.profileImage || artist.profile_image_url}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">{artist.name}</h2>
                        <div className="flex items-center gap-1 text-white/90">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{artist.location}</span>
                        </div>
                      </div>
                      {savedArtists.includes(artist.id) && (
                        <div className="bg-red-500 rounded-full p-2">
                          <Heart className="h-4 w-4 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {artist.medium.slice(0, 3).map((medium) => (
                        <Badge key={medium} variant="secondary" className="bg-white/20 text-white border-white/30">
                          {medium}
                        </Badge>
                      ))}
                      {artist.featured && (
                        <Badge className="bg-primary text-white">Featured</Badge>
                      )}
                    </div>

                    {/* Bio */}
                    <p className="text-white/90 text-sm line-clamp-2">
                      {artist.bio}
                    </p>

                    {/* Tap to learn more hint */}
                    {isTop && (
                      <div className="flex items-center justify-center mt-4 opacity-80">
                        <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                          <ChevronDown className="h-4 w-4 animate-bounce" />
                          <span className="text-xs">Tap to view full profile</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Drag indicators */}
                {isTop && (
                  <>
                    {/* Like indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
                      <div className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl transform rotate-12">
                        LIKE
                      </div>
                    </div>
                    
                    {/* Pass indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
                      <div className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl transform -rotate-12">
                        PASS
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-6 px-8">
        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full bg-white shadow-xl border-2 border-red-200 hover:border-red-300"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="w-12 h-12 rounded-full bg-white shadow-lg"
          onClick={() => handleCardClick(cards[0])}
        >
          <User className="h-5 w-5 text-blue-500" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full bg-white shadow-xl border-2 border-green-200 hover:border-green-300"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </div>

      {/* Card counter */}
      <div className="absolute top-6 right-6 bg-black/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        {currentIndex + 1} / {allArtists.length}
      </div>

      {/* Instructions */}
      <div className="absolute top-6 left-6 bg-black/20 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
        Swipe or use buttons
      </div>
    </div>
  );
}
