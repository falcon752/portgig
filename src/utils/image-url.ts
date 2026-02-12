/**
 * Utility to handle portfolio image URLs
 * Converts production URLs to local URLs when running in development
 */

const PRODUCTION_API_URL = 'https://api.portgig.com';
const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5007';

/**
 * Converts image URLs from production to local when in development
 * @param imageUrl - The image URL from the database
 * @returns The corrected URL for the current environment
 */
export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '';
  
  // If the URL is from production and we're in development, convert it to local
  if (imageUrl.startsWith(PRODUCTION_API_URL)) {
    // Check if we're in development
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         process.env.NEXT_PUBLIC_API_URL?.includes('localhost');
    
    if (isDevelopment) {
      return imageUrl.replace(PRODUCTION_API_URL, LOCAL_API_URL);
    }
  }
  
  // If the URL is relative or already correct, return as-is
  return imageUrl;
}

/**
 * Checks if an image URL is valid and accessible
 * @param imageUrl - The image URL to check
 * @returns true if the URL appears valid
 */
export function isValidImageUrl(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false;
  
  const correctedUrl = getImageUrl(imageUrl);
  
  // Check if it's a valid URL format
  try {
    // Relative URLs are valid
    if (correctedUrl.startsWith('/')) return true;
    
    // Check absolute URLs
    new URL(correctedUrl);
    return true;
  } catch {
    return false;
  }
}
