import React from 'react';

interface EventData {
  location: string;
  formatted_address: string;
}

interface EventLocationSectionProps {
  eventData: EventData;
  onEventDataChange: (data: Partial<EventData>) => void;
  locationInputRef: React.RefObject<HTMLInputElement>;
  showLocationPicker: boolean;
  setShowLocationPicker: (show: boolean) => void;
  predictions: any[];
  handleLocationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocationSelect: (placeId: string, description: string) => void;
  getCurrentLocation: () => void;
  styles: {
    label: React.CSSProperties;
  };
}

export default function EventLocationSection({
  eventData,
  locationInputRef,
  showLocationPicker,
  predictions,
  handleLocationInputChange,
  handleLocationSelect,
  getCurrentLocation,
  styles
}: EventLocationSectionProps) {
  return (
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
  );
}