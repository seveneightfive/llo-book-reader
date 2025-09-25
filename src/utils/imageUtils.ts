// Utility function to handle image URLs that may have CORS issues
export function getProxiedImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  
  // Check if the image is from the problematic domain
  if (imageUrl.includes('my.lastinglegacyonline.com')) {
    // Convert to proxied URL for development
    const urlPath = imageUrl.replace('https://my.lastinglegacyonline.com', '');
    return `/image-proxy${urlPath}`;
  }
  
  // Return original URL for other domains
  return imageUrl;
}