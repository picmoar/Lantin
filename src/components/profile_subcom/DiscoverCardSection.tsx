interface DiscoverCardSectionProps {
  isDiscoverable: boolean;
  isCreatingDiscoverCard: boolean;
  handleToggleDiscoverCard: () => void;
}

export function DiscoverCardSection({
  isDiscoverable,
  isCreatingDiscoverCard,
  handleToggleDiscoverCard
}: DiscoverCardSectionProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      margin: '0 4px 16px 4px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
        <span style={{fontSize: '18px'}}>🌟</span>
        <h3 style={{fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111827'}}>Discover Card</h3>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '20px 16px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827'}}>
          Share Your Art with the World
        </h4>
        <p style={{fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0', lineHeight: '1.5'}}>
          {isDiscoverable
            ? 'Your profile is currently visible in the discover feed. You can deactivate it anytime without losing your edits.'
            : 'Create a discover card to showcase your profile and artworks to other users in the discover feed.'
          }
        </p>

        <button
          onClick={handleToggleDiscoverCard}
          disabled={isCreatingDiscoverCard}
          style={{
            width: '100%',
            backgroundColor: isCreatingDiscoverCard ? '#9ca3af' : (isDiscoverable ? '#ef4444' : '#8b5cf6'),
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isCreatingDiscoverCard ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => {
            if (!isCreatingDiscoverCard) {
              e.currentTarget.style.backgroundColor = isDiscoverable ? '#dc2626' : '#7c3aed';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCreatingDiscoverCard) {
              e.currentTarget.style.backgroundColor = isDiscoverable ? '#ef4444' : '#8b5cf6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          {isCreatingDiscoverCard
            ? 'Updating...'
            : (isDiscoverable ? 'Deactivate Discover Card' : 'Activate Discover Card')
          }
        </button>

        <p style={{fontSize: '12px', color: '#9ca3af', margin: '0'}}>
          {isDiscoverable
            ? 'All your discover page edits (bio, contact, booth, artworks) are saved and will remain when reactivated.'
            : 'Your profile will be visible to other users in the discover section when activated.'
          }
        </p>
      </div>
    </div>
  );
}