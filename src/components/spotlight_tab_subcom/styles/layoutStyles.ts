import { CSSProperties } from 'react';

// Section layouts
export const sectionContainer: CSSProperties = {
  marginBottom: '24px'
};

export const sectionHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
};

export const sectionTitle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '12px'
};

// Horizontal scrolling layouts
export const horizontalScrollContainer: CSSProperties = {
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  paddingBottom: '8px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
};

export const horizontalScrollContainerLarge: CSSProperties = {
  ...horizontalScrollContainer,
  gap: '16px'
};

// Flex layouts
export const flexRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

export const flexRowBetween: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

export const flexRowCenter: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export const flexColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
};

// Positioning layouts
export const relativeContainer: CSSProperties = {
  position: 'relative'
};

export const absoluteContainer: CSSProperties = {
  position: 'absolute'
};

// Spacing utilities
export const spacingSmall: CSSProperties = {
  gap: '8px'
};

export const spacingMedium: CSSProperties = {
  gap: '12px'
};

export const spacingLarge: CSSProperties = {
  gap: '16px'
};

// Margin utilities
export const marginBottomSmall: CSSProperties = {
  marginBottom: '8px'
};

export const marginBottomMedium: CSSProperties = {
  marginBottom: '12px'
};

export const marginBottomLarge: CSSProperties = {
  marginBottom: '24px'
};

// Padding utilities
export const paddingSmall: CSSProperties = {
  padding: '8px'
};

export const paddingMedium: CSSProperties = {
  padding: '12px'
};

export const paddingLarge: CSSProperties = {
  padding: '16px'
};

export const paddingExtraLarge: CSSProperties = {
  padding: '24px'
};