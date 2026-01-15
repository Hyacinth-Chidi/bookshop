/**
 * ============================================
 * AUTHENTICATION MIDDLEWARE
 * ============================================
 * JWT authentication and authorization
 */

import { verifyAccessToken } from '../utils/jwt.util.js';
import { errorResponse } from '../utils/response.util.js';

/**
 * Verify if user is authenticated
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

/**
 * Verify if user is admin (not sub-admin)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied. Admin privileges required.', 403);
    }
    next();
  } catch (error) {
    return errorResponse(res, 'Authorization failed', 403);
  }
};

/**
 * Verify if user is admin or sub-admin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const isAdminOrSubAdmin = async (req, res, next) => {
  try {
    if (!['admin', 'sub-admin'].includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Admin or Sub-Admin privileges required.', 403);
    }
    next();
  } catch (error) {
    return errorResponse(res, 'Authorization failed', 403);
  }
};