import React, { useState } from 'react';

interface BiographyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentBio: string;
  onSave?: (newBio: string) => void;
}

export default function BiographyEditor({
  isOpen,
  onClose,
  currentBio,
  onSave
}: BiographyEditorProps) {
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update bio state when modal opens with current bio, but allow full customization
  React.useEffect(() => {
    if (isOpen) {
      setBio(currentBio || '');
    }
  }, [isOpen, currentBio]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!onSave) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await onSave(bio);
      onClose();
    } catch (error) {
      console.error('Error saving biography:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0,
            color: '#111827'
          }}>
            Edit Biography
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Biography
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Write your complete biography here. You have full control - tell your story, describe your artistic journey, inspirations, techniques, exhibitions, or anything else you'd like visitors to know about you and your work..."
            disabled={isLoading}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}