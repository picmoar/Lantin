import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface UseDiscoverCardProps {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
}

export function useDiscoverCard({ auth }: UseDiscoverCardProps) {
  const [isDiscoverable, setIsDiscoverable] = useState(false);
  const [isCreatingDiscoverCard, setIsCreatingDiscoverCard] = useState(false);

  const handleToggleDiscoverCard = async () => {
    if (!auth.user || !auth.user.email) {
      alert('Please log in to manage your discover card');
      return;
    }

    setIsCreatingDiscoverCard(true);
    const newDiscoverableState = !isDiscoverable;

    try {
      if (supabase && auth.user.email !== 'test@mobile.com') {
        // Real user - update in database
        const { data, error } = await supabase
          .from('artists')
          .update({ discoverable: newDiscoverableState })
          .eq('email', auth.user.email)
          .select();

        if (error) {
          console.error('Failed to update discover card:', error);
          throw new Error('Failed to update discover card: ' + error.message);
        }

        if (data && data.length > 0) {
          console.log(`✅ Discover card ${newDiscoverableState ? 'activated' : 'deactivated'} successfully!`);
          setIsDiscoverable(newDiscoverableState);
          alert(newDiscoverableState
            ? 'Discover card activated! Your profile is now visible in the discover feed.'
            : 'Discover card deactivated. Your profile is hidden from the discover feed but all your edits are saved.'
          );
        } else {
          throw new Error('No records were updated');
        }
      } else {
        // Demo user - just update local state
        setIsDiscoverable(newDiscoverableState);
        alert(newDiscoverableState
          ? 'Discover card activated (demo mode)! Your profile would be visible in the discover feed.'
          : 'Discover card deactivated (demo mode). Your profile would be hidden from the discover feed.'
        );
      }
    } catch (error) {
      console.error('Error updating discover card:', error);
      alert('Failed to update discover card: ' + (error as Error).message);
    } finally {
      setIsCreatingDiscoverCard(false);
    }
  };

  // Fetch current discoverable status when component loads
  useEffect(() => {
    const fetchDiscoverableStatus = async () => {
      if (!supabase || !auth.user?.email) return;

      try {
        console.log('Fetching discoverable status for user:', auth.user.email);
        const { data, error } = await supabase
          .from('artists')
          .select('discoverable')
          .eq('email', auth.user.email)
          .single();

        if (data && !error) {
          console.log('Current discoverable status:', data.discoverable);
          setIsDiscoverable(data.discoverable || false);
        } else if (error) {
          console.log('Error fetching discoverable status:', error);
          // Keep default false state if there's an error
        }
      } catch (error) {
        console.error('Error fetching discoverable status:', error);
        // Keep default false state if there's an error
      }
    };

    if (auth.user?.email) {
      fetchDiscoverableStatus();
    }
  }, [auth.user?.email]); // Re-run when user email changes

  return {
    isDiscoverable,
    isCreatingDiscoverCard,
    handleToggleDiscoverCard
  };
}