/**
 * ============================================
 * AUTHENTICATION VALIDATORS
 * ============================================
 * Zod schemas for auth-related validations
 */

import { z } from 'zod';

/**
 * Admin login validation schema
 */
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .trim(),
  password: z.string()
    .min(1, 'Password is required'),
});

/**
 * Create sub-admin validation schema
 */
export const createSubAdminSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character'),
});

/**
 * Request password reset validation schema
 */
export const requestPasswordResetSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  token: z.string()
    .min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

/**
 * Student registration validation schema (INACTIVE - Future use)
 */
export const studentRegistrationSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  regNo: z.string()
    .min(5, 'Registration number must be at least 5 characters')
    .trim()
    .toUpperCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  level: z.string()
    .regex(/^\d{3}L$/, 'Level must be in format: 100L, 200L, etc.')
    .trim(),
});