
// Zod validation middleware for request validation
 

import logger from '../utils/logger.util.js';
import { errorResponse } from '../utils/response.util.js';
import { deleteFile } from '../utils/upload.util.js';

/**
 * Validate request body against Zod schema
 * @param {Object} schema - Zod schema
 * @returns {Function} Express middleware
 */
export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      // Clean up any uploaded files if validation fails
      try {
        if (req.files) {
          // req.files is an object where each key maps to an array of files
          Object.values(req.files).forEach((fileArray) => {
            fileArray.forEach((f) => {
              if (f && f.path) deleteFile(f.path);
            });
          });
        }
        // Also handle single-file case (req.file)
        if (req.file && req.file.path) deleteFile(req.file.path);
      } catch (cleanupError) {
        // Log and continue
        logger.error('Error cleaning uploaded files after validation failure:', cleanupError.message);
      }

      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(res, 'Validation failed', 400, errors);
    }
  };
};

/**
 * Validate request query against Zod schema
 * @param {Object} schema - Zod schema
 * @returns {Function} Express middleware
 */
export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated;
      next();
    } catch (error) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(res, 'Validation failed', 400, errors);
    }
  };
};

/**
 * Validate request params against Zod schema
 * @param {Object} schema - Zod schema
 * @returns {Function} Express middleware
 */
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.params);
      req.params = validated;
      next();
    } catch (error) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(res, 'Validation failed', 400, errors);
    }
  };
};