import React, { useState, useEffect } from 'react';
import { animationStyles } from './styles/LantinApp.styles';
import { artists } from './data/artists';
import { supabase } from './lib/supabase';

// Custom hooks
import { useAuth } from './hooks/useAuth';
import { useShoppingCart } from './hooks/useShoppingCart';
import { useModals } from './hooks/useModals';
import { useUserContent } from './hooks/useUserContent';
import { useSocial } from './hooks/useSocial';

// Import components
import Header from './components/Header';
import DiscoverTab from './components/DiscoverTab';
import ShopTab from './components/ShopTab';
import BoothsTab from './components/BoothsTab';
import MapSection from './components/MapSection';
import MessagesTab from './components/MessagesTab';
import ProfileTab from './components/ProfileTab';
import BottomNavigation from './components/BottomNavigation';
import LoginForm from './components/LoginForm';

// Import modals
import FullImageModal from './components/FullImageModal';
import ShoppingCartModal from './components/ShoppingCartModal';
import BoothDetailsModal from './components/BoothDetailsModal';
import EventDetailsModal from './components/EventDetailsModal';
import CreateEventModal from './components/CreateEventModal';
import CreateArtworkModal from './components/CreateArtworkModal';
import CreateBoothModal from './components/CreateBoothModal';
import ArtworkDetailModal from './components/ArtworkDetailModal';

