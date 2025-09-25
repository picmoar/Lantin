import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { artists } from '../data/artists';

// Helper function to get user ID from auth user object
const getUserId = (user: any): string | null => {
  // For real users, use the ID from the user object (this matches artists table)
  if (user?.id) {
    return user.id;
  }
  return null;
};

// Supabase followers database functions
const supabaseFollowersDB = {
  // Get all followers for a user
  getUserFollowers: async (userId) => {
    console.log('🔍 getUserFollowers called with userId:', userId, 'type:', typeof userId);

    if (!supabase) {
      console.log('❌ No supabase connection in getUserFollowers');
      return [];
    }

    try {
      console.log('📊 Querying followers table for following_id:', userId);

      const { data, error } = await supabase
        .from('followers')
        .select('*')
        .eq('following_id', userId)
        .order('created_at', { ascending: false });

      console.log('📊 Query completed:', { data: data?.length || 0, error });

      if (error) {
        console.error('❌ Error fetching followers:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return [];
      }

      // Convert to expected format
      const formattedFollowers = (data || []).map(row => ({
        id: row.follower_id,
        name: row.follower_name,
        profileImage: row.follower_profile_image,
        specialty: row.follower_specialty,
        location: row.follower_location
      }));

      console.log('✅ Returning formatted followers:', formattedFollowers.length);
      return formattedFollowers;
    } catch (error) {
      console.error('❌ Error in getUserFollowers:', error);
      return [];
    }
  },

  // Add a follower
  addFollower: async (userId, follower) => {
    console.log('💾 supabaseFollowersDB.addFollower called', { userId, follower });
    console.log('🔍 Supabase connection:', !!supabase);

    if (!supabase) {
      console.log('❌ No supabase connection');
      return [];
    }

    try {
      console.log('📝 Inserting follower data:', {
        follower_id: follower.id,
        following_id: userId,
        follower_name: follower.name,
        follower_email: follower.email || '',
        follower_profile_image: follower.profileImage,
        follower_specialty: follower.specialty,
        follower_location: follower.location
      });

      // Insert new follower relationship
      const { data, error: insertError } = await supabase
        .from('followers')
        .insert({
          follower_id: follower.id,
          following_id: userId,
          follower_name: follower.name,
          follower_email: follower.email || '',
          follower_profile_image: follower.profileImage,
          follower_specialty: follower.specialty,
          follower_location: follower.location
        });

      console.log('💾 Insert result:', { data, insertError });

      if (insertError) {
        console.error('❌ Error adding follower:', insertError);
        return await supabaseFollowersDB.getUserFollowers(userId);
      }

      console.log('✅ Successfully added follower to database');
      // Return updated followers list
      return await supabaseFollowersDB.getUserFollowers(userId);
    } catch (error) {
      console.error('❌ Error in addFollower:', error);
      return [];
    }
  },

  // Remove a follower
  removeFollower: async (userId, followerId) => {
    if (!supabase) return [];

    try {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('following_id', userId)
        .eq('follower_id', followerId);

      if (error) {
        console.error('Error removing follower:', error);
      }

      // Return updated followers list
      return await supabaseFollowersDB.getUserFollowers(userId);
    } catch (error) {
      console.error('Error in removeFollower:', error);
      return [];
    }
  }
};

export function useSocial(userArtworks = [], userProfile = null, user = null) {
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followingCount, setFollowingCount] = useState(156);
  const [followersCount, setFollowersCount] = useState(0);

  // Get user ID from the user object
  const userId = getUserId(user);

  // Load favorites, following, and followers from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('userFavorites');
    const savedFollowing = localStorage.getItem('userFollowing');

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }

    if (savedFollowing) {
      try {
        setFollowing(JSON.parse(savedFollowing));
      } catch (error) {
        console.error('Error loading following from localStorage:', error);
      }
    }

    // Load followers from Supabase database
    if (userId) {
      const loadFollowers = async () => {
        const userFollowers = await supabaseFollowersDB.getUserFollowers(userId);
        setFollowers(userFollowers);
        setFollowersCount(userFollowers.length);
      };
      loadFollowers();
    }
  }, [userId, user]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save following to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userFollowing', JSON.stringify(following));
  }, [following]);

  // Note: Followers are now managed through globalFollowersDB, not localStorage

  const addToFavorites = async (artist) => {
    if (!favorites.find(fav => fav.id === artist.id)) {
      const newFavorites = [...favorites, artist];
      setFavorites(newFavorites);

      // Persist to database if user is logged in
      if (supabase) {
        try {
          // You can add database persistence here if you have a favorites table
          console.log('Added artist to favorites:', artist.name);
        } catch (error) {
          console.error('Error saving favorite to database:', error);
        }
      }
    }
  };

  const removeFromFavorites = async (artistId) => {
    const newFavorites = favorites.filter(fav => fav.id !== artistId);
    setFavorites(newFavorites);

    // Remove from database if user is logged in
    if (supabase) {
      try {
        // You can add database removal here if you have a favorites table
        console.log('Removed artist from favorites:', artistId);
      } catch (error) {
        console.error('Error removing favorite from database:', error);
      }
    }
  };

  const followArtist = async (artist) => {
    console.log('👥 followArtist called', { artist, userProfile, userId });
    console.log('🔍 Artist debug:', { artistId: artist.id, artistName: artist.name, isRealUser: artist.isRealUser, userEmail: artist.userEmail });
    console.log('🔍 Following check:', { alreadyFollowing: !!following.find(f => f.id === artist.id), followingList: following.map(f => f.id) });

    if (!following.find(f => f.id === artist.id)) {
      console.log('✅ Not already following, proceeding...');
      setFollowing([...following, artist]);
      setFollowingCount(followingCount + 1);

      // Add current user as follower to the artist being followed
      // Handle both userProfile object and string cases
      const userName = typeof userProfile === 'string' ? userProfile : userProfile?.name;
      const userProfileObj = typeof userProfile === 'object' ? userProfile : {};

      console.log('🔍 User profile debug:', { userProfile, userName, userProfileObj, type: typeof userProfile });

      if (userName && userId) {
        console.log('✅ Adding current user as follower to artist', {
          artistId: artist.id,
          artistName: artist.name,
          currentUserId: userId
        });

        const currentUserAsFollower = {
          id: userId,
          name: userName,
          email: userProfileObj.email || '',
          profileImage: userProfileObj.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          specialty: userProfileObj.specialty || 'Art Enthusiast',
          location: userProfileObj.location || 'Art Studio'
        };

        console.log('👤 Current user as follower object:', currentUserAsFollower);

        // Store follower relationship using artist UUID from database
        // artist.id should be the UUID from the artists table
        if (artist.id) {
          console.log('🔄 Adding follower relationship in database:', {
            followingArtistId: artist.id,
            followerUserId: userId
          });
          await supabaseFollowersDB.addFollower(artist.id, currentUserAsFollower);
        } else {
          console.log('❌ Artist has no ID - cannot store in database', { artist });
        }
      } else {
        console.log('❌ Missing required data for follow operation', { userName, userId });
      }
    } else {
      console.log('❌ Already following this artist, skipping...');
    }
  };

  const unfollowArtist = async (artistId) => {
    console.log('👤 unfollowArtist called', { artistId, userId });

    // Find the artist being unfollowed
    const artistToUnfollow = following.find(f => f.id === artistId);

    // Remove from localStorage
    setFollowing(following.filter(f => f.id !== artistId));
    setFollowingCount(Math.max(0, followingCount - 1));

    // Remove from database using artist UUID
    if (artistToUnfollow && artistToUnfollow.id && userId) {
      console.log('🗑️ Removing follower from database:', {
        artistId: artistToUnfollow.id,
        userId: userId
      });
      try {
        await supabaseFollowersDB.removeFollower(artistToUnfollow.id, userId);
        console.log('✅ Successfully removed follower from database');
      } catch (error) {
        console.error('❌ Error removing follower from database:', error);
      }
    } else {
      console.log('ℹ️ Cannot remove from database - missing IDs', {
        artistId: artistToUnfollow?.id,
        userId
      });
    }
  };

  const addFollower = async (user) => {
    const updatedFollowers = await supabaseFollowersDB.addFollower(userId, user);
    setFollowers(updatedFollowers);
    setFollowersCount(updatedFollowers.length);
  };

  const removeFollower = async (followerId) => {
    const updatedFollowers = await supabaseFollowersDB.removeFollower(userId, followerId);
    setFollowers(updatedFollowers);
    setFollowersCount(updatedFollowers.length);
  };


  return {
    favorites,
    following,
    followers,
    followingCount,
    followersCount,
    addToFavorites,
    removeFromFavorites,
    followArtist,
    unfollowArtist,
    addFollower,
    removeFollower,
    setFollowingCount
  };
}