/**
 * ============================================
 * SANITIZATION MIDDLEWARE
 * ============================================
 * Automatically sanitize all incoming request data
 */

import { sanitizeObject } from '../utils/sanitize.util.js';

/**
 * Sanitize request body, query, and params
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};