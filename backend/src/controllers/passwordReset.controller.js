/**
 * ============================================
 * PASSWORD RESET CONTROLLER
 * ============================================
 * Handle password reset requests
 */

import * as passwordResetService from '../services/passwordReset.service.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Request password reset for Admin/Sub-Admin
 * @route POST /api/auth/forgot-password
 */
export const requestAdminPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    await passwordResetService.requestAdminPasswordReset(email);
    
    // Always return success message for security (don't reveal if email exists)
    return successResponse(
      res,
      null,
      'If an account with that email exists, a password reset link has been sent.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password for Admin/Sub-Admin
 * @route POST /api/auth/reset-password
 */
export const resetAdminPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    
    await passwordResetService.resetAdminPassword(email, token, newPassword);
    
    return successResponse(
      res,
      null,
      'Password reset successful. You can now log in with your new password.'
    );
  } catch (error) {
    if (error.message === 'Invalid or expired reset token') {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Request password reset for Student (INACTIVE - Future use)
 * @route POST /api/students/forgot-password
 */
export const requestStudentPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    await passwordResetService.requestStudentPasswordReset(email);
    
    return successResponse(
      res,
      null,
      'If an account with that email exists, a password reset link has been sent.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password for Student (INACTIVE - Future use)
 * @route POST /api/students/reset-password
 */
export const resetStudentPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    
    await passwordResetService.resetStudentPassword(email, token, newPassword);
    
    return successResponse(
      res,
      null,
      'Password reset successful. You can now log in with your new password.'
    );
  } catch (error) {
    if (error.message === 'Invalid or expired reset token') {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};