/**
 * ============================================
 * AUTHENTICATION CONTROLLER
 * ============================================
 * Handles login, logout, and token refresh
 */

import prisma from '../config/database.js';
import { comparePassword } from '../utils/password.util.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies 
} from '../utils/jwt.util.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Admin/Sub-Admin Login
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return errorResponse(res, 'Invalid username or password', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid username or password', 401);
    }

    // Generate tokens
    const payload = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Send response
    return successResponse(
      res,
      {
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 * @route POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    clearAuthCookies(res);
    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return errorResponse(res, 'Refresh token required', 401);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Generate new access token
    const payload = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = generateAccessToken(payload);

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return successResponse(res, null, 'Token refreshed successfully');
  } catch (error) {
    clearAuthCookies(res);
    return errorResponse(res, 'Invalid or expired refresh token', 401);
  }
};

/**
 * Get current user
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, admin, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};