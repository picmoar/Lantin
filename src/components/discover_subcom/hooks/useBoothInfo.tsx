import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface BoothInfo {
  name: string;
  artistName: string;
  location: string;
  description: string;
  image: string;
}

interface UseBoothInfoProps {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  currentArtist: any;
  isCurrentUserProfile: (artist: any) => boolean;
}

export function useBoothInfo({ auth, currentArtist, isCurrentUserProfile }: UseBoothInfoProps) {
  const [boothInfo, setBoothInfo] = useState<BoothInfo>({
    name: '',
    artistName: '',
    location: '',
    description: '',
    image: ''
  });
  const [boothLoading, setBoothLoading] = useState(false);

  const fetchBoothInfo = async () => {
    if (!supabase || !currentArtist) {
      console.log('🏪 fetchBoothInfo: Skipping - no current artist');
      setBoothInfo({ name: '', artistName: '', location: '', description: '', image: '' });
      return;
    }

    // Determine which artist ID to use based on context
    const targetArtistId = isCurrentUserProfile(currentArtist) && auth.user
      ? auth.user.id                    // Use authenticated user's UUID for own profile
      : (currentArtist as any).userId;  // Use currentArtist.userId (real UUID) for viewing others

    try {
      setBoothLoading(true);
      console.log('🏪 fetchBoothInfo: Starting for artist:', targetArtistId);
      console.log('🏪 fetchBoothInfo: isCurrentUserProfile:', isCurrentUserProfile(currentArtist));

      // First get the artist's discover_booth_id
      const { data: userData, error: userError } = await supabase
        .from('artists')
        .select('discover_booth_id')
        .eq('id', targetArtistId)
        .single();

      if (userError) {
        console.error('🏪 fetchBoothInfo: Error fetching user data:', userError);
        throw userError;
      }

      console.log('🏪 fetchBoothInfo: User data retrieved:', userData);
      console.log('🏪 fetchBoothInfo: discover_booth_id:', userData?.discover_booth_id);

      if (userData?.discover_booth_id) {
        console.log('🏪 fetchBoothInfo: Fetching specific booth with ID:', userData.discover_booth_id);
        // Fetch the specific booth selected for discover page
        const { data: booth, error: boothError } = await supabase
          .from('booths')
          .select('*')
          .eq('id', userData.discover_booth_id)
          .single();

        if (boothError) {
          console.error('🏪 fetchBoothInfo: Error fetching specific booth:', boothError);
          throw boothError;
        }

        console.log('🏪 fetchBoothInfo: Retrieved specific booth:', booth);
        const boothData = {
          name: booth.name || `${currentArtist.full_name || 'Artist'}'s Studio`,
          artistName: booth.operator_name || currentArtist.full_name || 'Artist',
          location: booth.location || 'Studio Location',
          description: booth.description || 'Visit my creative space',
          image: booth.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
        };
        console.log('🏪 fetchBoothInfo: Setting booth info:', boothData);
        setBoothInfo(boothData);
      } else {
        console.log('🏪 fetchBoothInfo: No discover_booth_id, fetching most recent booth');
        // No specific booth selected, get the most recent booth
        const { data: booths, error: boothsError } = await supabase
          .from('booths')
          .select('*')
          .eq('artist_id', targetArtistId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (boothsError) {
          console.error('🏪 fetchBoothInfo: Error fetching recent booths:', boothsError);
          throw boothsError;
        }

        console.log('🏪 fetchBoothInfo: Retrieved recent booths:', booths);
        if (booths && booths.length > 0) {
          const booth = booths[0];
          console.log('🏪 fetchBoothInfo: Using most recent booth:', booth);
          const boothData = {
            name: booth.name || `${currentArtist.full_name || 'Artist'}'s Studio`,
            artistName: booth.operator_name || currentArtist.full_name || 'Artist',
            location: booth.location || 'Studio Location',
            description: booth.description || 'Visit my creative space',
            image: booth.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'
          };
          console.log('🏪 fetchBoothInfo: Setting booth info from recent:', boothData);
          setBoothInfo(boothData);
        } else {
          console.log('🏪 fetchBoothInfo: No booths found, setting empty state');
          setBoothInfo({ name: '', artistName: '', location: '', description: '', image: '' });
        }
      }
    } catch (error) {
      console.error('🏪 fetchBoothInfo: Error:', error);
      setBoothInfo({ name: '', artistName: '', location: '', description: '', image: '' });
    } finally {
      setBoothLoading(false);
      console.log('🏪 fetchBoothInfo: Completed');
    }
  };

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (currentArtist) {
      fetchBoothInfo();
    }
  }, [currentArtist?.id, auth.user?.id]);

  return {
    boothInfo,
    boothLoading,
    fetchBoothInfo,
    refetchBoothInfo: fetchBoothInfo
  };
}
