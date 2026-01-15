/**
 * ============================================
 * INPUT SANITIZATION UTILITY
 * ============================================
 * Prevent XSS attacks and clean user input
 */

/**
 * Sanitize string input - removes HTML tags and dangerous characters
 * @param {string} input - User input
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove dangerous characters
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
  
  return sanitized;
};

//Sanitize object - recursively sanitize all string values
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

/**
 * Sanitize email - ensure valid email format
 * @param {string} email - Email address
 * @returns {string} Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w\s@.\-+]/g, ''); // Keep only valid email characters
};

/**
 * Sanitize HTML for rich text (if needed in future)
 * @param {string} html - HTML content
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return html;
  
  // For now, strip all HTML. In future, you can use a library like DOMPurify
  return html.replace(/<[^>]*>/g, '').trim();
};