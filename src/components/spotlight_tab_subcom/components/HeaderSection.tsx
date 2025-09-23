import React from 'react';

interface HeaderSectionProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ currentView, onViewChange }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <img
          src="/booth.png"
          alt="Spotlight"
          style={{
            width: '32px',
            height: '32px'
          }}
        />
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
          Spotlight
        </h1>
      </div>

      <div style={{
        display: 'flex',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '2px'
      }}>
        <button
          onClick={() => onViewChange('booths')}
          style={{
            padding: '4px 12px',
            backgroundColor: currentView === 'booths' ? 'white' : 'transparent',
            color: currentView === 'booths' ? '#111827' : '#6b7280',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Booths
        </button>
        <button
          onClick={() => onViewChange('events')}
          style={{
            padding: '4px 12px',
            backgroundColor: currentView === 'events' ? 'white' : 'transparent',
            color: currentView === 'events' ? '#111827' : '#6b7280',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Events
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;