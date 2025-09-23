import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface GalleryArtwork {
  id: string;
  title: string;
  image: string;
  medium: string;
  year: number;
  description?: string;
  dimensions?: string;
  photos: Array<{
    id: string;
    url: string;
  }>;
}

interface UseGalleryArtworksProps {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  currentArtist: any;
  isCurrentUserProfile: (artist: any) => boolean;
}

export function useGalleryArtworks({ auth, currentArtist, isCurrentUserProfile }: UseGalleryArtworksProps) {
  const [galleryArtworks, setGalleryArtworks] = useState<GalleryArtwork[]>([]);
  const [galleryArtworksLoading, setGalleryArtworksLoading] = useState(false);

  const fetchGalleryArtworks = async () => {
    if (!supabase || !currentArtist) {
      setGalleryArtworks([]);
      return;
    }

    // Only fetch real artworks for real users, not mock artists
    if (!currentArtist.isRealUser || !currentArtist.userId) {
      setGalleryArtworks([]);
      return;
    }

    try {
      setGalleryArtworksLoading(true);
      console.log('Fetching gallery artworks for artist:', currentArtist.userId);

      // Fetch artworks that are marked as featured (artwork_featured: true) - these are the gallery artworks
      let { data, error } = await supabase
        .from('artworks')
        .select('id, title, image, medium, year, description, dimensions')
        .eq('artist_id', currentArtist.userId)
        .eq('artwork_featured', true)
        .order('created_at', { ascending: false });

      // Fallback if artwork_featured column doesn't exist
      if (error && error.message.includes('artwork_featured')) {
        console.log('artwork_featured column not found, skipping gallery artworks');
        setGalleryArtworks([]);
        return;
      }

      if (error) throw error;

      console.log('Fetched gallery artworks:', data);

      // Transform artworks to include photos array (same logic as profile section)
      const transformedArtworks = (data || []).map(artwork => {
        // Parse images from the image field (could be JSON string or single URL)
        let photos;
        if (artwork.image) {
          try {
            // Try parsing as JSON array first (multi-image format)
            const parsedImages = JSON.parse(artwork.image);
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
              photos = parsedImages.map((imageUrl, index) => ({
                id: `artwork-${artwork.id}-${index}`,
                url: imageUrl
              }));
            } else {
              // Single image in array format
              photos = [{
                id: `artwork-${artwork.id}`,
                url: artwork.image
              }];
            }
          } catch {
            // If parsing fails, treat as single image URL
            photos = [{
              id: `artwork-${artwork.id}`,
              url: artwork.image
            }];
          }
        } else {
          // Fallback placeholder
          photos = [{
            id: 'placeholder',
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop'
          }];
        }

        return {
          ...artwork,
          photos: photos
        };
      });

      setGalleryArtworks(transformedArtworks);
    } catch (error) {
      console.error('Error fetching gallery artworks:', error);
      setGalleryArtworks([]);
    } finally {
      setGalleryArtworksLoading(false);
    }
  };

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (currentArtist) {
      fetchGalleryArtworks();
    }
  }, [auth.user?.id, currentArtist]);

  return {
    galleryArtworks,
    galleryArtworksLoading,
    fetchGalleryArtworks,
    refetchGalleryArtworks: fetchGalleryArtworks
  };
}
