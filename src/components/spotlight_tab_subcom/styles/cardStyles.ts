import { CSSProperties } from 'react';

// Base card styling used across all card components
export const baseCard: CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  cursor: 'pointer',
  position: 'relative'
};

// User-owned card styling (with special border colors)
export const userCard: CSSProperties = {
  ...baseCard,
  border: '2px solid #10b981', // Green border for booth cards
  padding: '16px'
};

export const userEventCard: CSSProperties = {
  ...baseCard,
  border: '2px solid #8b5cf6', // Purple border for event cards
};

// Empty state card styling
export const emptyStateCard: CSSProperties = {
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  color: '#6b7280'
};

// Card content styling
export const cardContent: CSSProperties = {
  padding: '12px'
};

export const cardContentLarge: CSSProperties = {
  padding: '16px'
};

// Card image styling
export const cardImage: CSSProperties = {
  width: '100%',
  objectFit: 'cover' as const
};

export const cardImageSmall: CSSProperties = {
  ...cardImage,
  height: '120px'
};

export const cardImageMedium: CSSProperties = {
  ...cardImage,
  height: '150px'
};

// Card title styling
export const cardTitle: CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '4px'
};

export const cardTitlePrimary: CSSProperties = {
  ...cardTitle,
  color: '#111827'
};

export const cardTitleAccent: CSSProperties = {
  ...cardTitle,
  color: '#8b5cf6',
  marginBottom: '8px'
};

export const cardTitleUser: CSSProperties = {
  color: '#10b981',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: 0
};

// Card text styling
export const cardText: CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '8px'
};

export const cardTextSmall: CSSProperties = {
  fontSize: '13px',
  color: '#6b7280'
};

// Card layout styling
export const cardGrid: CSSProperties = {
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  paddingBottom: '8px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
};

export const cardMinWidth: CSSProperties = {
  minWidth: '280px'
};

// Icon and badge styling
export const cardIcon: CSSProperties = {
  width: '14px',
  height: '14px',
  color: '#6b7280'
};

export const cardEmoji: CSSProperties = {
  fontSize: '12px'
};

export const cardBadge: CSSProperties = {
  position: 'absolute' as const,
  top: '8px',
  right: '8px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  color: '#10b981',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600'
};