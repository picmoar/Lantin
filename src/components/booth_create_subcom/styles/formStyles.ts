import { CSSProperties } from 'react';

// Common form styling constants
export const formStyles = {
  // Input field styling
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb'
  } as CSSProperties,

  // Label styling
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px'
  } as CSSProperties,

  // Secondary label styling
  secondaryLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  } as CSSProperties,

  // Small label styling
  smallLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px'
  } as CSSProperties,

  // Textarea styling
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#f9fafb',
    resize: 'vertical' as const
  } as CSSProperties,

  // Required field indicator
  required: {
    color: '#ef4444'
  } as CSSProperties,

  // Grid layout helpers
  gridTwoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  } as CSSProperties,

  // Button styling
  button: {
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none'
  } as CSSProperties,

  // Primary button
  primaryButton: {
    backgroundColor: '#f59e0b',
    color: 'white'
  } as CSSProperties,

  // Secondary button
  secondaryButton: {
    backgroundColor: 'white',
    color: '#6b7280',
    border: '1px solid #d1d5db'
  } as CSSProperties,

  // Disabled button
  disabledButton: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
    opacity: 0.7
  } as CSSProperties,

  // Upload area styling
  uploadArea: {
    display: 'block',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s'
  } as CSSProperties,

  // Success indicator
  successBadge: {
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px'
  } as CSSProperties,

  // Flex center alignment
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  } as CSSProperties
};