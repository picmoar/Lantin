import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface SaleArtwork {
  id: string;
  title: string;
  image: string;
  price: number;
}

interface UseSaleArtworksProps {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  currentArtist: any;
  isCurrentUserProfile: (artist: any) => boolean;
}

export function useSaleArtworks({ auth, currentArtist, isCurrentUserProfile }: UseSaleArtworksProps) {
  const [saleArtworks, setSaleArtworks] = useState<SaleArtwork[]>([]);
  const [saleArtworksLoading, setSaleArtworksLoading] = useState(false);

  const fetchSaleArtworks = async () => {
    if (!supabase || !auth.user || !currentArtist || !isCurrentUserProfile(currentArtist)) {
      setSaleArtworks([]);
      return;
    }

    try {
      setSaleArtworksLoading(true);
      console.log('Fetching sale artworks for user:', auth.user.id);

      // Fetch artworks that are marked for sale (artwork_discover: true) and have prices
      let { data, error } = await supabase
        .from('artworks')
        .select('id, title, image, price')
        .eq('artist_id', auth.user.id)
        .eq('artwork_discover', true)
        .not('price', 'is', null)
        .gt('price', 0)
        .order('created_at', { ascending: false });

      // Fallback if artwork_discover column doesn't exist
      if (error && error.message.includes('artwork_discover')) {
        console.log('artwork_discover column not found, skipping sale artworks');
        setSaleArtworks([]);
        return;
      }

      if (error) throw error;

      console.log('Fetched sale artworks:', data);
      setSaleArtworks(data || []);
    } catch (error) {
      console.error('Error fetching sale artworks:', error);
      setSaleArtworks([]);
    } finally {
      setSaleArtworksLoading(false);
    }
  };

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (currentArtist) {
      fetchSaleArtworks();
    }
  }, [auth.user?.id, currentArtist]);

  return {
    saleArtworks,
    saleArtworksLoading,
    fetchSaleArtworks,
    refetchSaleArtworks: fetchSaleArtworks
  };
}