import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapSectionProps {
  allBooths: any[];
  allEvents: any[];
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
  onBoothSelect: (booth: any) => void;
  onEventSelect: (event: any) => void;
  isVisible: boolean;
}

export default function MapSection({ allBooths, allEvents, auth, onBoothSelect, onEventSelect, isVisible }: MapSectionProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'booths' | 'events'>('booths');
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const autocompleteServiceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Google Maps initialization
  const initializeGoogleMap = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key not configured. Using fallback map.');
      setIsMapLoaded(false);
      return;
    }

    try {
      let google;

      // Check if Google Maps API is already loaded to avoid "Loader must not be called again" error
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('📍 MapSection: Using existing Google Maps API instance');
        google = window.google;
      } else {
        console.log('📍 MapSection: Loading Google Maps API...');
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });
        google = await loader.load();
      }

      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        googleMapRef.current = map;

        // Initialize autocomplete service for search
        if (google && google.maps && google.maps.places) {
          autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
          console.log('📍 MapSection: Autocomplete service initialized');
        }

        setIsMapLoaded(true);
        addMapMarkers(map, google);
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setIsMapLoaded(false);
    }
  };

  const addMapMarkers = (map: any, google: any) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Get items based on active filter
    let itemsToShow = [];

    if (activeFilter === 'booths') {
      itemsToShow = allBooths.map(booth => ({ ...booth, itemType: 'booth' }));
    } else if (activeFilter === 'events') {
      itemsToShow = allEvents.map(event => ({ ...event, itemType: 'event' }));
    }

    console.log(`📍 MapSection: Showing ${itemsToShow.length} ${activeFilter} on map`);

    itemsToShow.forEach((item, idx) => {
      let position;

      if (item.latitude && item.longitude) {
        position = { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) };
      } else {
        const demoPositions = [
          { lat: 40.7589, lng: -73.9851 },
          { lat: 40.7505, lng: -73.9934 },
          { lat: 40.7282, lng: -73.9942 },
          { lat: 40.7614, lng: -73.9776 },
          { lat: 40.6892, lng: -73.9442 },
          { lat: 40.7831, lng: -73.9712 }
        ];
        position = demoPositions[idx % demoPositions.length];
      }

      const isUserItem = auth.user && (item.artist_id === auth.user?.id || item.organizer_id === auth.user?.id);

      // Different colors for booths vs events
      let markerColor;
      let itemEmoji;

      if (item.itemType === 'event') {
        markerColor = isUserItem ? '#059669' : '#dc2626'; // Green for user events, red for other events
        // Event type emojis
        switch(item.type) {
          case 'workshop': itemEmoji = '🎨'; break;
          case 'exhibition': itemEmoji = '🖼️'; break;
          case 'gallery': itemEmoji = '🏛️'; break;
          case 'sale': itemEmoji = '💰'; break;
          default: itemEmoji = '📅'; break;
        }
      } else {
        markerColor = isUserItem ? '#10b981' : '#8b5cf6'; // Original booth colors
        // Booth type emojis
        switch(item.type) {
          case 'store': itemEmoji = '🏪'; break;
          case 'studio': itemEmoji = '🏛️'; break;
          case 'market': itemEmoji = '🛒'; break;
          case 'popup':
          default: itemEmoji = '🎨'; break;
        }
      }

      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: `${item.name || item.title} - ${item.artist || item.organizer_name}${item.formatted_address ? '\n' + item.formatted_address : ''}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            '<svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M20 0C11.163 0 4 7.163 4 16c0 16 16 28 16 28s16-12 16-28c0-8.837-7.163-16-16-16z" fill="' + markerColor + '" stroke="#ffffff" stroke-width="2"/>' +
              '<circle cx="20" cy="16" r="10" fill="white"/>' +
              '<text x="20" y="22" text-anchor="middle" fill="' + markerColor + '" font-size="14" font-weight="bold">' + itemEmoji + '</text>' +
            '</svg>'
          )}`,
          scaledSize: new google.maps.Size(40, 48),
          anchor: new google.maps.Point(20, 48)
        }
      });

      marker.addListener('click', () => {
        if (item.itemType === 'event') {
          onEventSelect({
            id: item.id,
            title: item.title,
            organizer_name: item.organizer_name,
            location: item.location,
            image: item.image,
            description: item.description,
            start_date: item.start_date,
            end_date: item.end_date,
            start_time: item.start_time,
            end_time: item.end_time,
            type: item.type,
            price: item.price,
            max_attendees: item.max_attendees,
            highlight_photos: item.highlight_photos || []
          });
        } else {
          onBoothSelect({
            id: item.id,
            name: item.name,
            artist: item.artist,
            operator_name: item.operator_name,
            location: item.location,
            image: item.image,
            description: item.description,
            start_date: item.start_date,
            end_date: item.end_date,
            start_time: item.start_time,
            end_time: item.end_time,
            highlight_photos: item.highlight_photos || [],
            visitors: 45 + (idx * 15)
          });
        }
      });

      // Store marker reference for cleanup
      markersRef.current.push(marker);
    });
  };

  // Search functionality
  const handleLocationSearch = (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    // Initialize autocomplete service if not already available
    if (!autocompleteServiceRef.current && window.google && window.google.maps && window.google.maps.places) {
      console.log('📍 MapSection: Initializing autocomplete service on demand');
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }

    if (!autocompleteServiceRef.current) {
      console.warn('📍 MapSection: Google Places API not available for search');
      setPredictions([]);
      return;
    }

    console.log('📍 MapSection: Searching for:', query);

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: query,
        types: ['establishment', 'geocode']
      },
      (predictions: any[], status: string) => {
        console.log('📍 MapSection: Search status:', status, 'Results:', predictions?.length || 0);
        if (status === 'OK' && predictions) {
          setPredictions(predictions.slice(0, 5));
        } else {
          setPredictions([]);
          if (status !== 'ZERO_RESULTS') {
            console.warn('📍 MapSection: Search failed with status:', status);
          }
        }
      }
    );
  };

  const handleLocationSelect = (placeId: string, description: string) => {
    if (!window.google || !googleMapRef.current) return;

    const placesService = new window.google.maps.places.PlacesService(googleMapRef.current);

    placesService.getDetails(
      {
        placeId: placeId,
        fields: ['geometry', 'formatted_address', 'name']
      },
      (place: any, status: string) => {
        if (status === 'OK' && place && place.geometry && place.geometry.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          // Center map on selected location
          googleMapRef.current.setCenter(location);
          googleMapRef.current.setZoom(15);

          // Clear search
          setSearchQuery(description);
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  };

  // Initialize map when component becomes visible
  useEffect(() => {
    if (isVisible && !isMapLoaded) {
      initializeGoogleMap();
    }
  }, [isVisible, allBooths.length, allEvents.length]);

  // Update markers when filter changes
  useEffect(() => {
    if (isMapLoaded && googleMapRef.current && window.google) {
      addMapMarkers(googleMapRef.current, window.google);
    }
  }, [activeFilter, isMapLoaded, allBooths, allEvents]);

  // Clean up map when component becomes invisible
  useEffect(() => {
    if (!isVisible && isMapLoaded) {
      setIsMapLoaded(false);
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      margin: '0',
      boxSizing: 'border-box',
      paddingBottom: '100px' // Prevent map from covering navigation bar
    }}>
      {/* Spotlight Header */}
      <div style={{
        padding: '0 16px 16px 16px',
        backgroundColor: 'white'
      }}>
        {/* Title with Icon and Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          {/* Left side: Map title with icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <img
              src="/map.png"
              alt="Map"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain'
              }}
            />
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              color: '#111827'
            }}>
              Map
            </h1>
          </div>

          {/* Right side: Tab-style buttons */}
          <div style={{
            display: 'flex',
            gap: '20px'
          }}>
            <button
              onClick={() => setActiveFilter('booths')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                fontWeight: activeFilter === 'booths' ? '600' : '500',
                color: activeFilter === 'booths' ? '#111827' : '#9ca3af',
                cursor: 'pointer',
                padding: '6px 0',
                borderBottom: activeFilter === 'booths' ? '2px solid #111827' : 'none'
              }}
            >
              Booths
            </button>
            <button
              onClick={() => setActiveFilter('events')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                fontWeight: activeFilter === 'events' ? '600' : '500',
                color: activeFilter === 'events' ? '#111827' : '#9ca3af',
                cursor: 'pointer',
                padding: '6px 0',
                borderBottom: activeFilter === 'events' ? '2px solid #111827' : 'none'
              }}
            >
              Events
            </button>
          </div>
        </div>

        {/* Search Bar with integrated filter */}
        <div style={{
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '16px',
            pointerEvents: 'none'
          }}>
            🔍
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleLocationSearch(e.target.value);
            }}
            onFocus={() => setShowPredictions(true)}
            onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
            placeholder="Search locations, artists, booths..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#f9fafb',
              outline: 'none'
            }}
          />

          {/* Location Predictions Dropdown */}
          {showPredictions && predictions.length > 0 && (
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
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {predictions.map((prediction: any) => (
                <div
                  key={prediction.place_id}
                  onClick={() => handleLocationSelect(prediction.place_id, prediction.description)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <div style={{fontWeight: '500', color: '#1f2937', marginBottom: '2px'}}>
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div style={{fontSize: '11px', color: '#6b7280'}}>
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Google Maps Container */}
      <div style={{
        position: 'relative',
        height: '75vh',
        overflow: 'hidden'
      }}>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            display: isMapLoaded ? 'block' : 'none'
          }}
        />

        {!isMapLoaded && (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#e5e7eb',
            backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '48px', opacity: 0.6 }}>🗺️</div>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <p style={{fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0'}}>
                Interactive Map Loading...
              </p>
              <p style={{fontSize: '12px', margin: '0', lineHeight: '1.4'}}>
                Discover booths and events near you
              </p>
            </div>
          </div>
        )}

        {/* Location Button Overlay */}
        {isMapLoaded && (
          <button
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 10
            }}
            onClick={() => {
              if (navigator.geolocation && googleMapRef.current) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  googleMapRef.current.setCenter(userLocation);
                  googleMapRef.current.setZoom(15);
                });
              }
            }}
            title="Center on your location"
          >
            🎯
          </button>
        )}

        {/* Legend */}
        {isMapLoaded && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '12px',
            maxWidth: '200px'
          }}>
            <div style={{
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              📍 Map Legend
            </div>

            {activeFilter === 'booths' && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#8b5cf6',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{color: '#6b7280'}}>Other Booths</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{color: '#6b7280'}}>Your Booths</span>
                </div>
              </>
            )}

            {activeFilter === 'events' && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{color: '#6b7280'}}>Other Events</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#059669',
                    borderRadius: '50%'
                  }}></div>
                  <span style={{color: '#6b7280'}}>Your Events</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}