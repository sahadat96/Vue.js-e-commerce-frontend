
export const getImageUrl = (path) => {
  // Get backend URL from environment variables with fallback
  const backendUrl = import.meta.env.VITE_BACKEND_URL ;
  
  try {
    // Use URL constructor for proper path normalization
    return new URL(path, backendUrl).toString();
  } catch (error) {
    // Fallback in case of invalid URL
    console.error('Error creating image URL:', error);
    return `${backendUrl}/${path.startsWith('/') ? path.substring(1) : path}`;
  }
};


// export const getImageUrlWithFallback = (path, fallback = 'assets/images/placeholder.jpg') => {
//   if (!path) return getImageUrl(fallback);
//   return getImageUrl(path);
// };
