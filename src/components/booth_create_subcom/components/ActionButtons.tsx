import React from 'react';

interface ActionButtonsProps {
  onClose: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onClose, isSubmitting, isEditing }) => {
  return (
    <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
      <button
        type="button"
        onClick={onClose}
        style={{
          flex: 1,
          padding: '16px',
          backgroundColor: 'white',
          color: '#6b7280',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          flex: 1,
          padding: '16px',
          backgroundColor: isSubmitting ? '#9ca3af' : '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        {isSubmitting
          ? (isEditing ? 'Updating...' : 'Creating...')
          : (isEditing ? 'Update Booth' : 'Create Booth')
        }
      </button>
    </div>
  );
};

export default ActionButtons;