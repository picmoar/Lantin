/**
 * Utility functions for handling artwork image extraction and validation
 */

/**
 * Extracts the first valid image URL from various data formats
 */
export const extractFirstImageUrl = (imageField: any): string | null => {
  if (!imageField) return null;

  // Handle string (JSON array or direct URL)
  if (typeof imageField === 'string') {
    const trimmed = imageField.trim();

    // If it looks like JSON array, parse it
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const firstUrl = parsed[0];
          return typeof firstUrl === 'string' ? firstUrl.trim() : null;
        }
      } catch (error) {
        console.warn('Failed to parse image JSON:', imageField, error);
        return null;
      }
    }

    // Direct URL string
    return trimmed || null;
  }

  // Handle array directly
  if (Array.isArray(imageField) && imageField.length > 0) {
    const firstUrl = imageField[0];
    return typeof firstUrl === 'string' ? firstUrl.trim() : null;
  }

  return null;
};

/**
 * Validates if a URL looks like a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  // Check for reasonable length (reject very long URLs)
  if (url.length > 1000) return false;

  // Check for image extensions or known image hosting patterns
  const imagePatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i,
    /supabase\.co.*\/storage/i,
    /cloudinary\.com/i,
    /amazonaws\.com/i
  ];

  return imagePatterns.some(pattern => pattern.test(url));
};

/**
 * Gets a valid image URL with fallback
 */
export const getValidImageUrl = (artwork: any, fallbackUrl?: string): string => {
  const extractedUrl = extractFirstImageUrl(artwork.image);

  // Return extracted URL if valid
  if (extractedUrl && isValidImageUrl(extractedUrl)) {
    return extractedUrl;
  }

  // Try alternative fields
  const alternatives = [
    artwork.images,
    artwork.thumbnail,
    artwork.preview_image
  ];

  for (const alt of alternatives) {
    const altUrl = extractFirstImageUrl(alt);
    if (altUrl && isValidImageUrl(altUrl)) {
      return altUrl;
    }
  }

  // Return fallback or default placeholder
  return fallbackUrl || 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop';
};