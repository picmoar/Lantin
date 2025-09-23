import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ContactEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  currentLocation: string;
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  onSave?: (email: string, location: string) => void;
}

export default function ContactEditor({
  isOpen,
  onClose,
  currentEmail,
  currentLocation,
  auth,
  onSave
}: ContactEditorProps) {
  const [email, setEmail] = useState(currentEmail);
  const [location, setLocation] = useState(currentLocation);
  const [isSaving, setIsSaving] = useState(false);

  // Update state when props change
  React.useEffect(() => {
    if (isOpen) {
      setEmail(currentEmail);
      setLocation(currentLocation);
    }
  }, [isOpen, currentEmail, currentLocation]);

  const handleSave = async () => {
    if (!supabase || !auth.user) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      // Close modal immediately to prevent popup flash
      onClose();

      console.log('Saving contact info:', { email, location });

      // Update contact information in database
      const { error } = await supabase
        .from('artists')
        .update({
          discover_contact: email,
          discover_location: location
        })
        .eq('id', auth.user.id);

      if (error) throw error;

      if (onSave) {
        await onSave(email, location);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to update contact information: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

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
            Edit Contact Information
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
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
            placeholder="your.email@example.com"
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Studio Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
            placeholder="e.g., Brooklyn, NY or Art District, Los Angeles"
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
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}