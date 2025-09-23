import React from 'react';

interface EmptyStateProps {
  type: 'booth' | 'event';
  isLoggedIn?: boolean;
  showCreateMessage?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  isLoggedIn = false,
  showCreateMessage = true
}) => {
  const config = {
    booth: {
      icon: '🏪',
      message: 'No booth created yet',
      createText: 'Create your booth above!'
    },
    event: {
      icon: '🎭',
      message: 'No events created yet',
      createText: 'Create your event above!'
    }
  };

  const { icon, message, createText } = config[type];

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center',
      color: '#6b7280'
    }}>
      <span style={{
        fontSize: '24px',
        marginBottom: '8px',
        display: 'block'
      }}>
        {icon}
      </span>
      <p style={{ margin: '0', fontSize: '14px' }}>
        {message}
      </p>
      {isLoggedIn && showCreateMessage && (
        <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
          {createText}
        </p>
      )}
    </div>
  );
};

export default EmptyState;