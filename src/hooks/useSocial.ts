import { useState } from 'react';

export function useSocial() {
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followingCount, setFollowingCount] = useState(156);
  const [followersCount, setFollowersCount] = useState(89);

  const addToFavorites = (artist) => {
    if (!favorites.find(fav => fav.id === artist.id)) {
      setFavorites([...favorites, artist]);
    }
  };

  const removeFromFavorites = (artistId) => {
    setFavorites(favorites.filter(fav => fav.id !== artistId));
  };

  const followArtist = (artist) => {
    if (!following.find(f => f.id === artist.id)) {
      setFollowing([...following, artist]);
      setFollowingCount(followingCount + 1);
    }
  };

  const unfollowArtist = (artistId) => {
    setFollowing(following.filter(f => f.id !== artistId));
    setFollowingCount(Math.max(0, followingCount - 1));
  };

  return {
    favorites,
    following,
    followingCount,
    followersCount,
    addToFavorites,
    removeFromFavorites,
    followArtist,
    unfollowArtist,
    setFollowingCount
  };
}