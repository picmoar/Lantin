import React from 'react';

interface HighlightPhotosProps {
  highlightPhotos?: string[];
  onHighlightPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveHighlightPhoto: (index: number) => void;
}

const HighlightPhotos: React.FC<HighlightPhotosProps> = ({
  highlightPhotos,
  onHighlightPhotosUpload,
  onRemoveHighlightPhoto
}) => {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '8px'
      }}>
        ✨ Booth Highlights (up to 4 photos)
      </label>
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '12px',
        margin: '0 0 12px 0'
      }}>
        Showcase your booth's best features, artwork, or atmosphere
      </p>

      <label style={{
        display: 'block',
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: highlightPhotos && highlightPhotos.length > 0 ? '16px' : '0'
      }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onHighlightPhotosUpload}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '32px', color: '#9ca3af', marginBottom: '8px' }}>✨</div>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
          Click to upload highlight photos (max 4)
        </p>
      </label>

      {/* Display uploaded highlight photos */}
      {highlightPhotos && highlightPhotos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          {highlightPhotos.map((photo, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={photo}
                alt={`Highlight ${index + 1}`}
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveHighlightPhoto(index)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
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
        </div>
      )}
    </div>
  );
};

export default HighlightPhotos;