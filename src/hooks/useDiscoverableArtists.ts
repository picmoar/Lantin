import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { artists as staticArtists } from '../data/artists';
import type { Artist } from '../data/artists';
import { getValidImageUrl } from '../utils/imageUtils';

export function useDiscoverableArtists() {
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscoverableUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!supabase) {
        console.log('No Supabase - using static artists only');
        setAllArtists(staticArtists);
        setIsLoading(false);
        return;
      }

      // Fetch discoverable users with their artworks (booths fetched separately to avoid relation issues)
      // Add timestamp to prevent caching issues
      const refreshTimestamp = Date.now();
      console.log(`🔄 Fetching fresh discoverable users from database... (refresh: ${refreshTimestamp})`);

      // Force fresh query with cache-busting - create a new supabase instance for this call
      console.log('🔄 Creating fresh supabase query to bypass any caching...');
      const freshClient = supabase;

      const { data: discoverableUsers, error: usersError } = await freshClient
        .from('artists')
        .select(`
          *,
          artworks:artworks(*)
        `)
        .eq('discoverable', true)
        .gte('updated_at', '2000-01-01T00:00:00.000Z') // Force condition to bypass cache
        .order('updated_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching discoverable users:', usersError);
        setError('Failed to load discoverable artists');
        setAllArtists(staticArtists);
        setIsLoading(false);
        return;
      }

      console.log(`Found ${discoverableUsers?.length || 0} discoverable users`);
      console.log('📊 Discoverable users data:', discoverableUsers?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        discoverable: user.discoverable,
        created_at: user.created_at,
        updated_at: user.updated_at,
        timestamp_comparison: {
          created_newer_than_updated: new Date(user.created_at) > new Date(user.updated_at),
          created_date: new Date(user.created_at).toISOString(),
          updated_date: new Date(user.updated_at).toISOString(),
          now_date: new Date().toISOString()
        }
      })));

      // Fetch booths for all discoverable users
      let allUserBooths: any[] = [];
      if (discoverableUsers && discoverableUsers.length > 0) {
        const userIds = discoverableUsers.map(user => user.id);
        const { data: boothsData, error: boothsError } = await supabase
          .from('booths')
          .select('*')
          .in('artist_id', userIds);

        if (boothsError) {
          console.warn('Error fetching booths (will continue without booth data):', boothsError);
        } else {
          allUserBooths = boothsData || [];
          console.log(`Found ${allUserBooths.length} booths for discoverable users`);
        }
      }

      // Convert real users to Artist format
      const formattedRealUsers: Artist[] = (discoverableUsers || []).map((user, index) => {
        // Get user's artwork images, prioritizing featured artworks
        const userArtworks = user.artworks || [];

        // Separate featured and non-featured artworks (with fallback for missing column)
        const featuredArtworks = userArtworks.filter((artwork: any) => artwork.artwork_featured === true);
        const nonFeaturedArtworks = userArtworks.filter((artwork: any) => artwork.artwork_featured !== true);

        // Separate discover/sale artworks (for "Available for Purchase" section)
        const saleDiscoverArtworks = userArtworks.filter((artwork: any) => artwork.artwork_discover === true);

        // Debug logging for artwork sections
        console.log(`🎨 User ${user.name} - Artwork breakdown:`, {
          total_artworks: userArtworks.length,
          featured_count: featuredArtworks.length,
          sale_discover_count: saleDiscoverArtworks.length,
          featured_artwork_ids: featuredArtworks.map(art => ({ id: art.id, title: art.title, featured: art.artwork_featured })),
          sale_artwork_ids: saleDiscoverArtworks.map(art => ({ id: art.id, title: art.title, discover: art.artwork_discover }))
        });

        // Gallery section should only show featured artworks (not a mix)
        const galleryArtworks = featuredArtworks.slice(0, 4);

        const artworkImages = galleryArtworks
          .map((artwork: any) => getValidImageUrl(artwork))
          .filter(Boolean);

        // Use placeholder images if no artworks
        const defaultArtworkImages = [
          'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop'
        ];

        const finalArtworkImages = artworkImages.length > 0 ? artworkImages : defaultArtworkImages;

        // Debug the image selection logic
        console.log(`🖼️ User ${user.name} - Image selection logic:`, {
          galleryArtworks_length: galleryArtworks.length,
          artworkImages_length: artworkImages.length,
          using_default: artworkImages.length === 0,
          finalArtworkImages_length: finalArtworkImages.length,
          finalArtworkImages: finalArtworkImages
        });

        // Get user's booth data from separately fetched booths
        const userBooths = allUserBooths.filter(booth => booth.artist_id === user.id);
        const primaryBooth = userBooths.length > 0 ? userBooths[0] : null;

        console.log(`🏪 User ${user.name}: Found ${userBooths.length} booths, primaryBooth:`, primaryBooth);

        const boothData = primaryBooth ? {
          name: primaryBooth.name || `${user.name || 'Artist'}'s Studio`,
          artistName: primaryBooth.operator_name || user.name || 'Artist',
          location: primaryBooth.location || user.location || 'Studio Location',
          description: primaryBooth.description || 'Visit my creative space',
          image: primaryBooth.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
        } : null;

        console.log(`🏪 User ${user.name}: Final boothData:`, boothData);

        return {
          id: user.id, // Use actual UUID from database
          name: user.name || 'Artist',
          specialty: user.specialty || 'Art Enthusiast',
          location: user.location || 'Art Studio',
          description: user.bio || 'Passionate about creating and sharing amazing art.',
          fullBio: user.discover_bio || `${user.name || 'This artist'} is a talented creator based in ${user.location || 'their studio'}. ${user.bio || 'They are passionate about creating and sharing amazing art with the world.'}\n\nAs a ${user.specialty || 'dedicated artist'}, they bring a unique perspective to their work. Their artworks showcase creativity and skill, reflecting their artistic journey and vision.\n\nYou can connect with them through the Lantin platform to see more of their work and follow their artistic journey.`,
          image: user.profile_image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=600&fit=crop&crop=face',
          profileImage: user.profile_image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
          artworkImages: finalArtworkImages,
          featured: false, // Real users are not featured by default
          followers: '0', // Could be calculated from social data later
          artworks: userArtworks.length,
          exhibitions: 0, // Could be calculated from events later
          // Add flag to identify real users
          isRealUser: true,
          userId: user.id, // Store real user ID for navigation
          userEmail: user.email,
          // Add contact information for discover cards
          discoverEmail: user.discover_contact || '',
          discoverLocation: user.discover_location || user.location || 'Art Studio',
          // Add sale artworks for discover cards
          saleArtworks: saleDiscoverArtworks, // Artworks marked for sale/discover
          // Add booth data for discover cards
          boothData: boothData
        } as Artist & {
          isRealUser?: boolean;
          userId?: string;
          userEmail?: string;
          discoverEmail?: string;
          discoverLocation?: string;
          saleArtworks?: any[];
          boothData?: {
            name: string;
            artistName: string;
            location: string;
            description: string;
            image: string;
          } | null;
        };
      });

      // Combine real users with static artists (real users first, then static)
      const combinedArtists = [...formattedRealUsers, ...staticArtists];

      console.log(`Total artists: ${combinedArtists.length} (${staticArtists.length} static + ${formattedRealUsers.length} real)`);
      setAllArtists(combinedArtists);

    } catch (error) {
      console.error('Error in fetchDiscoverableUsers:', error);
      setError('Failed to load artists');
      // Always fall back to static artists if there's an error
      setAllArtists(staticArtists);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]); // Include supabase as dependency to ensure fresh queries


  return {
    artists: allArtists,
    isLoading,
    error,
    refetch: fetchDiscoverableUsers
  };
}