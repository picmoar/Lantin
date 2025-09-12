import React, { useState } from 'react';

interface ArtworkData {
  title: string;
  description: string;
  medium: string;
  year: string;
  dimensions: string;
  images: string[];
}

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  specialty: string;
  profileImage: string;
}

interface AuthUser {
  id?: string;
}

interface CreateArtworkModalProps {
  onClose: () => void;
  onSubmit: (artworkData: any) => void;
  userProfile: UserProfile;
  supabase: any;
  user: AuthUser;
}

const CreateArtworkModal: React.FC<CreateArtworkModalProps> = ({ 
  onClose, 
  onSubmit, 
  userProfile, 
  supabase, 
  user 
}) => {
  const [artworkData, setArtworkData] = useState<ArtworkData>({
    title: '',
    description: '',
    medium: '',
    year: new Date().getFullYear().toString(),
    dimensions: '',
    images: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artworkData.images.length === 0) {
      alert('Please add at least one photo');
      return;
    }
    onSubmit(artworkData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && supabase && user) {
      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          // Create unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          
          // Upload to Supabase storage
          const { data, error } = await supabase.storage
            .from('artworks')
            .upload(fileName, file);

          if (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('artworks')
            .getPublicUrl(fileName);

          return publicUrl;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        setArtworkData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload images');
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setArtworkData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0}}>Add New Artwork</h2>
          <button 
            onClick={onClose} 
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
        
        {/* Subtitle */}
        <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '32px', margin: 0}}>
          Upload photos and add details for your new artwork piece.
        </p>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {/* Photos Section */}
          <div>
            <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>Photos</h3>
            
            {/* Photo Upload Area - Clickable */}
            <label style={{
              display: 'block',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '16px'
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
              {artworkData.images.length === 0 ? (
                <div>
                  <div style={{fontSize: '40px', color: '#9ca3af', marginBottom: '12px'}}>+</div>
                  <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>No photos added yet</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  {artworkData.images.map((image, index) => (
                    <div key={index} style={{position: 'relative'}}>
                      <img 
                        src={image} 
                        alt={`Artwork ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {/* Add more photos indicator */}
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb'
                  }}>
                    <span style={{fontSize: '24px', color: '#9ca3af'}}>+</span>
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Title */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              Title <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              type="text"
              value={artworkData.title}
              onChange={(e) => setArtworkData({...artworkData, title: e.target.value})}
              placeholder="Give your artwork a title"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              Description
            </label>
            <textarea
              value={artworkData.description}
              onChange={(e) => setArtworkData({...artworkData, description: e.target.value})}
              placeholder="Describe your artwork, inspiration, technique..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                backgroundColor: '#f9fafb',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Medium and Year Row */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
                Medium
              </label>
              <input
                type="text"
                value={artworkData.medium}
                onChange={(e) => setArtworkData({...artworkData, medium: e.target.value})}
                placeholder="Oil, Acrylic, Digital..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
                Year
              </label>
              <input
                type="number"
                value={artworkData.year}
                onChange={(e) => setArtworkData({...artworkData, year: e.target.value})}
                min="1900"
                max={new Date().getFullYear() + 1}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              Dimensions (optional)
            </label>
            <input
              type="text"
              value={artworkData.dimensions}
              onChange={(e) => setArtworkData({...artworkData, dimensions: e.target.value})}
              placeholder="16 x 20 inches, 40 x 50 cm..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: '#1f2937',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Save Artwork
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArtworkModal;
