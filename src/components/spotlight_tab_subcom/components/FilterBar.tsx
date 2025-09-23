import React from 'react';

interface FilterBarProps {
  selectedLocation: string;
  selectedType: string;
  showLocationDropdown: boolean;
  showTypeDropdown: boolean;
  onLocationChange: (location: string) => void;
  onTypeChange: (type: string) => void;
  onLocationDropdownToggle: () => void;
  onTypeDropdownToggle: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedLocation,
  selectedType,
  showLocationDropdown,
  showTypeDropdown,
  onLocationChange,
  onTypeChange,
  onLocationDropdownToggle,
  onTypeDropdownToggle,
  searchQuery,
  onSearchChange
}) => {
  const locations = ['All Locations', 'SoHo', 'Brooklyn', 'Queens', 'Manhattan'];
  const types = ['All Types', 'Pop-up', 'Studio', 'Gallery', 'Workshop'];

  return (
    <>
      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '16px'
      }}>
        <input
          type="text"
          placeholder="Search artists, booths..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 12px 12px 40px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        <svg style={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          width: '16px',
          height: '16px',
          color: '#9ca3af'
        }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {/* Location Dropdown */}
        <div style={{ flex: 1, position: 'relative' }}>
          <button
            onClick={onLocationDropdownToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{selectedLocation}</span>
            <svg
              style={{
                width: '16px',
                height: '16px',
                transform: showLocationDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLocationDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              marginTop: '4px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              zIndex: 100
            }}>
              {locations.map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => onLocationChange(location)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    backgroundColor: selectedLocation === location ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: selectedLocation === location ? '600' : '500',
                    color: selectedLocation === location ? '#8b5cf6' : '#374151',
                    cursor: 'pointer',
                    borderRadius: idx === 0 ? '12px 12px 0 0' : idx === locations.length - 1 ? '0 0 12px 12px' : '0'
                  }}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div style={{ flex: 1, position: 'relative' }}>
          <button
            onClick={onTypeDropdownToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{selectedType}</span>
            <svg
              style={{
                width: '16px',
                height: '16px',
                transform: showTypeDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTypeDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              marginTop: '4px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              zIndex: 100
            }}>
              {types.map((type, idx) => (
                <button
                  key={idx}
                  onClick={() => onTypeChange(type)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    textAlign: 'left',
                    backgroundColor: selectedType === type ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: selectedType === type ? '600' : '500',
                    color: selectedType === type ? '#8b5cf6' : '#374151',
                    cursor: 'pointer',
                    borderRadius: idx === 0 ? '12px 12px 0 0' : idx === types.length - 1 ? '0 0 12px 12px' : '0'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterBar;