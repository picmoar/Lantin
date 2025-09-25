import { CSSProperties } from 'react';

// Base button styling
export const baseButton: CSSProperties = {
  border: 'none',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

export const baseButtonLarge: CSSProperties = {
  ...baseButton,
  fontSize: '14px',
  fontWeight: '500'
};

// Primary action buttons (purple theme)
export const primaryButton: CSSProperties = {
  ...baseButton,
  backgroundColor: '#8b5cf6',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px'
};

export const primaryButtonLarge: CSSProperties = {
  ...baseButtonLarge,
  backgroundColor: '#8b5cf6',
  color: 'white',
  padding: '8px 16px'
};

// Secondary buttons (outlined style)
export const secondaryButton: CSSProperties = {
  ...baseButton,
  backgroundColor: 'white',
  color: '#8b5cf6',
  border: '1px solid #8b5cf6',
  padding: '8px 12px'
};

// Danger/delete buttons
export const dangerButton: CSSProperties = {
  ...baseButton,
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px'
};

export const dangerButtonLarge: CSSProperties = {
  ...baseButtonLarge,
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '8px 16px'
};

// Success/create buttons (teal theme)
export const createButton: CSSProperties = {
  ...baseButton,
  backgroundColor: 'rgba(97, 133, 139, 1)',
  color: 'white',
  padding: '8px 12px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translateY(-2px)'
};

// Navigation buttons (circular)
export const navButton: CSSProperties = {
  position: 'absolute' as const,
  width: '32px',
  height: '32px',
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const navButtonLeft: CSSProperties = {
  ...navButton,
  left: '8px',
  top: '50%',
  transform: 'translateY(-50%)'
};

export const navButtonRight: CSSProperties = {
  ...navButton,
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)'
};

// Delete button (circular, floating)
export const floatingDeleteButton: CSSProperties = {
  position: 'absolute' as const,
  top: '8px',
  right: '8px',
  width: '24px',
  height: '24px',
  backgroundColor: 'rgba(239, 68, 68, 0.9)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)'
};

// Toggle buttons (for tabs)
export const toggleButton: CSSProperties = {
  padding: '4px 12px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

export const toggleButtonActive: CSSProperties = {
  ...toggleButton,
  backgroundColor: 'white',
  color: '#111827'
};

export const toggleButtonInactive: CSSProperties = {
  ...toggleButton,
  backgroundColor: 'transparent',
  color: '#6b7280'
};

// Dropdown toggle buttons
export const dropdownToggle: CSSProperties = {
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
};

// Button container styles
export const buttonGroup: CSSProperties = {
  display: 'flex',
  gap: '8px'
};

export const buttonRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};