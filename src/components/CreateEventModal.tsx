import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '../lib/supabase';

interface EventData {
  title: string;
  description: string;
  location: string;
  image: string;
  organizer_name: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  type: 'workshop' | 'exhibition' | 'gallery' | 'sale';
  price: number;
  max_attendees?: number;
  highlight_photos?: string[];
  latitude: number | null;
  longitude: number | null;
  formatted_address: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
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

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (eventData: EventData) => void;
  userProfile: UserProfile;
  supabase: any;
  user: AuthUser;
  initialData?: Partial<EventData>;
  isEditing?: boolean;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onSubmit,
  userProfile,
  supabase,
  user,
  initialData,
  isEditing = false
}) => {
  // Consolidated styles to reduce redundancy
  const styles = {
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#f9fafb'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    subLabel: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '4px'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      backgroundColor: '#f9fafb',
      resize: 'vertical' as const
    }
  };

  const [eventData, setEventData] = useState<EventData>({
    title: '',
    description: '',
    location: '',
    image: '',
    organizer_name: userProfile?.name || '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    type: 'workshop',
    price: 0,
    max_attendees: undefined,
    highlight_photos: [],
    latitude: null,
    longitude: null,
    formatted_address: '',
    ...initialData
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const googleApiRef = useRef<any>(null);

  // Initialize Google Places services
  useEffect(() => {
    const initializePlaces = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        return;
      }

      try {
        let google;

        // Check if Google Maps API is already loaded to avoid "Loader must not be called again" error
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('📍 Using existing Google Maps API instance');
          google = window.google;
        } else {
          console.log('📍 Loading Google Maps API for Places...');
          const loader = new Loader({
            apiKey: apiKey,
            version: 'weekly',
            libraries: ['places', 'geometry']
          });
          google = await loader.load();
        }

        googleApiRef.current = google;
        
        const autocomplete = new google.maps.places.AutocompleteService();
        const places = new google.maps.places.PlacesService(document.createElement('div'));
        
        setAutocompleteService(autocomplete);
        setPlacesService(places);
      } catch (error) {
        console.error('Error loading Google Places:', error);
      }
    };

    initializePlaces();
  }, []);

  const handleLocationSearch = (query: string) => {
    if (!autocompleteService || !query.trim()) {
      setPredictions([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      {
        input: query,
        types: ['establishment', 'geocode']
      },
      (predictions: any[], status: string) => {
        if (status === 'OK' && predictions) {
          setPredictions(predictions.slice(0, 5));
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const handleLocationSelect = (placeId: string, description: string) => {
    if (!placesService) return;

    placesService.getDetails(
      {
        placeId: placeId,
        fields: ['geometry', 'formatted_address', 'name']
      },
      (place: any, status: string) => {
        if (status === 'OK' && place) {
          setEventData({
            ...eventData,
            location: place.name || description,
            formatted_address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          });
          setPredictions([]);
          setShowLocationPicker(false);
        }
      }
    );
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEventData({...eventData, location: value});
    handleLocationSearch(value);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          try {
            if (!googleApiRef.current) return;
            const geocoder = new googleApiRef.current.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results: any[], status: string) => {
                if (status === 'OK' && results[0]) {
                  setEventData({
                    ...eventData,
                    location: 'Current Location',
                    formatted_address: results[0].formatted_address,
                    latitude: latitude,
                    longitude: longitude
                  });
                  setShowLocationPicker(false);
                }
              }
            );
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setEventData({
              ...eventData,
              location: 'Current Location',
              formatted_address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              latitude: latitude,
              longitude: longitude
            });
            setShowLocationPicker(false);
          }
        },
        (error) => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(eventData);
  };

  // Consolidated upload function to reduce code duplication
  const uploadToSupabase = async (file: File, pathPrefix = '', storageType = 'single') => {
    try {
      // Check if we have Supabase and should attempt cloud upload
      if (supabase && user?.id) {
        // Verify we have a valid session first
        const { data: { session } } = await supabase.auth.getSession();

        if (session && session.user) {
          console.log(`📤 Attempting Supabase events storage upload${storageType === 'highlight' ? ' for highlights' : ''}...`);

          const fileExt = file.name.split('.').pop();
          const fileName = `${session.user.id}/${pathPrefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('events')
            .upload(fileName, file);

          if (error) {
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('events')
            .getPublicUrl(fileName);

          console.log(`✅ Uploaded ${storageType} image to Supabase storage`);
          return publicUrl;
        }
      }

      // Fallback to local URLs
      console.log(`📱 Using local file URL${storageType === 'highlight' ? 's for highlights' : ''} (demo mode or no valid session)`);
      return URL.createObjectURL(file);

    } catch (error) {
      console.error('Upload error:', error);
      console.log('🔄 Cloud upload failed, falling back to local URL...');
      return URL.createObjectURL(file);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToSupabase(file, '', 'single');
      setEventData({
        ...eventData,
        image: imageUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleHighlightPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).slice(0, 4).map(async (file, i) => {
        return await uploadToSupabase(file, `highlights/${i}-`, 'highlight');
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setEventData(prev => ({
        ...prev,
        highlight_photos: [...(prev.highlight_photos || []), ...uploadedUrls]
      }));

      console.log(`📱 Created ${uploadedUrls.length} highlight image URLs`);
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    }
  };

  const removeHighlightPhoto = (index: number) => {
    const newPhotos = [...(eventData.highlight_photos || [])];
    newPhotos.splice(index, 1);
    setEventData({
      ...eventData,
      highlight_photos: newPhotos
    });
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
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#8b5cf6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
              padding: '4px'
            }}>
              <img 
                src="/event.png" 
                alt="Event" 
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0}}>
              {isEditing ? 'Edit Event' : 'Create Event'}
            </h2>
          </div>
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
        
        <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '32px', margin: '0 0 32px 0'}}>
          {isEditing ? 'Update your event information' : 'Organize an art event to engage with your community'}
        </p>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {/* Basic Information */}
          <div>
            <label style={styles.label}>
              Event Title <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              placeholder="Amazing Art Workshop"
              required
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>
              👤 Event Organizer <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              type="text"
              value={eventData.organizer_name}
              onChange={(e) => setEventData({...eventData, organizer_name: e.target.value})}
              placeholder="Your name or organization"
              required
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>
              Description
            </label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              placeholder="Describe your event and what participants can expect..."
              rows={3}
              style={styles.textarea}
            />
          </div>

          {/* Location */}
          <div style={{position: 'relative'}}>
            <label style={styles.label}>
              📍 Location <span style={{color: '#ef4444'}}>*</span>
            </label>
            <div style={{position: 'relative'}}>
              <input
                ref={locationInputRef}
                type="text"
                value={eventData.location}
                onChange={handleLocationInputChange}
                placeholder="Search for location..."
                required
                onFocus={() => setShowLocationPicker(true)}
                style={{
                  width: '100%',
                  padding: '12px 48px 12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb'
                }}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                title="Use my current location"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                📍
              </button>
              
              {/* Location Predictions Dropdown */}
              {showLocationPicker && predictions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 1001,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {predictions.map((prediction: any) => (
                    <div
                      key={prediction.place_id}
                      onClick={() => handleLocationSelect(prediction.place_id, prediction.description)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{fontWeight: '500', color: '#1f2937', marginBottom: '2px'}}>
                        {prediction.structured_formatting.main_text}
                      </div>
                      <div style={{fontSize: '12px', color: '#6b7280'}}>
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Show selected location details */}
            {eventData.formatted_address && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px'
              }}>
                <div style={{display: 'flex', alignItems: 'start', gap: '8px'}}>
                  <span style={{fontSize: '16px'}}>📍</span>
                  <p style={{fontSize: '12px', color: '#166534', margin: 0}}>
                    {eventData.formatted_address}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Event Schedule */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px'}}>
              📅 Event Schedule
            </label>
            
            {/* Date Range */}
            <div style={{marginBottom: '16px'}}>
              <label style={{...styles.label, fontSize: '13px', color: '#374151'}}>
                Event Dates
              </label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={styles.subLabel}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={eventData.start_date}
                    onChange={(e) => setEventData({...eventData, start_date: e.target.value})}
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
                  <label style={styles.subLabel}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={eventData.end_date}
                    onChange={(e) => setEventData({...eventData, end_date: e.target.value})}
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
            </div>

            {/* Daily Hours */}
            <div>
              <label style={{...styles.label, fontSize: '13px', color: '#374151'}}>
                Daily Event Hours
              </label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={styles.subLabel}>
                    Starts At
                  </label>
                  <input
                    type="time"
                    value={eventData.start_time}
                    onChange={(e) => setEventData({...eventData, start_time: e.target.value})}
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
                  <label style={styles.subLabel}>
                    Ends At
                  </label>
                  <input
                    type="time"
                    value={eventData.end_time}
                    onChange={(e) => setEventData({...eventData, end_time: e.target.value})}
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
            </div>
          </div>

          {/* Event Type and Details */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div>
              <label style={styles.label}>
                Event Type
              </label>
              <select 
                value={eventData.type} 
                onChange={(e) => setEventData({...eventData, type: e.target.value as EventData['type']})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb'
                }}
              >
                <option value="workshop">🎨 Workshop</option>
                <option value="exhibition">🖼️ Exhibition</option>
                <option value="gallery">🏛️ Gallery Opening</option>
                <option value="sale">💰 Art Sale</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>
                👥 Max Attendees
              </label>
              <input
                type="number"
                value={eventData.max_attendees || ''}
                onChange={(e) => setEventData({...eventData, max_attendees: parseInt(e.target.value) || undefined})}
                min="1"
                placeholder="Optional"
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

          {/* Price */}
          <div>
            <label style={styles.label}>
              💰 Event Price
            </label>
            <input
              type="number"
              value={eventData.price}
              onChange={(e) => setEventData({...eventData, price: parseInt(e.target.value) || 0})}
              min="0"
              placeholder="0"
              style={styles.input}
            />
            <p style={{fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0'}}>Enter 0 for free events</p>
          </div>

          {/* Event Image */}
          <div>
            <label style={styles.label}>
              Event Image
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
                onChange={handleImageUpload}
                style={{display: 'none'}}
              />
              {eventData.image ? (
                <div>
                  <img 
                    src={eventData.image} 
                    alt="Event preview" 
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}
                  />
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                    <span style={{fontSize: '16px'}}>🖼️</span>
                    <span style={{fontSize: '14px', color: '#10b981', fontWeight: '500'}}>Image uploaded successfully</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{fontSize: '40px', color: '#9ca3af', marginBottom: '12px'}}>📸</div>
                  <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>Click to upload event image</p>
                </div>
              )}
            </label>
          </div>

          {/* Highlight Photos Upload */}
          <div>
            <label style={styles.label}>
              ✨ Event Highlights (up to 4 photos)
            </label>
            <p style={{fontSize: '12px', color: '#6b7280', marginBottom: '12px', margin: '0 0 12px 0'}}>
              Showcase your event's venue, previous sessions, or key moments
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
              marginBottom: eventData.highlight_photos && eventData.highlight_photos.length > 0 ? '16px' : '0'
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleHighlightPhotosUpload}
                style={{display: 'none'}}
              />
              <div style={{fontSize: '32px', color: '#9ca3af', marginBottom: '8px'}}>✨</div>
              <p style={{color: '#6b7280', fontSize: '13px', margin: 0}}>
                Click to upload highlight photos (max 4)
              </p>
            </label>

            {/* Display uploaded highlight photos */}
            {eventData.highlight_photos && eventData.highlight_photos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                {eventData.highlight_photos.map((photo, index) => (
                  <div key={index} style={{position: 'relative'}}>
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
                      onClick={() => removeHighlightPhoto(index)}
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
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;