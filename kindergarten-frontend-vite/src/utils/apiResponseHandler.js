/**
 * Utility function to extract data from API responses
 * Handles different common response formats:
 * - { data: [...] }
 * - { students: [...] }
 * - { staff: [...] }
 * - [...]
 * @param {Object|Array} response - The API response object or array
 * @returns {Array} The extracted data array
 */
export const extractDataFromResponse = (response) => {
  // If response is undefined or null, return empty array
  if (!response) {
    return [];
  }

  // If response.data exists and is an array, return it
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }

  // If response.data is an object, check for nested data arrays
  if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    // Look for common data array property names
    const possibleDataProps = ['data', 'students', 'staff', 'list', 'items', 'results'];
    
    for (const prop of possibleDataProps) {
      if (response.data[prop] && Array.isArray(response.data[prop])) {
        return response.data[prop];
      }
    }
  }

  // If response itself is an array, return it
  if (Array.isArray(response)) {
    return response;
  }

  // If response.data is an array directly (not nested in another data prop)
  if (Array.isArray(response)) {
    return response;
  }

  // If none of the above, return empty array
  return [];
};

/**
 * Utility function to safely extract data from API responses
 * This version also handles error cases gracefully
 * @param {Object} response - The full API response object
 * @param {string} fallbackProp - Optional fallback property name to extract data from
 * @returns {Array} The extracted data array or empty array if extraction fails
 */
export const safeExtractData = (response, fallbackProp = null) => {
  try {
    return extractDataFromResponse(response);
  } catch (error) {
    console.warn('Error extracting data from API response:', error);
    // If extraction fails, try fallback property if provided
    if (fallbackProp && response && response[fallbackProp] && Array.isArray(response[fallbackProp])) {
      return response[fallbackProp];
    }
    return [];
  }
};

/**
 * Generates a consistent color variant based on an ID
 * Uses a fixed palette of colors to ensure the same ID always gets the same color
 * @param {number|string} id - The ID to use for color assignment
 * @returns {string} A color variant name from the fixed palette
 */
export const getColorVariantById = (id) => {
  if (id === null || id === undefined || id === '') {
    return 'default';
  }

  // Fixed color palette
  const colorVariants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ];

  // Convert ID to a number if it's a string
  const numericId = Number(id);

  if (isNaN(numericId)) {
    // If it's not a numeric ID, fall back to string-based hashing
    let hash = 0;
    const str = String(id);
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorVariants.length;
    return colorVariants[index];
  }

  // Use the numeric ID to select a color from the palette
  const index = Math.abs(numericId) % colorVariants.length;
  return colorVariants[index];
};

/**
 * Normalizes a name to have the first letter capitalized (Title Case)
 * Handles names with multiple words and accents (e.g., "juan pérez" -> "Juan Pérez")
 * @param {string} name - The name to normalize
 * @returns {string} The normalized name with first letter capitalized
 */
export const normalizeName = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  // Convertir a minúsculas y luego capitalizar la primera letra de cada palabra
  return name.toLowerCase()
    .replace(/(^\w)|(\s+\w)/g, match => match.toUpperCase());
};