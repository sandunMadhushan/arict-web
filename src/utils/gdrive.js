/**
 * Converts a Google Drive sharing URL into a direct embed/image URL.
 * Supports multiple common formats of Drive URLs.
 * 
 * @param {string} url - The Google Drive sharing URL
 * @returns {string|null} - The direct embed URL, or null if invalid
 */
export function getDriveEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Try to match standard file ID patterns
  let fileId = null;
  
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view
  const dMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    fileId = dMatch[1];
  } 
  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  else if (url.includes('id=')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    fileId = urlParams.get('id');
  }

  if (fileId) {
    // This is the most reliable format for embedding Drive images directly
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
    // Alternative: https://lh3.googleusercontent.com/d/${fileId}
  }
  
  return null;
}

/**
 * Validates if a given URL is a Google Drive link
 */
export function isDriveUrl(url) {
  return typeof url === 'string' && url.includes('drive.google.com');
}
