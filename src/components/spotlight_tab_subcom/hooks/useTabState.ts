import { useState, useCallback } from 'react';

export type TabView = 'booths' | 'events';

export interface UseTabStateReturn {
  currentView: TabView;
  setCurrentView: (view: TabView) => void;
  switchToBooths: () => void;
  switchToEvents: () => void;
  isBoothsView: boolean;
  isEventsView: boolean;
}

export const useTabState = (initialView: TabView = 'booths'): UseTabStateReturn => {
  const [currentView, setCurrentView] = useState<TabView>(initialView);

  const switchToBooths = useCallback(() => {
    setCurrentView('booths');
  }, []);

  const switchToEvents = useCallback(() => {
    setCurrentView('events');
  }, []);

  const isBoothsView = currentView === 'booths';
  const isEventsView = currentView === 'events';

  return {
    currentView,
    setCurrentView,
    switchToBooths,
    switchToEvents,
    isBoothsView,
    isEventsView
  };
};