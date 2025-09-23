import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface BoothEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSave?: (selectedBoothId: string) => void;
  auth: any;
}

export default function BoothEditor({
  isOpen,
  onClose,
  currentLocation,
  onSave,
  auth
}: BoothEditorProps) {
  const [userBooths, setUserBooths] = useState<any[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user booths when modal opens
  const fetchUserBooths = async () => {
    if (!supabase || !auth.user) {
      console.log('🏨 BoothEditor: fetchUserBooths - No supabase or auth.user');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🏨 BoothEditor: Fetching booths for user:', auth.user.id);

      const { data: booths, error } = await supabase
        .from('booths')
        .select('*')
        .eq('artist_id', auth.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🏨 BoothEditor: Error fetching booths:', error);
        throw error;
      }

      console.log('🏨 BoothEditor: Fetched booths:', booths);
      setUserBooths(booths || []);
    } catch (error) {
      console.error('🏨 BoothEditor: Error fetching user booths:', error);
      setUserBooths([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUserBooths([]);
      setSelectedBooth('');
      setIsLoading(false);
      if (auth.user) {
        fetchUserBooths();
      }
    } else {
      setUserBooths([]);
      setSelectedBooth('');
      setIsLoading(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!selectedBooth) {
      alert('Please select a booth to feature');
      return;
    }

    try {
      setIsSaving(true);
      console.log('🏨 BoothEditor: Saving selected booth:', selectedBooth);

      // Find the selected booth details for logging
      const selectedBoothData = userBooths.find(booth => booth.id === selectedBooth);
      console.log('🏨 BoothEditor: Selected booth data:', selectedBoothData);

      // Save the selected booth for the discover page
      if (onSave) {
        console.log('🏨 BoothEditor: Calling onSave with booth ID:', selectedBooth);
        await onSave(selectedBooth);
        console.log('🏨 BoothEditor: onSave completed successfully');
      }
      onClose();
    } catch (error) {
      console.error('🏨 BoothEditor: Error saving booth selection:', error);
      alert('Failed to save booth selection: ' + (error as Error).message);
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
        maxWidth: '600px',
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
            Select Booth to Feature
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

        <div style={{marginBottom: '20px'}}>
          {isLoading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  style={{
                    aspectRatio: '3/2',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '12px'
                  }}
                >
                  Loading...
                </div>
              ))}
            </div>
          ) : userBooths.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {userBooths.map((booth) => (
                <div
                  key={booth.id}
                  onClick={() => {
                    console.log('🏨 BoothEditor: Selecting booth:', booth.id, booth.name);
                    setSelectedBooth(booth.id);
                  }}
                  style={{
                    border: selectedBooth === booth.id ? '3px solid #7c3aed' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <img
                    src={booth.image || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop'}
                    alt={booth.name}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{padding: '8px'}}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                      color: '#111827',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {booth.name}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      📍 {booth.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: '#6b7280'
            }}>
              <div style={{marginBottom: '12px'}}>
                <img
                  src="/shop.png"
                  alt="Booth"
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <p style={{fontSize: '16px', margin: '0 0 8px 0'}}>No booths found</p>
              <p style={{fontSize: '14px', margin: 0}}>Create booths in the Booths tab to feature them here</p>
            </div>
          )}
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
            disabled={!selectedBooth || isSaving}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: selectedBooth ? '#7c3aed' : '#d1d5db',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: selectedBooth ? 'pointer' : 'not-allowed',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Feature Booth'}
          </button>
        </div>
      </div>
    </div>
  );
}