import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationData {
  location: string;
  formatted_address: string;
  latitude: number | null;
  longitude: number | null;
}

interface UseGooglePlacesReturn {
  predictions: any[];
  showLocationPicker: boolean;
  setShowLocationPicker: (show: boolean) => void;
  handleLocationSearch: (query: string) => void;
  handleLocationSelect: (placeId: string, description: string) => void;
  getCurrentLocation: () => void;
  handleLocationInputChange: (e: React.ChangeEvent<HTMLInputElement>, onLocationUpdate: (data: Partial<LocationData>) => void) => void;
}

export const useGooglePlaces = (onLocationUpdate: (data: Partial<LocationData>) => void): UseGooglePlacesReturn => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
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
          onLocationUpdate({
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
                  onLocationUpdate({
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
            onLocationUpdate({
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

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>, onLocationUpdate: (data: Partial<LocationData>) => void) => {
    const value = e.target.value;
    onLocationUpdate({ location: value });
    handleLocationSearch(value);
  };

  return {
    predictions,
    showLocationPicker,
    setShowLocationPicker,
    handleLocationSearch,
    handleLocationSelect,
    getCurrentLocation,
    handleLocationInputChange
  };
};