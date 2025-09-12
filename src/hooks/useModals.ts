import { useState } from 'react';

export function useModals() {
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateArtworkModal, setShowCreateArtworkModal] = useState(false);
  const [showCreateBoothModal, setShowCreateBoothModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [showEditBoothModal, setShowEditBoothModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const openCreateEventModal = () => setShowCreateEventModal(true);
  const closeCreateEventModal = () => setShowCreateEventModal(false);
  
  const openCreateArtworkModal = () => setShowCreateArtworkModal(true);
  const closeCreateArtworkModal = () => setShowCreateArtworkModal(false);
  
  const openCreateBoothModal = () => setShowCreateBoothModal(true);
  const closeCreateBoothModal = () => setShowCreateBoothModal(false);
  
  const openCartModal = () => setShowCartModal(true);
  const closeCartModal = () => setShowCartModal(false);
  
  const openFavoritesModal = () => setShowFavoritesModal(true);
  const closeFavoritesModal = () => setShowFavoritesModal(false);
  
  const openFullImageModal = (image) => {
    setSelectedImage(image);
    setShowFullImageModal(true);
  };
  const closeFullImageModal = () => {
    setShowFullImageModal(false);
    setSelectedImage(null);
  };
  
  const openEditBoothModal = () => setShowEditBoothModal(true);
  const closeEditBoothModal = () => setShowEditBoothModal(false);
  
  const openArtworkDetail = (artwork) => setSelectedArtwork(artwork);
  const closeArtworkDetail = () => setSelectedArtwork(null);
  
  const openBoothDetail = (booth) => setSelectedBooth(booth);
  const closeBoothDetail = () => setSelectedBooth(null);

  const openEventDetail = (event) => setSelectedEvent(event);
  const closeEventDetail = () => setSelectedEvent(null);

  return {
    // Modal states
    showCreateEventModal,
    showCreateArtworkModal,
    showCreateBoothModal,
    showCartModal,
    showFavoritesModal,
    showFullImageModal,
    showEditBoothModal,
    selectedArtwork,
    selectedBooth,
    selectedEvent,
    selectedImage,
    
    // Modal actions
    openCreateEventModal,
    closeCreateEventModal,
    openCreateArtworkModal,
    closeCreateArtworkModal,
    openCreateBoothModal,
    closeCreateBoothModal,
    openCartModal,
    closeCartModal,
    openFavoritesModal,
    closeFavoritesModal,
    openFullImageModal,
    closeFullImageModal,
    openEditBoothModal,
    closeEditBoothModal,
    openArtworkDetail,
    closeArtworkDetail,
    openBoothDetail,
    closeBoothDetail,
    openEventDetail,
    closeEventDetail
  };
}