import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface ContactInfo {
  email: string;
  location: string;
}

interface UseContactInfoProps {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  currentArtist: any;
  isCurrentUserProfile: (artist: any) => boolean;
}

export function useContactInfo({ auth, currentArtist, isCurrentUserProfile }: UseContactInfoProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ email: '', location: '' });
  const [contactLoading, setContactLoading] = useState(false);

  const fetchContactInfo = async () => {
    if (!supabase || !auth.user || !currentArtist || !isCurrentUserProfile(currentArtist)) {
      setContactInfo({ email: '', location: '' });
      return;
    }

    try {
      setContactLoading(true);
      console.log('Fetching contact info for user:', auth.user.id);

      // Fetch contact information from discover_contact and discover_location columns
      const { data, error } = await supabase
        .from('artists')
        .select('discover_contact, discover_location')
        .eq('id', auth.user.id)
        .single();

      if (error) throw error;

      console.log('Fetched contact info:', data);
      setContactInfo({
        email: data?.discover_contact || '',
        location: data?.discover_location || ''
      });
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setContactInfo({ email: '', location: '' });
    } finally {
      setContactLoading(false);
    }
  };

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (currentArtist) {
      fetchContactInfo();
    }
  }, [auth.user?.id, currentArtist]);

  return {
    contactInfo,
    contactLoading,
    fetchContactInfo,
    refetchContactInfo: fetchContactInfo
  };
}
