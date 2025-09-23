import React from 'react';

interface EventHighlightsSectionProps {
  highlightPhotos: string[];
  onHighlightsUpload: (files: FileList) => void;
  onRemoveHighlight: (index: number) => void;
  styles: {
    label: React.CSSProperties;
  };
}

export default function EventHighlightsSection({
  highlightPhotos,
  onHighlightsUpload,
  onRemoveHighlight,
  styles
}: EventHighlightsSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onHighlightsUpload(files);
    }
  };

  return (
    <div>
      <label style={styles.label}>
        🎨 Highlight Photos (Optional)
      </label>

      <div style={{
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center' as const,
        backgroundColor: '#f9fafb',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="highlight-photos-upload"
        />
        <label
          htmlFor="highlight-photos-upload"
          style={{
            cursor: 'pointer',
            display: 'block'
          }}
        >
          <div>
            <div style={{
              fontSize: '48px',
              marginBottom: '12px',
              opacity: 0.5
            }}>
              🎨
            </div>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 4px 0'
            }}>
              Upload Highlight Photos
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Click to select multiple images showcasing your event
            </p>
          </div>
        </label>
      </div>

      {/* Display uploaded highlights */}
      {highlightPhotos.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            Uploaded Highlights ({highlightPhotos.length})
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '8px'
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
                  onClick={() => onRemoveHighlight(index)}
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
        </div>
      )}
    </div>
  );
}