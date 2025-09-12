import React, { useState } from 'react';

interface ArtworkPhoto {
  id: string;
  url: string;
  caption?: string;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price?: number;
  medium?: string;
  dimensions?: string;
  year?: string;
  photos: ArtworkPhoto[];
  tags?: string[];
}

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ 
  artwork, 
  onClose, 
  onEdit, 
  onDelete,
  isOwner = false 
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!artwork) return null;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % artwork.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + artwork.photos.length) % artwork.photos.length);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {artwork.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px',
              marginLeft: '12px'
            }}
          >
            ×
          </button>
        </div>

        {/* Photo Carousel */}
        <div style={{
          position: 'relative',
          backgroundColor: '#f3f4f6'
        }}>
          <div style={{
            width: '100%',
            height: '300px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img
              src={artwork.photos[currentPhotoIndex]?.url}
              alt={`${artwork.title} - Photo ${currentPhotoIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Navigation arrows */}
            {artwork.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                >
                  →
                </button>
              </>
            )}

            {/* Photo counter */}
            {artwork.photos.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {currentPhotoIndex + 1} / {artwork.photos.length}
              </div>
            )}
          </div>

          {/* Photo thumbnails */}
          {artwork.photos.length > 1 && (
            <div style={{
              display: 'flex',
              padding: '12px',
              gap: '8px',
              overflowX: 'auto',
              backgroundColor: '#f9fafb'
            }}>
              {artwork.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToPhoto(index)}
                  style={{
                    border: currentPhotoIndex === index ? '2px solid #10b981' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '2px',
                    background: 'none',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '6px'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: '20px',
          overflow: 'auto',
          flex: 1
        }}>
          {/* Artist and Price */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              margin: 0,
              fontWeight: '500'
            }}>
              by {artwork.artist}
            </p>
            {artwork.price && (
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ${artwork.price}
              </div>
            )}
          </div>

          {/* Description */}
          {artwork.description && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                color: '#374151',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                {artwork.description}
              </p>
            </div>
          )}

          {/* Details */}
          {(artwork.medium || artwork.dimensions || artwork.year) && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <h4 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 8px 0'
              }}>
                Details
              </h4>
              {artwork.medium && (
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    <strong>Medium:</strong> {artwork.medium}
                  </span>
                </div>
              )}
              {artwork.dimensions && (
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    <strong>Size:</strong> {artwork.dimensions}
                  </span>
                </div>
              )}
              {artwork.year && (
                <div>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    <strong>Year:</strong> {artwork.year}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {artwork.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Owner Actions */}
        {isOwner && (onEdit || onDelete) && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px'
          }}>
            {onEdit && (
              <button
                onClick={onEdit}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            margin: '20px',
            maxWidth: '300px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              Delete Artwork?
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
              This action cannot be undone. The artwork and all its photos will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetailModal;
