import React, { useRef } from 'react';

interface LocationData {
  location: string;
  formatted_address: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationPickerProps {
  locationData: LocationData;
  onChange: (data: Partial<LocationData>) => void;
  showLocationPicker: boolean;
  onShowLocationPicker: (show: boolean) => void;
  predictions: any[];
  onLocationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationSelect: (placeId: string, description: string) => void;
  onGetCurrentLocation: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  locationData,
  onChange,
  showLocationPicker,
  onShowLocationPicker,
  predictions,
  onLocationInputChange,
  onLocationSelect,
  onGetCurrentLocation
}) => {
  const locationInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '8px'
      }}>
        📍 Location <span style={{ color: '#ef4444' }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <input
          ref={locationInputRef}
          type="text"
          value={locationData.location}
          onChange={onLocationInputChange}
          placeholder="Search for location..."
          required
          onFocus={() => onShowLocationPicker(true)}
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
          onClick={onGetCurrentLocation}
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
                onClick={() => onLocationSelect(prediction.place_id, prediction.description)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '2px' }}>
                  {prediction.structured_formatting.main_text}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show selected location details */}
      {locationData.formatted_address && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📍</span>
            <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>
              {locationData.formatted_address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;