import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface EventData {
  location: string;
  formatted_address: string;
  latitude: number | null;
  longitude: number | null;
}

interface UseGooglePlacesProps {
  eventData: EventData;
  setEventData: (data: EventData) => void;
}

interface UseGooglePlacesReturn {
  showLocationPicker: boolean;
  setShowLocationPicker: (show: boolean) => void;
  predictions: any[];
  locationInputRef: React.RefObject<HTMLInputElement>;
  handleLocationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocationSelect: (placeId: string, description: string) => void;
  getCurrentLocation: () => void;
}

export const useGooglePlaces = ({
  eventData,
  setEventData
}: UseGooglePlacesProps): UseGooglePlacesReturn => {
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

  return {
    showLocationPicker,
    setShowLocationPicker,
    predictions,
    locationInputRef,
    handleLocationInputChange,
    handleLocationSelect,
    getCurrentLocation
  };
};