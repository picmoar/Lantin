import { useCallback } from 'react';

export interface UseSpotlightActionsProps {
  setShowCreateBoothModal: (show: boolean) => void;
  setShowCreateEventModal: (show: boolean) => void;
  setShowEditBoothModal: (show: boolean) => void;
  setShowEditEventModal: (show: boolean) => void;
  setSelectedBooth: (booth: any) => void;
  setSelectedEvent: (event: any) => void;
  deleteBooth: (id: any) => void;
  deleteEvent: (id: any) => void;
}

export interface UseSpotlightActionsReturn {
  handleCreateBooth: () => void;
  handleCreateEvent: () => void;
  handleEditBooth: () => void;
  handleEditEvent: () => void;
  handleBoothClick: (boothData: any) => void;
  handleEventClick: (eventData: any) => void;
  handleDeleteBooth: (boothId: any) => void;
  handleDeleteEvent: (eventId: any) => void;
}

export const useSpotlightActions = ({
  setShowCreateBoothModal,
  setShowCreateEventModal,
  setShowEditBoothModal,
  setShowEditEventModal,
  setSelectedBooth,
  setSelectedEvent,
  deleteBooth,
  deleteEvent
}: UseSpotlightActionsProps): UseSpotlightActionsReturn => {

  const handleCreateBooth = useCallback(() => {
    setShowCreateBoothModal(true);
  }, [setShowCreateBoothModal]);

  const handleCreateEvent = useCallback(() => {
    setShowCreateEventModal(true);
  }, [setShowCreateEventModal]);

  const handleEditBooth = useCallback(() => {
    setShowEditBoothModal(true);
  }, [setShowEditBoothModal]);

  const handleEditEvent = useCallback(() => {
    setShowEditEventModal(true);
  }, [setShowEditEventModal]);

  const handleBoothClick = useCallback((boothData: any) => {
    setSelectedBooth(boothData);
  }, [setSelectedBooth]);

  const handleEventClick = useCallback((eventData: any) => {
    setSelectedEvent(eventData);
  }, [setSelectedEvent]);

  const handleDeleteBooth = useCallback((boothId: any) => {
    deleteBooth(boothId);
  }, [deleteBooth]);

  const handleDeleteEvent = useCallback((eventId: any) => {
    deleteEvent(eventId);
  }, [deleteEvent]);

  return {
    handleCreateBooth,
    handleCreateEvent,
    handleEditBooth,
    handleEditEvent,
    handleBoothClick,
    handleEventClick,
    handleDeleteBooth,
    handleDeleteEvent
  };
};