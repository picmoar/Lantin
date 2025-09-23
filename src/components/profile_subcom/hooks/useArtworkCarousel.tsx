import { useState } from 'react';

interface UseArtworkCarouselProps {
  userArtworks: any[];
}

export function useArtworkCarousel({ userArtworks }: UseArtworkCarouselProps) {
  const [artworkPage, setArtworkPage] = useState(0);

  const artworksPerPage = 4;
  const totalPages = Math.ceil(userArtworks.length / artworksPerPage);

  // Get current page artworks (slice of 4)
  const currentArtworks = userArtworks.slice(
    artworkPage * artworksPerPage,
    (artworkPage * artworksPerPage) + artworksPerPage
  );

  // Navigation functions
  const goToNextPage = () => {
    setArtworkPage(Math.min(totalPages - 1, artworkPage + 1));
  };

  const goToPrevPage = () => {
    setArtworkPage(Math.max(0, artworkPage - 1));
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setArtworkPage(pageIndex);
    }
  };

  // Helper flags for UI state
  const isFirstPage = artworkPage === 0;
  const isLastPage = artworkPage >= totalPages - 1;
  const hasMultiplePages = userArtworks.length > artworksPerPage;

  return {
    artworkPage,
    totalPages,
    currentArtworks,
    goToNextPage,
    goToPrevPage,
    goToPage,
    isFirstPage,
    isLastPage,
    hasMultiplePages,
    setArtworkPage
  };
}