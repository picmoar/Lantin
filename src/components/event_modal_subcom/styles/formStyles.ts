import { CSSProperties } from 'react';

// Form input styles
export const input: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: '#f9fafb'
};

export const label: CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '8px'
};

export const subLabel: CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
  marginBottom: '4px'
};

export const textarea: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
  backgroundColor: '#f9fafb',
  resize: 'vertical' as const
};

// Form group styles
export const formGroup: CSSProperties = {
  marginBottom: '16px'
};

export const formRow: CSSProperties = {
  display: 'flex',
  gap: '12px'
};

export const formGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px'
};

// Error and validation styles
export const errorText: CSSProperties = {
  fontSize: '12px',
  color: '#dc2626',
  marginTop: '4px'
};

export const helperText: CSSProperties = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '4px'
};

// Required field indicator
export const requiredIndicator: CSSProperties = {
  color: '#ef4444'
};