export default function LantinAppSimple() {
  const [activeTab, setActiveTab] = useState('discover');

  // Custom function to handle tab switching with scroll to top
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // Scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom hooks
  const auth = useAuth();
  const shoppingHook = useShoppingCart();
  const modals = useModals();
  const userContent = useUserContent(auth.user, auth.userProfile);
  const social = useSocial();


  // Modal handlers that need checkout functionality
  const handleCheckout = () => {
    const success = shoppingHook.checkout();
    if (success) {
      modals.closeCartModal();
    }
  };

  const handleCreateEvent = async (eventData) => {
    const success = await userContent.createEvent(eventData);
    if (success) {
      modals.closeCreateEventModal();
    }
  };

  const handleUpdateEvent = async (eventData) => {
    const success = await userContent.updateEvent(eventData);
    if (success) {
      modals.closeEditEventModal();
    }
  };

  const handleCreateArtwork = async (artworkData) => {
    const success = await userContent.createArtwork(artworkData);
    if (success) {
      modals.closeCreateArtworkModal();
    }
  };

  const handleUpdateArtwork = async (artworkData) => {
    if (modals.selectedArtwork?.id) {
      const success = await userContent.updateArtwork(modals.selectedArtwork.id, artworkData);
      if (success) {
        modals.closeEditArtworkModal();
      }
    }
  };

  const handleCreateBooth = async (boothData) => {
    const success = await userContent.createBooth(boothData);
    if (success) {
      modals.closeCreateBoothModal();
    }
  };

  const handleUpdateBooth = async (boothData) => {
    const success = await userContent.updateBooth(boothData);
    if (success) {
      modals.closeEditBoothModal();
    }
  };

  const handleDeleteArtwork = (artworkId) => {
    userContent.deleteArtwork(artworkId);
    modals.closeArtworkDetail();
  };



  return (
    <div>
      {/* CSS Animations for Like Effects */}
      <style>{animationStyles}</style>
      
      <div style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          maxWidth: '375px',
          width: '100%',
          backgroundColor: 'white',
          position: 'relative'
        }}>
          
          {/* Header */}
          <Header 
            auth={auth}
            handleLogin={auth.handleLogin}
            handleLogout={auth.signOut}
          />

          {/* Content */}
          <div style={{
            padding: '16px',
            paddingBottom: '100px'
          }}>
            {/* Tab Content - Always show tabs, handle login inside components */}
            {activeTab === 'discover' && (
              <DiscoverTab 
                auth={auth}
                favorites={social.favorites}
                following={social.following}
                shoppingCart={shoppingHook.shoppingCart}
                addToFavorites={social.addToFavorites}
                followArtist={social.followArtist}
                addToCart={shoppingHook.addToCart}
                setFollowingCount={social.setFollowingCount}
                followingCount={social.followingCount}
              />
            )}

            {activeTab === 'map' && (
              <MapSection
                allBooths={userContent.allBooths}
                allEvents={userContent.allEvents}
                auth={auth}
                onBoothSelect={modals.openBoothDetail}
                onEventSelect={modals.openEventDetail}
                isVisible={activeTab === 'map'}
              />
            )}

            {activeTab === 'booths' && (
              <BoothsTab 
                auth={auth}
                userBooth={userContent.userBooth}
                userBooths={userContent.userBooths}
                allBooths={userContent.allBooths}
                userEvents={userContent.userEvents}
                allEvents={userContent.allEvents}
                setShowCreateBoothModal={modals.openCreateBoothModal}
                setShowCreateEventModal={modals.openCreateEventModal}
                setShowEditEventModal={modals.openEditEventModal}
                setShowEditBoothModal={modals.openEditBoothModal}
                setSelectedBooth={modals.openBoothDetail}
                setSelectedEvent={modals.openEventDetail}
                deleteBooth={userContent.deleteBooth}
                deleteEvent={userContent.deleteEvent}
              />
            )}

            {activeTab === 'message' && (
              !auth.isLoggedIn ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <div style={{fontSize: '48px', marginBottom: '16px'}}>💬</div>
                  <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>
                    Messages
                  </h3>
                  <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5'}}>
                    Sign in to send messages and connect with other artists in the community.
                  </p>
                  <LoginForm 
                    auth={auth}
                    handleGoogleLogin={auth.handleGoogleLogin}
                    sendEmailCode={auth.sendEmailCode}
                    handleEmailOtpLogin={auth.handleEmailOtpLogin}
                    handleMobileTestLogin={auth.handleMobileTestLogin}
                  />
                </div>
              ) : (
                <MessagesTab 
                  auth={auth}
                />
              )
            )}

            {activeTab === 'profile' && (
              !auth.isLoggedIn ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <div style={{fontSize: '48px', marginBottom: '16px'}}>👤</div>
                  <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>
                    Your Profile
                  </h3>
                  <p style={{fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5'}}>
                    Create your artist profile, showcase your work, and manage your account.
                  </p>
                  <LoginForm 
                    auth={auth}
                    handleGoogleLogin={auth.handleGoogleLogin}
                    sendEmailCode={auth.sendEmailCode}
                    handleEmailOtpLogin={auth.handleEmailOtpLogin}
                    handleMobileTestLogin={auth.handleMobileTestLogin}
                  />
                </div>
              ) : (
                <ProfileTab
                  auth={auth}
                  favorites={social.favorites}
                  userArtworks={userContent.userArtworks}
                  setShowFavoritesModal={modals.openFavoritesModal}
                  setShowCreateArtworkModal={modals.openCreateArtworkModal}
                  setSelectedArtwork={modals.openArtworkDetail}
                  deleteArtwork={userContent.deleteArtwork}
                  handleLogin={auth.handleLogin}
                  sendEmailCode={auth.sendEmailCode}
                  handleEmailOtpLogin={auth.handleEmailOtpLogin}
                  handleMobileTestLogin={auth.handleMobileTestLogin}
                  handleProfileImageUpload={auth.handleProfileImageUpload}
                  handleProfileUpdate={auth.handleProfileUpdate}
                />
              )
            )}
          </div>

          {/* All Modals */}
          {modals.showCreateEventModal && (
            <CreateEventModal
              onClose={modals.closeCreateEventModal}
              onSubmit={handleCreateEvent}
              userProfile={auth.userProfile}
              supabase={supabase}
              user={auth.user}
            />
          )}

          {modals.showEditEventModal && userContent.userEvents?.length > 0 && (
            <CreateEventModal
              onClose={modals.closeEditEventModal}
              onSubmit={handleUpdateEvent}
              userProfile={auth.userProfile}
              supabase={supabase}
              user={auth.user}
              initialData={userContent.userEvents[0]}
              isEditing={true}
            />
          )}

          {modals.showCreateArtworkModal && (
            <CreateArtworkModal
              onClose={modals.closeCreateArtworkModal}
              onSubmit={handleCreateArtwork}
              userProfile={auth.userProfile}
              supabase={supabase}
              user={auth.user}
            />
          )}

          {modals.showEditArtworkModal && modals.selectedArtwork && (
            <CreateArtworkModal
              onClose={modals.closeEditArtworkModal}
              onSubmit={handleUpdateArtwork}
              userProfile={auth.userProfile}
              supabase={supabase}
              user={auth.user}
              initialData={modals.selectedArtwork}
              isEditing={true}
            />
          )}

          {modals.showCreateBoothModal && (
            <CreateBoothModal
              onClose={modals.closeCreateBoothModal}
              onSubmit={handleCreateBooth}
              userProfile={auth.userProfile}
              supabase={supabase}
              user={auth.user}
            />
          )}

          {modals.showEditBoothModal && userContent.userBooth && (
            <CreateBoothModal
              onClose={modals.closeEditBoothModal}
              onSubmit={handleUpdateBooth}
              userProfile={auth.userProfile}
              supabase={supabase}
              user={auth.user}
              initialData={userContent.userBooth}
              isEditing={true}
            />
          )}

          {modals.showCartModal && (
            <ShoppingCartModal 
              cart={shoppingHook.shoppingCart}
              onClose={modals.closeCartModal}
              onUpdateQuantity={shoppingHook.updateCartQuantity}
              onRemoveItem={shoppingHook.removeFromCart}
              onCheckout={handleCheckout}
            />
          )}

          {modals.showFullImageModal && modals.selectedImage && (
            <FullImageModal 
              image={modals.selectedImage.image}
              title={modals.selectedImage.title}
              artist={modals.selectedImage.artist}
              onClose={modals.closeFullImageModal}
            />
          )}

          {modals.selectedArtwork && (
            <ArtworkDetailModal
              artwork={modals.selectedArtwork}
              isOwner={true}
              onClose={modals.closeArtworkDetail}
              onEdit={() => {
                modals.openEditArtworkModal();
              }}
              onDelete={() => {
                if (modals.selectedArtwork.id) {
                  handleDeleteArtwork(modals.selectedArtwork.id);
                }
              }}
            />
          )}

          {modals.showFavoritesModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                maxHeight: '80vh',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{
                  padding: '20px 20px 16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontSize: '20px'}}>❤️</span>
                    <h2 style={{fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827'}}>
                      My Favorites ({social.favorites.length})
                    </h2>
                  </div>
                  <button 
                    onClick={modals.closeFavoritesModal}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >×</button>
                </div>
                
                <div style={{
                  padding: '20px',
                  overflowY: 'auto',
                  maxHeight: 'calc(80vh - 100px)'
                }}>
                  {social.favorites.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '32px 16px',
                      color: '#6b7280'
                    }}>
                      <span style={{fontSize: '48px', marginBottom: '12px', display: 'block', opacity: 0.5}}>💔</span>
                      <p style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500'}}>No favorites yet</p>
                      <p style={{margin: '0', fontSize: '14px'}}>Like artists to see them here</p>
                    </div>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      {social.favorites.map((artist) => (
                        <div 
                          key={artist.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#e5e7eb',
                            backgroundImage: artist.image ? `url(${artist.image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                          }}>
                            {!artist.image && '🎨'}
                          </div>
                          <div style={{flex: 1}}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              margin: '0 0 2px 0',
                              color: '#111827'
                            }}>
                              {artist.name}
                            </h4>
                            <p style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              margin: '0'
                            }}>
                              {artist.specialty} • {artist.location}
                            </p>
                          </div>
                          <button
                            onClick={() => social.removeFromFavorites(artist.id)}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {modals.selectedBooth && (
            <BoothDetailsModal 
              booth={modals.selectedBooth}
              onClose={modals.closeBoothDetail}
              userProfile={auth.userProfile}
              onFollowArtist={social.followArtist}
              user={auth.user}
            />
          )}
          {modals.selectedEvent && (
            <EventDetailsModal 
              event={modals.selectedEvent}
              onClose={modals.closeEventDetail}
              userProfile={auth.userProfile}
              onFollowOrganizer={social.followArtist}
              user={auth.user}
            />
          )}

          {/* Bottom Navigation - Always show */}
          <BottomNavigation 
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
        </div>
      </div>
    </div>
  );
}