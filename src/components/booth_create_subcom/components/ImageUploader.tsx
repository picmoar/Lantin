import React from 'react';

interface ImageUploaderProps {
  imageUrl?: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageUpload,
  label = "Booth Image"
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
        {label}
      </label>
      <label style={{
        display: 'block',
        border: '2px dashed #d1d5db',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          style={{display: 'none'}}
        />
        {imageUrl ? (
          <div>
            <img
              src={imageUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{fontSize: '16px'}}>🖼️</span>
              <span style={{
                fontSize: '14px',
                color: '#10b981',
                fontWeight: '500'
              }}>
                Image uploaded successfully
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              fontSize: '40px',
              color: '#9ca3af',
              marginBottom: '12px'
            }}>
              📸
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              margin: 0
            }}>
              Click to upload {label.toLowerCase()}
            </p>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;