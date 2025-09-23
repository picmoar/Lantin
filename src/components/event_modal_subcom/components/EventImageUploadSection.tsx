import React from 'react';

interface EventImageUploadSectionProps {
  image: string;
  fileName?: string;
  onImageUpload: (file: File) => void;
  styles: {
    label: React.CSSProperties;
  };
}

export default function EventImageUploadSection({
  image,
  fileName,
  onImageUpload,
  styles
}: EventImageUploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div>
      <label style={styles.label}>
        📸 Event Image
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
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="event-image-upload"
        />
        <label
          htmlFor="event-image-upload"
          style={{
            cursor: 'pointer',
            display: 'block'
          }}
        >
          {image ? (
            <div>
              <img
                src={image}
                alt="Event preview"
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {fileName ? `📎 ${fileName}` : 'Image uploaded'}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                Click to change image
              </p>
            </div>
          ) : (
            <div>
              <div style={{
                fontSize: '48px',
                marginBottom: '12px',
                opacity: 0.5
              }}>
                📸
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 4px 0'
              }}>
                Upload Event Image
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Click to select an image for your event
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}