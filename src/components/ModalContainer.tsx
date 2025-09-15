import React from 'react';
import CreateEventModal from './CreateEventModal';
import CreateArtworkModal from './CreateArtworkModal';
import CreateBoothModal from './CreateBoothModal';
import ShoppingCartModal from './ShoppingCartModal';
import FullImageModal from './FullImageModal';
import ArtworkDetailModal from './ArtworkDetailModal';

interface ModalState {
  showCreateEventModal: boolean;
  showCreateArtworkModal: boolean;
  showCreateBoothModal: boolean;
  showEditBoothModal: boolean;
  showCartModal: boolean;
  showFullImageModal: boolean;
  showFavoritesModal: boolean;
}

interface ModalHandlers {
  setShowCreateEventModal: (show: boolean) => void;
  setShowCreateArtworkModal: (show: boolean) => void;
  setShowCreateBoothModal: (show: boolean) => void;
  setShowEditBoothModal: (show: boolean) => void;
  setShowCartModal: (show: boolean) => void;
  setShowFullImageModal: (show: boolean) => void;
  setSelectedImage: (image: any) => void;
  setShowFavoritesModal: (show: boolean) => void;
  setSelectedArtwork: (artwork: any) => void;
}

interface ModalContainerProps {
  modalState: ModalState;
  modalHandlers: ModalHandlers;
  selectedImage: any;
  selectedArtwork: any;
  userBooth: any;
  shoppingCart: any[];
  favorites: any[];
  auth: {
    userProfile: any;
  };
  user: any;
  supabase: any;
  createEvent: (eventData: any) => void;
  createArtwork: (artworkData: any) => void;
  createBooth: (boothData: any) => void;
  updateBooth: (boothData: any) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
  deleteArtwork: (id: string) => void;
  removeFromFavorites: (artistId: number) => void;
}

export default function ModalContainer({ 
  modalState, 
  modalHandlers, 
  selectedImage,
  selectedArtwork,
  userBooth,
  shoppingCart,
  favorites,
  auth,
  user,
  supabase,
  createEvent,
  createArtwork,
  createBooth,
  updateBooth,
  updateCartQuantity,
  removeFromCart,
  checkout,
  deleteArtwork,
  removeFromFavorites
}: ModalContainerProps) {
  return (
    <>
      {/* Create Event Modal */}
      {modalState.showCreateEventModal && (
        <CreateEventModal
          onClose={() => modalHandlers.setShowCreateEventModal(false)}
          onSubmit={createEvent}
          userProfile={auth.userProfile}
          supabase={supabase}
          user={user}
        />
      )}

      {/* Create Artwork Modal */}
      {modalState.showCreateArtworkModal && (
        <CreateArtworkModal 
          onClose={() => modalHandlers.setShowCreateArtworkModal(false)}
          onSubmit={createArtwork}
          userProfile={auth.userProfile}
          supabase={supabase}
          user={user}
        />
      )}

      {/* Create Booth Modal */}
      {modalState.showCreateBoothModal && (
        <CreateBoothModal
          onClose={() => modalHandlers.setShowCreateBoothModal(false)}
          onSubmit={createBooth}
          userProfile={auth.userProfile}
          supabase={supabase}
          user={user}
        />
      )}

      {/* Edit Booth Modal */}
      {modalState.showEditBoothModal && userBooth && (
        <CreateBoothModal
          onClose={() => modalHandlers.setShowEditBoothModal(false)}
          onSubmit={updateBooth}
          userProfile={auth.userProfile}
          supabase={supabase}
          user={user}
          initialData={userBooth}
          isEditing={true}
        />
      )}

      {/* Shopping Cart Modal */}
      {modalState.showCartModal && (
        <ShoppingCartModal 
          cart={shoppingCart}
          onClose={() => modalHandlers.setShowCartModal(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={checkout}
        />
      )}

      {/* Full Image Modal */}
      {modalState.showFullImageModal && selectedImage && (
        <FullImageModal 
          image={selectedImage.image}
          title={selectedImage.title}
          artist={selectedImage.artist}
          onClose={() => {
            modalHandlers.setShowFullImageModal(false);
            modalHandlers.setSelectedImage(null);
          }}
        />
      )}

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <ArtworkDetailModal 
          artwork={selectedArtwork}
          isOwner={true}
          onClose={() => modalHandlers.setSelectedArtwork(null)}
          onDelete={() => {
            if (selectedArtwork.id) {
              deleteArtwork(selectedArtwork.id);
              modalHandlers.setSelectedArtwork(null);
            }
          }}
        />
      )}

      {/* Favorites Modal */}
      {modalState.showFavoritesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: '#111827'
              }}>
                Favorite Artists
              </h2>
              <button
                onClick={() => modalHandlers.setShowFavoritesModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            {favorites.length === 0 ? (
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
                {favorites.map((artist, idx) => (
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
                        {artist.specialty}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromFavorites(artist.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '4px'
                      }}
                    >
                      💔
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
