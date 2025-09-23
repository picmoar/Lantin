import { useState, useEffect } from 'react';
import AuthenticationSection from './AuthenticationSection';
import { supabase } from '../lib/supabase';
import { useDiscoverCard, useArtworkCarousel, useProfileEdit } from './profile_subcom/hooks';
import {
  ProfileHeader,
  ArtworkCarousel,
  DiscoverCardSection,
  ProfileEditModal
} from './profile_subcom';

interface ProfileTabProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
    updateProfile: (updates: any) => void;
  };
  favorites: any[];
  userArtworks: any[];
  setShowFavoritesModal: (show: boolean) => void;
  setShowCreateArtworkModal: (show: boolean) => void;
  setSelectedArtwork: (artwork: any) => void;
  deleteArtwork: (id: any) => void;
  handleLogin: () => void;
  sendEmailCode: (email: string) => Promise<boolean>;
  handleEmailOtpLogin: (email: string, otp: string) => Promise<boolean>;
  handleMobileTestLogin: () => void;
  handleProfileImageUpload: (event: any) => void;
  handleProfileUpdate: () => void;
}

export default function ProfileTab({
  auth,
  favorites,
  userArtworks,
  setShowFavoritesModal,
  setShowCreateArtworkModal,
  setSelectedArtwork,
  deleteArtwork,
  handleLogin,
  sendEmailCode,
  handleEmailOtpLogin,
  handleMobileTestLogin,
  handleProfileImageUpload,
  handleProfileUpdate
}: ProfileTabProps) {

  // Debug when needed
  // console.log('🖼️ ProfileTab received userArtworks:', userArtworks.length, 'artworks');

  // Use extracted hooks
  const { isDiscoverable, isCreatingDiscoverCard, handleToggleDiscoverCard } = useDiscoverCard({ auth });
  const { artworkPage, currentArtworks, goToNextPage, goToPrevPage, goToPage, isFirstPage, isLastPage, hasMultiplePages } = useArtworkCarousel({ userArtworks });
  const { isEditingProfile, forceRender, toggleEdit } = useProfileEdit();

  // Remaining state
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);




  return (
    <>
      {auth.isLoggedIn ? (
        <>
          {/* Profile Header */}
          <ProfileHeader
            auth={auth}
            userArtworks={userArtworks}
            favorites={favorites}
            setShowFavoritesModal={setShowFavoritesModal}
            onEditClick={toggleEdit}
          />

          {/* User Artworks Carousel */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            margin: '0 4px 16px 4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{fontSize: '18px'}}>🎨</span>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827'}}>My Artworks</h3>
              </div>
              {auth.isLoggedIn && (
                <button 
                onClick={() => setShowCreateArtworkModal(true)}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                >
                + Add Artwork
                </button>
              )}
            </div>
            
            {userArtworks.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: '#6b7280'
              }}>
                <span style={{fontSize: '48px', marginBottom: '12px', display: 'block', opacity: 0.5}}>🎭</span>
                <p style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500'}}>No artworks yet</p>
                <p style={{margin: '0', fontSize: '14px'}}>Share your creative works with the world</p>
              </div>
            ) : (
              <ArtworkCarousel
                currentArtworks={currentArtworks}
                hasMultiplePages={hasMultiplePages}
                goToPrevPage={goToPrevPage}
                goToNextPage={goToNextPage}
                isFirstPage={isFirstPage}
                isLastPage={isLastPage}
                isCurrentUserProfile={() => true}
                currentArtist={auth.userProfile}
                deleteArtwork={deleteArtwork}
                handleImageClick={(artwork) => setSelectedArtwork(artwork)}
                userArtworks={userArtworks}
                artworkPage={artworkPage}
                goToPage={goToPage}
              />
            )}
          </div>

          {/* Discover Card Section */}
          <DiscoverCardSection
            isDiscoverable={isDiscoverable}
            isCreatingDiscoverCard={isCreatingDiscoverCard}
            handleToggleDiscoverCard={handleToggleDiscoverCard}
          />

          {/* Profile Editing Modal */}
          {isEditingProfile && (
            <ProfileEditModal
              isEditingProfile={isEditingProfile}
              toggleEdit={toggleEdit}
              auth={auth}
              handleProfileImageUpload={handleProfileImageUpload}
              handleProfileUpdate={handleProfileUpdate}
            />
          )}

          {/* Menu Items */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
            {[
              { icon: '💳', title: 'Payment Methods', subtitle: '2 cards on file' },
              { icon: '📍', title: 'Shipping Address', subtitle: 'Delivery preferences' },
              { icon: '📞', title: 'Help & Support', subtitle: 'Get help when you need it' },
              { icon: '📋', title: 'Terms & Privacy', subtitle: 'Legal information' }
            ].map((item, idx) => (
              <button key={idx} style={{
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #f3f4f6',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '1px'
              }}>
                <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
                }}>
                {item.icon}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: '600', fontSize: '16px', color: '#111827'}}>{item.title}</div>
                  <div style={{fontSize: '14px', color: '#6b7280'}}>{item.subtitle}</div>
                </div>
                <div style={{color: '#9ca3af'}}>
                  <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div style={{marginTop: '24px'}}>
            <button style={{
              width: '100%',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#dc2626',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <AuthenticationSection
          onEmailOtpLogin={handleEmailOtpLogin}
          onMobileTestLogin={handleMobileTestLogin}
          onSendEmailCode={sendEmailCode}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}
