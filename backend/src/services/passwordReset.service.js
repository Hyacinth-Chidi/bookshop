/**
 * ============================================
 * PASSWORD RESET SERVICE
 * ============================================
 * Handle password reset for Admin/Sub-Admin and Students
 */

import prisma from '../config/database.js';
import { hashPassword, generateRandomPassword } from '../utils/password.util.js';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../config/email.js';
import crypto from 'crypto';

/**
 * Generate password reset token
 * @returns {Object} Token and expiry
 */
const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  return { token, hashedToken, expiry };
};

/**
 * Request password reset for Admin/Sub-Admin
 * @param {string} email - Admin email
 * @returns {Promise<void>}
 */
export const requestAdminPasswordReset = async (email) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    // Don't reveal if email exists for security
    return;
  }

  // Generate reset token
  const { token, hashedToken, expiry } = generateResetToken();

  // Store hashed token and expiry in database
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: expiry,
    },
  });

  // Send reset email with token
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;
  await sendPasswordResetEmail(email, admin.username, resetUrl);
};

/**
 * Reset password for Admin/Sub-Admin
 * @param {string} email - Admin email
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const resetAdminPassword = async (email, token, newPassword) => {
  // Hash the token to match stored version
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const admin = await prisma.admin.findFirst({
    where: {
      email,
      resetToken: hashedToken,
      resetTokenExpiry: {
        gt: new Date(), // Token not expired
      },
    },
  });

  if (!admin) {
    throw new Error('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  // Send confirmation email
  await sendPasswordResetSuccessEmail(email, admin.username);
};

/**
 * Request password reset for Student (INACTIVE - Future use)
 * @param {string} email - Student email
 * @returns {Promise<void>}
 */
export const requestStudentPasswordReset = async (email) => {
  const student = await prisma.student.findUnique({
    where: { email },
  });

  if (!student) {
    // Don't reveal if email exists for security
    return;
  }

  // Generate reset token
  const { token, hashedToken, expiry } = generateResetToken();

  // Store hashed token and expiry in database
  await prisma.student.update({
    where: { id: student.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: expiry,
    },
  });

  // Send reset email with token
  const resetUrl = `${process.env.FRONTEND_URL}/student/reset-password?token=${token}&email=${email}`;
  await sendPasswordResetEmail(email, student.regNo, resetUrl);
};

/**
 * Reset password for Student (INACTIVE - Future use)
 * @param {string} email - Student email
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const resetStudentPassword = async (email, token, newPassword) => {
  // Hash the token to match stored version
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const student = await prisma.student.findFirst({
    where: {
      email,
      resetToken: hashedToken,
      resetTokenExpiry: {
        gt: new Date(), // Token not expired
      },
    },
  });

  if (!student) {
    throw new Error('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password and clear reset token
  await prisma.student.update({
    where: { id: student.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  // Send confirmation email
  await sendPasswordResetSuccessEmail(email, student.regNo);
};