interface ProfileEditModalProps {
  isEditingProfile: boolean;
  toggleEdit: () => void;
  auth: {
    userProfile: any;
    updateProfile: (updates: any) => void;
  };
  handleProfileImageUpload: (event: any) => void;
  handleProfileUpdate: () => void;
}

export function ProfileEditModal({
  isEditingProfile,
  toggleEdit,
  auth,
  handleProfileImageUpload,
  handleProfileUpdate
}: ProfileEditModalProps) {
  if (!isEditingProfile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1010,
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
                toggleEdit();
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
              onClick={toggleEdit}
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
  );
}