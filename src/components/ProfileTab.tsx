import { useState } from 'react';
import AuthenticationSection from './AuthenticationSection';

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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [artworkPage, setArtworkPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  
  const toggleEdit = () => {
    console.log('toggleEdit called, current state:', isEditingProfile);
    setIsEditingProfile(!isEditingProfile);
    setForceRender(prev => prev + 1);
    console.log('toggleEdit setting to:', !isEditingProfile);
  };



  return (
    <>
      {auth.isLoggedIn ? (
        <>
          {/* Profile Header - Compact */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '12px',
            margin: '0 4px 12px 4px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Profile Info - Compact */}
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginRight: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                flexShrink: 0
              }}>
                <img 
                src={auth.userProfile.profileImage} 
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                />
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px'}}>
                  <h2 style={{fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827'}}>{auth.userProfile.name}</h2>
                  <button 
                  onClick={toggleEdit}
                  style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <svg style={{width: '14px', height: '14px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                  </button>
                </div>
                <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '2px'}}>{auth.userProfile.specialty}</p>
                <p style={{color: '#9ca3af', fontSize: '12px', marginBottom: '4px'}}>{auth.userProfile.location}</p>
                {auth.userProfile.bio && (
                  <p style={{
                  color: '#4b5563', 
                  fontSize: '13px', 
                  marginBottom: '0',
                  lineHeight: '1.4',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {auth.userProfile.bio}
                  </p>
                )}
              </div>
            </div>
            
            {/* Stats Grid - Smaller */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#fafafb',
                borderRadius: '8px',
                padding: '10px'
              }}>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{userArtworks.length}</div>
                <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>Art</div>
              </div>
              <div style={{
                backgroundColor: '#fafafb',
                borderRadius: '8px',
                padding: '10px'
              }}>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>0</div>
                <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>Follower</div>
              </div>
              <div 
                onClick={() => setShowFavoritesModal(true)}
                style={{
                backgroundColor: '#fafafb',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafb';
                e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{favorites.length}</div>
                <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>Following</div>
              </div>
              <div style={{
                backgroundColor: '#fafafb',
                borderRadius: '8px',
                padding: '10px'
              }}>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '2px'}}>{userArtworks.filter(art => art.price && art.price > 0).length}</div>
                <div style={{color: '#6b7280', fontSize: '11px', fontWeight: '500'}}>On Sale</div>
              </div>
            </div>
          </div>

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
              <div style={{position: 'relative'}}>
                <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '12px',
                padding: '4px',
                overflow: 'hidden'
                }}>
                {userArtworks.slice(artworkPage * 4, (artworkPage * 4) + 4).map((artwork, idx) => (
                  <div
                  key={artwork.id}
                  onClick={(e) => {
                    if (!e.target.closest('.delete-button')) {
                setSelectedArtwork(artwork);
                    }
                  }}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Album Preview with Multiple Photos */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {artwork.photos && artwork.photos.length > 0 ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {/* Main photo */}
                  <img 
                    src={artwork.photos[0].url} 
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Album indicator for multiple photos */}
                  {artwork.photos.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📸 {artwork.photos.length}
                    </div>
                  )}
                  
                  {/* Price tag */}
                  {artwork.price && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.9)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ${artwork.price}
                    </div>
                  )}
                  </div>
                    ) : (
                  <span style={{fontSize: '24px'}}>🖼️</span>
                    )}
                    
                    {/* Delete button */}
                    <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${artwork.title}"?`)) {
                    deleteArtwork(artwork.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  opacity: '0.8'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 1)';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                    >
                ×
                    </button>
                  </div>
                  
                  {/* Artwork Info */}
                  <div style={{padding: '12px'}}>
                    <h4 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: '#111827',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
                    }}>
                {artwork.title}
                    </h4>
                    <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '0 0 6px 0',
                lineHeight: '1.3'
                    }}>
                {artwork.medium} {artwork.year && `• ${artwork.year}`}
                    </p>
                    {artwork.tags && artwork.tags.length > 0 && (
                  <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginTop: '6px'
                }}>
                  {artwork.tags.slice(0, 2).map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                  </div>
                    )}
                  </div>
                  </div>
                ))}
                </div>
                
                {/* Navigation arrows for 2x2 carousel */}
                {userArtworks.length > 4 && (
                  <>
                  <button
                    onClick={() => setArtworkPage(Math.max(0, artworkPage - 1))}
                    disabled={artworkPage === 0}
                    style={{
                position: 'absolute',
                left: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: artworkPage === 0 ? '#f3f4f6' : 'white',
                color: artworkPage === 0 ? '#9ca3af' : '#374151',
                border: '1px solid #e5e7eb',
                cursor: artworkPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10
                    }}
                  >
                    ‹
                  </button>
                  
                  <button
                    onClick={() => setArtworkPage(Math.min(Math.ceil(userArtworks.length / 4) - 1, artworkPage + 1))}
                    disabled={artworkPage >= Math.ceil(userArtworks.length / 4) - 1}
                    style={{
                position: 'absolute',
                right: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: artworkPage >= Math.ceil(userArtworks.length / 4) - 1 ? '#f3f4f6' : 'white',
                color: artworkPage >= Math.ceil(userArtworks.length / 4) - 1 ? '#9ca3af' : '#374151',
                border: '1px solid #e5e7eb',
                cursor: artworkPage >= Math.ceil(userArtworks.length / 4) - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10
                    }}
                  >
                    ›
                  </button>
                  </>
                )}
                
                {/* Page indicator */}
                {userArtworks.length > 4 && (
                  <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {Array.from({length: Math.ceil(userArtworks.length / 4)}).map((_, pageIdx) => (
                    <div
                key={pageIdx}
                onClick={() => setArtworkPage(pageIdx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: pageIdx === artworkPage ? '#8b5cf6' : '#e5e7eb',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                    />
                  ))}
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Profile Editing Modal */}
          {isEditingProfile && (
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                toggleEdit();
                }
              }}
            >
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}>
                {/* Modal Header */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#10b981',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                    padding: '4px'
                  }}>
                    <svg style={{width: '20px', height: '20px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0}}>
                    Edit Profile
                  </h3>
                  </div>
                  <button 
                  onClick={toggleEdit}
                  style={{
                    background: 'none', 
                    border: 'none', 
                    fontSize: '20px', 
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                >
                  ×
                  </button>
                </div>
                
                <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '32px', margin: '0 0 32px 0'}}>
                Update your profile information and preferences
                </p>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {/* Profile Picture Upload */}
                <div>
                  <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Profile Picture</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb'
                  }}>
                    <img 
                src={auth.userProfile.profileImage || '/api/placeholder/60/60'}
                alt="Profile preview"
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    style={{display: 'none'}}
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
                    }}
                  >
                    Change Photo
                  </label>
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Display Name</label>
                  <input
                  type="text"
                  value={auth.userProfile.name}
                  onChange={(e) => auth.updateProfile({ name: e.target.value})}
                  placeholder="Enter your display name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb'
                  }}
                />
                </div>

                {/* Bio Field */}
                <div>
                  <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Bio</label>
                  <textarea
                  value={auth.userProfile.bio}
                  onChange={(e) => auth.updateProfile({ bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                </div>

                {/* Location Field */}
                <div>
                  <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Location</label>
                  <input
                  type="text"
                  value={auth.userProfile.location}
                  onChange={(e) => auth.updateProfile({ location: e.target.value})}
                  placeholder="City, State/Country"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb'
                  }}
                />
                </div>

                {/* Specialty Field */}
                <div>
                  <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Specialty/Interest</label>
                  <input
                  type="text"
                  value={auth.userProfile.specialty}
                  onChange={(e) => auth.updateProfile({ specialty: e.target.value})}
                  placeholder="Art collector, Artist, etc."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#f9fafb'
                  }}
                />
                </div>

                {/* Action Buttons */}
                <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                  <button
                  onClick={async () => {
                    console.log('🔥 Save Changes button clicked!');
                    await handleProfileUpdate();
                    setIsEditingProfile(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                  </button>
                  <button
                  onClick={() => setIsEditingProfile(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                  </button>
                </div>
              </div>
            </div>
            </div>
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
