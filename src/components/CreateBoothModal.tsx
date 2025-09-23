import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '../lib/supabase';
import {
  ModalHeader,
  BasicInfoSection,
  LocationPicker,
  ScheduleSection,
  ImageUploader,
  HighlightPhotos,
  ActionButtons,
  formStyles
} from './booth_create_subcom';
import styles from './booth_create_subcom/styles/BoothModal.module.css';

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

interface AuthUser {
  id?: string;
}

interface CreateBoothModalProps {
  onClose: () => void;
  onSubmit: (boothData: BoothData) => void;
  userProfile: UserProfile;
  supabase: any;
  user: AuthUser;
  initialData?: Partial<BoothData>;
  isEditing?: boolean;
}


const CreateBoothModal: React.FC<CreateBoothModalProps> = ({
  onClose,
  onSubmit,
  userProfile,
  supabase,
  user,
  initialData,
  isEditing = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        let google;

        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
          google = window.google;
        } else {
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
        // Try to use existing Google API if loader fails
        if (window.google && window.google.maps && window.google.maps.places) {
          const google = window.google;
          googleApiRef.current = google;
          const autocomplete = new google.maps.places.AutocompleteService();
          const places = new google.maps.places.PlacesService(document.createElement('div'));
          setAutocompleteService(autocomplete);
          setPlacesService(places);
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      console.log('🏪 Already submitting, preventing duplicate submission');
      return;
    }

    setIsSubmitting(true);
    console.log('🏪 Form submitted, calling onSubmit...');

    try {
      await onSubmit(boothData);
    } catch (error) {
      console.error('🏪 Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log('🏪 Image upload - supabase:', !!supabase, 'user:', user, 'user.id:', user?.id);

      // Check if we have Supabase and should attempt cloud upload
      if (supabase && user?.id) {
        // Verify we have a valid session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🏪 Session check:', { session: !!session, sessionUser: !!session?.user, error: sessionError });

        if (session && session.user) {
          // Real user with valid Supabase session - try cloud upload
          console.log('📤 Attempting Supabase booth storage upload...');
          console.log('📤 Session user ID:', session.user.id);
          console.log('📤 File details:', { name: file.name, size: file.size, type: file.type });

          const fileExt = file.name.split('.').pop();
          const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          console.log('📤 Upload filename:', fileName);

          const { data, error } = await supabase.storage
            .from('booth')
            .upload(fileName, file);

          if (error) {
            console.error('Upload error:', error);
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
          }

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
          console.log(`✅ Uploaded booth image to Supabase storage`);
          return;
        }
      }

      // Fallback to local URLs (demo user, no session, or RLS issues)
      console.log('📱 Using local file URL (demo mode or no valid session)');
      const fileUrl = URL.createObjectURL(file);
      setBoothData({
        ...boothData,
        image: fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      console.log('📱 Created local object URL for booth image');

    } catch (error) {
      console.error('Upload error:', error);

      // If cloud upload fails, fallback to local URLs
      console.log('🔄 Cloud upload failed, falling back to local URL...');
      const fileUrl = URL.createObjectURL(file);
      setBoothData({
        ...boothData,
        image: fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      alert(`Cloud upload failed, using local image instead. Error: ${error.message}`);
    }
  };

  const handleHighlightPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Check if we have Supabase and should attempt cloud upload
      if (supabase && user?.id) {
        // Verify we have a valid session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (session && session.user) {
          // Real user with valid Supabase session - try cloud upload
          console.log('📤 Attempting Supabase booth storage upload for highlights...');

          const uploadPromises = Array.from(files).slice(0, 4).map(async (file, i) => {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}/highlights/${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            // Upload to Supabase storage
            const { data, error } = await supabase.storage
              .from('booth')
              .upload(fileName, file);

            if (error) {
              console.error('Upload error:', error);
              throw new Error(`Failed to upload ${file.name}: ${error.message}`);
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('booth')
              .getPublicUrl(fileName);

            return publicUrl;
          });

          const uploadedUrls = await Promise.all(uploadPromises);
          setBoothData(prev => ({
            ...prev,
            highlight_photos: [...(prev.highlight_photos || []), ...uploadedUrls]
          }));
          console.log(`✅ Uploaded ${uploadedUrls.length} highlight images to Supabase booth storage`);
          return;
        }
      }

      // Fallback to local URLs (demo user, no session, or RLS issues)
      console.log('📱 Using local file URLs for highlights (demo mode or no valid session)');
      const fileUrls = Array.from(files).slice(0, 4).map(file => {
        return URL.createObjectURL(file);
      });

      setBoothData(prev => ({
        ...prev,
        highlight_photos: [...(prev.highlight_photos || []), ...fileUrls]
      }));

      console.log(`📱 Created ${fileUrls.length} local object URLs for highlight images`);

    } catch (error) {
      console.error('Upload error:', error);

      // If cloud upload fails, fallback to local URLs
      console.log('🔄 Cloud upload failed, falling back to local URLs...');
      const fileUrls = Array.from(files).slice(0, 4).map(file => {
        return URL.createObjectURL(file);
      });

      setBoothData(prev => ({
        ...prev,
        highlight_photos: [...(prev.highlight_photos || []), ...fileUrls]
      }));

      alert(`Cloud upload failed, using local images instead. Error: ${error.message}`);
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
    <div className={styles.overlay}>
      <div className={styles.container}>
        <ModalHeader isEditing={isEditing} onClose={onClose} />

        <form onSubmit={handleSubmit} className={styles.form}>
          <BasicInfoSection
            boothData={{
              name: boothData.name,
              description: boothData.description,
              operator_name: boothData.operator_name
            }}
            onChange={(data) => setBoothData({...boothData, ...data})}
          />


          <LocationPicker
            locationData={{
              location: boothData.location,
              formatted_address: boothData.formatted_address,
              latitude: boothData.latitude,
              longitude: boothData.longitude
            }}
            onChange={(data) => setBoothData({...boothData, ...data})}
            showLocationPicker={showLocationPicker}
            onShowLocationPicker={setShowLocationPicker}
            predictions={predictions}
            onLocationInputChange={handleLocationInputChange}
            onLocationSelect={handleLocationSelect}
            onGetCurrentLocation={getCurrentLocation}
          />

          <ScheduleSection
            scheduleData={{
              start_date: boothData.start_date,
              end_date: boothData.end_date,
              start_time: boothData.start_time,
              end_time: boothData.end_time
            }}
            onChange={(data) => setBoothData({...boothData, ...data})}
          />

          <ImageUploader
            imageUrl={boothData.image}
            onImageUpload={handleImageUpload}
            label="Booth Image"
          />

          <HighlightPhotos
            highlightPhotos={boothData.highlight_photos}
            onHighlightPhotosUpload={handleHighlightPhotosUpload}
            onRemoveHighlightPhoto={removeHighlightPhoto}
          />

          <ActionButtons
            onClose={onClose}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateBoothModal;