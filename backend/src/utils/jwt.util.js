/**
 * ============================================
 * JWT UTILITY FUNCTIONS
 * ============================================
 * Token generation and verification
 */

import jwt from 'jsonwebtoken';

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @returns {string} Access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

// Verify access token
 
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

//Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Set authentication cookies
 * @param {Object} res - Express response object
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Access token cookie (15 minutes)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction, // Must be true if sameSite='none'
    sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-site
    path: '/', // Explicit path for Safari compatibility
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Clear authentication cookies
 
export const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Must use same options as when setting cookies for iOS Safari compatibility
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
