import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getValidImageUrl } from '../../utils/imageUtils';

interface Artwork {
  id: string;
  title: string;
  image: string;
  artwork_discover: boolean;
  price: number;
}

interface SaleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  onSave?: (selectedArtworkIds: string[]) => void;
}

export default function SaleEditor({
  isOpen,
  onClose,
  auth,
  onSave
}: SaleEditorProps) {
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state and fetch artworks when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset state every time modal opens to prevent stale data
      setUserArtworks([]);
      setSelectedArtworks([]);
      setIsLoading(false);

      // Only fetch if user is authenticated
      if (auth.user) {
        fetchUserArtworks();
      }
    } else {
      // Clean up state when modal closes
      setUserArtworks([]);
      setSelectedArtworks([]);
      setIsLoading(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  const fetchUserArtworks = async () => {
    if (!supabase || !auth.user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching priced artworks for user:', auth.user.id);

      // First try with artwork_discover and price columns - only show artworks with prices
      let { data, error } = await supabase
        .from('artworks')
        .select('id, title, image, artwork_discover, price')
        .eq('artist_id', auth.user.id)
        .not('price', 'is', null)
        .gt('price', 0)
        .order('created_at', { ascending: false });

      // If error (likely column doesn't exist), try without artwork_discover but keep price filter
      if (error && (error.message.includes('artwork_discover') || error.message.includes('price'))) {
        console.log('artwork_discover or price column not found, trying fallback');
        const fallbackQuery = await supabase
          .from('artworks')
          .select('id, title, image, price')
          .eq('artist_id', auth.user.id)
          .not('price', 'is', null)
          .gt('price', 0)
          .order('created_at', { ascending: false });

        data = fallbackQuery.data?.map(art => ({ ...art, artwork_discover: false })) || [];
        error = fallbackQuery.error;

        // If still error with price, try basic query and filter client-side
        if (error && error.message.includes('price')) {
          console.log('price column not found, using basic query');
          const basicQuery = await supabase
            .from('artworks')
            .select('id, title, image')
            .eq('artist_id', auth.user.id)
            .order('created_at', { ascending: false });

          data = basicQuery.data?.map(art => ({ ...art, artwork_discover: false, price: 0 })) || [];
          error = basicQuery.error;
        }
      }

      if (error) throw error;

      console.log('Fetched priced artworks:', data);
      setUserArtworks(data || []);
      // Set currently selected artworks (those marked as featured for sale)
      setSelectedArtworks(
        data?.filter(art => art.artwork_discover).map(art => art.id) || []
      );
    } catch (error) {
      console.error('Error fetching artworks:', error);
      alert('Failed to load your priced artworks: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArtworkSelection = (artworkId: string) => {
    setSelectedArtworks(prev => {
      if (prev.includes(artworkId)) {
        // Unselect artwork
        return prev.filter(id => id !== artworkId);
      } else {
        // Select artwork (no limit for sale items)
        return [...prev, artworkId];
      }
    });
  };

  const handleSave = async () => {
    if (!supabase || !auth.user || !onSave) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      // Close modal immediately to prevent any popup flash
      onClose();

      // Check if artwork_discover column exists by trying to update
      try {
        // First, unmark all artworks as featured
        await supabase
          .from('artworks')
          .update({ artwork_discover: false })
          .eq('artist_id', auth.user.id);

        // Then mark selected artworks as featured for sale
        if (selectedArtworks.length > 0) {
          await supabase
            .from('artworks')
            .update({ artwork_discover: true })
            .in('id', selectedArtworks);
        }
      } catch (updateError: any) {
        if (updateError.message.includes('artwork_discover')) {
          alert('Database schema needs to be updated. Please add the artwork_discover column first. Check the console for the SQL command.');
          console.log('Run this SQL in your Supabase console:');
          console.log('ALTER TABLE artworks ADD COLUMN artwork_discover BOOLEAN DEFAULT false;');
          return;
        }
        throw updateError;
      }

      await onSave(selectedArtworks);
    } catch (error) {
      console.error('Error saving featured artworks for sale:', error);
      alert('Failed to update sale items: ' + (error as Error).message);
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
            Select Artworks for Sale
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

        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '16px'
        }}>
          Choose priced artworks from your collection to feature in the "Available for Purchase" section. Only artworks with prices can be selected for sale.
        </p>

        {/* Artwork grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {userArtworks.length === 0 ? (
            // Empty state
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <p>No priced artworks found. Add prices to your artworks first to make them available for sale.</p>
            </div>
          ) : (
            // Real artwork items
            userArtworks.map((artwork) => (
              <div
                key={artwork.id}
                onClick={() => toggleArtworkSelection(artwork.id)}
                style={{
                  border: selectedArtworks.includes(artwork.id) ? '3px solid #10b981' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <img
                  src={getValidImageUrl(artwork)}
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback for broken images
                    console.warn('Failed to load artwork image:', artwork.title, artwork.image);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop';
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
                    {artwork.title}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#059669',
                    margin: 0
                  }}>
                    ${artwork.price}
                  </p>
                  {/* Selected indicator */}
                  {selectedArtworks.includes(artwork.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))
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
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: isSaving ? '#9ca3af' : '#10b981',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Update Sale Items'}
          </button>
        </div>
      </div>
    </div>
  );
}