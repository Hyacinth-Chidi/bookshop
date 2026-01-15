/**
 * ============================================
 * ADMIN SERVICE
 * ============================================
 * Business logic for admin operations
 */

import prisma from '../config/database.js';
import logger from '../utils/logger.util.js';
import { hashPassword, comparePassword, generateRandomPassword } from '../utils/password.util.js';
import { sendSubAdminWelcomeEmail } from '../config/email.js';

/**
 * Create a new sub-admin
 * @param {Object} data - Sub-admin data
 * @returns {Promise<Object>} Created sub-admin
 */
export const createSubAdmin = async (data) => {
  const { username, email } = data;

  // Check if username or email already exists
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingAdmin) {
    if (existingAdmin.username === username) {
      throw new Error('Username already exists');
    }
    if (existingAdmin.email === email) {
      throw new Error('Email already exists');
    }
  }

  // Generate random password
  const temporaryPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(temporaryPassword);

  // Create sub-admin
  const subAdmin = await prisma.admin.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: 'sub-admin',
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Send welcome email with credentials
  try {
    await sendSubAdminWelcomeEmail(email, username, temporaryPassword);
  } catch (error) {
    logger.error('Failed to send welcome email:', error.message);
    // Don't throw error - sub-admin is created successfully
  }

  return {
    subAdmin,
    temporaryPassword, // Return for admin to see
  };
};

/**
 * Get all sub-admins
 * @returns {Promise<Array>} List of sub-admins
 */
export const getAllSubAdmins = async () => {
  return await prisma.admin.findMany({
    where: {
      role: 'sub-admin',
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Get sub-admin by ID
 * @param {string} id - Sub-admin ID
 * @returns {Promise<Object>} Sub-admin data
 */
export const getSubAdminById = async (id) => {
  const subAdmin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!subAdmin) {
    throw new Error('Sub-admin not found');
  }

  if (subAdmin.role !== 'sub-admin') {
    throw new Error('This is not a sub-admin account');
  }

  return subAdmin;
};

/**
 * Delete sub-admin
 * @param {string} id - Sub-admin ID
 * @returns {Promise<void>}
 */
export const deleteSubAdmin = async (id) => {
  const subAdmin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!subAdmin) {
    throw new Error('Sub-admin not found');
  }

  if (subAdmin.role !== 'sub-admin') {
    throw new Error('Cannot delete admin account');
  }

  await prisma.admin.delete({
    where: { id },
  });
};

/**
 * Change admin password
 * @param {string} adminId - Admin ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changePassword = async (adminId, currentPassword, newPassword) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    throw new Error('Admin not found');
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, admin.password);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash and update new password
  const hashedPassword = await hashPassword(newPassword);
  await prisma.admin.update({
    where: { id: adminId },
    data: { password: hashedPassword },
  });
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  const [totalBooks, totalSubAdmins, inStockBooks, outOfStockBooks] = await Promise.all([
    prisma.book.count(),
    prisma.admin.count({ where: { role: 'sub-admin' } }),
    prisma.book.count({ where: { quantity: { gt: 0 } } }),
    prisma.book.count({ where: { quantity: { lte: 0 } } }),
  ]);

  return {
    totalBooks,
    totalSubAdmins,
    inStockBooks,
    outOfStockBooks,
  };
};