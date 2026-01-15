/**
 * ============================================
 * AUTHENTICATION ROUTES
 * ============================================
 */

import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as passwordResetController from '../controllers/passwordReset.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { loginSchema, requestPasswordResetSchema, resetPasswordSchema } from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Admin/Sub-Admin login
 * @access  Public
 */
router.post('/login', validateBody(loginSchema), authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validateBody(requestPasswordResetSchema), passwordResetController.requestAdminPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', validateBody(resetPasswordSchema), passwordResetController.resetAdminPassword);

export default router;