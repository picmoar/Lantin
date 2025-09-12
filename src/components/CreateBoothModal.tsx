import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '../lib/supabase';

interface BoothData {
  name: string;
  description: string;
  location: string;
  image: string;
  operator_name: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
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

interface CreateBoothModalProps {
  onClose: () => void;
  onSubmit: (boothData: BoothData) => void;
  userProfile: UserProfile;
  initialData?: Partial<BoothData>;
  isEditing?: boolean;
}

const CreateBoothModal: React.FC<CreateBoothModalProps> = ({ 
  onClose, 
  onSubmit, 
  userProfile, 
  initialData, 
  isEditing 
}) => {
  const [boothData, setBoothData] = useState<BoothData>(initialData || {
    name: '',
    description: '',
    location: '',
    image: '',
    operator_name: userProfile?.name || '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    highlight_photos: [],
    latitude: null,
    longitude: null,
    formatted_address: ''
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
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
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
          setBoothData({
            ...boothData,
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
    setBoothData({...boothData, location: value});
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
                  setBoothData({
                    ...boothData,
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
            setBoothData({
              ...boothData,
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
    onSubmit(boothData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (supabase) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `booth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('booth')
          .upload(fileName, file);

        if (error) {
          console.error('Supabase upload error:', error);
          // Fall back to local URL
          const fileUrl = URL.createObjectURL(file);
          setBoothData({
            ...boothData, 
            image: fileUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          });
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('booth')
            .getPublicUrl(fileName);

          setBoothData({
            ...boothData, 
            image: publicUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
          });
        }
      } else {
        // No Supabase, use local URL
        const fileUrl = URL.createObjectURL(file);
        setBoothData({
          ...boothData, 
          image: fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Failed to upload image');
    }
  };

  const handleHighlightPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedPhotos: string[] = [];
      
      for (let i = 0; i < Math.min(files.length, 4); i++) {
        const file = files[i];
        
        if (supabase) {
          // Upload to Supabase Storage
          const fileExt = file.name.split('.').pop();
          const fileName = `booth-highlight-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('booth')
            .upload(fileName, file);

          if (error) {
            console.error('Supabase upload error:', error);
            // Fall back to local URL
            const fileUrl = URL.createObjectURL(file);
            uploadedPhotos.push(fileUrl);
          } else {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('booth')
              .getPublicUrl(fileName);
            uploadedPhotos.push(publicUrl);
          }
        } else {
          // No Supabase, use local URL
          const fileUrl = URL.createObjectURL(file);
          uploadedPhotos.push(fileUrl);
        }
      }

      setBoothData({
        ...boothData,
        highlight_photos: [...(boothData.highlight_photos || []), ...uploadedPhotos]
      });
    } catch (error) {
      console.error('Error handling highlight photos upload:', error);
      alert('Failed to upload highlight photos');
    }
  };

  const removeHighlightPhoto = (index: number) => {
    const newPhotos = [...(boothData.highlight_photos || [])];
    newPhotos.splice(index, 1);
    setBoothData({
      ...boothData,
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
              backgroundColor: '#10b981',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
              padding: '4px'
            }}>
              <img 
                src="/booth.png" 
                alt="Booth" 
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0}}>
              {isEditing ? 'Edit Booth' : 'Create Booth'}
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
          {isEditing ? 'Update your booth information' : 'Set up your art booth to connect with visitors'}
        </p>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          {/* Basic Information */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              Booth Name <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              type="text"
              value={boothData.name}
              onChange={(e) => setBoothData({...boothData, name: e.target.value})}
              placeholder="My Art Studio"
              required
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
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              👤 Booth Operator <span style={{color: '#ef4444'}}>*</span>
            </label>
            <input
              type="text"
              value={boothData.operator_name}
              onChange={(e) => setBoothData({...boothData, operator_name: e.target.value})}
              placeholder="Your name or business name"
              required
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
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              Description
            </label>
            <textarea
              value={boothData.description}
              onChange={(e) => setBoothData({...boothData, description: e.target.value})}
              placeholder="Describe your booth and what visitors can expect..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                backgroundColor: '#f9fafb',
                resize: 'vertical'
              }}
            />
          </div>


          {/* Location */}
          <div style={{position: 'relative'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              📍 Location <span style={{color: '#ef4444'}}>*</span>
            </label>
            <div style={{position: 'relative'}}>
              <input
                ref={locationInputRef}
                type="text"
                value={boothData.location}
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
            {boothData.formatted_address && (
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
                    {boothData.formatted_address}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Operating Schedule */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px'}}>
              📅 Operating Schedule
            </label>
            
            {/* Date Range */}
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                Event Dates
              </label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px'}}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={boothData.start_date}
                    onChange={(e) => setBoothData({...boothData, start_date: e.target.value})}
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
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px'}}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={boothData.end_date}
                    onChange={(e) => setBoothData({...boothData, end_date: e.target.value})}
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
              <label style={{display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
                Daily Operating Hours
              </label>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px'}}>
                    Opens At
                  </label>
                  <input
                    type="time"
                    value={boothData.start_time}
                    onChange={(e) => setBoothData({...boothData, start_time: e.target.value})}
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
                  <label style={{display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '4px'}}>
                    Closes At
                  </label>
                  <input
                    type="time"
                    value={boothData.end_time}
                    onChange={(e) => setBoothData({...boothData, end_time: e.target.value})}
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

          {/* Image Upload */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              Booth Image
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
              {boothData.image ? (
                <div>
                  <img 
                    src={boothData.image} 
                    alt="Booth preview" 
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
                  <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>Click to upload booth image</p>
                </div>
              )}
            </label>
          </div>

          {/* Highlight Photos Upload */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px'}}>
              ✨ Booth Highlights (up to 4 photos)
            </label>
            <p style={{fontSize: '12px', color: '#6b7280', marginBottom: '12px', margin: '0 0 12px 0'}}>
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
              marginBottom: boothData.highlight_photos && boothData.highlight_photos.length > 0 ? '16px' : '0'
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
            {boothData.highlight_photos && boothData.highlight_photos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                {boothData.highlight_photos.map((photo, index) => (
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
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {isEditing ? 'Update Booth' : 'Create Booth'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoothModal;