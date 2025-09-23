import { useState, useCallback } from 'react';

export interface UseBoothNavigationReturn {
  currentUserBoothIndex: number;
  goToPrevious: () => void;
  goToNext: () => void;
  goToIndex: (index: number) => void;
  resetIndex: () => void;
}

export const useBoothNavigation = (totalBooths: number): UseBoothNavigationReturn => {
  const [currentUserBoothIndex, setCurrentUserBoothIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentUserBoothIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : totalBooths - 1
    );
  }, [totalBooths]);

  const goToNext = useCallback(() => {
    setCurrentUserBoothIndex(prevIndex =>
      prevIndex < totalBooths - 1 ? prevIndex + 1 : 0
    );
  }, [totalBooths]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalBooths) {
      setCurrentUserBoothIndex(index);
    }
  }, [totalBooths]);

  const resetIndex = useCallback(() => {
    setCurrentUserBoothIndex(0);
  }, []);

  return {
    currentUserBoothIndex,
    goToPrevious,
    goToNext,
    goToIndex,
    resetIndex
  };
};