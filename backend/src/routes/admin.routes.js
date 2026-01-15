/**
 * ============================================
 * ADMIN ROUTES
 * ============================================
 */

import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { createSubAdminSchema, changePasswordSchema } from '../validators/auth.validator.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin & Sub-Admin)
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * @route   PUT /api/admin/change-password
 * @desc    Change password
 * @access  Private (Admin & Sub-Admin)
 */
router.put('/change-password', validateBody(changePasswordSchema), adminController.changePassword);

// Sub-admin management (Admin only)
/**
 * @route   POST /api/admin/sub-admins
 * @desc    Create sub-admin
 * @access  Private (Admin only)
 */
router.post('/sub-admins', isAdmin, validateBody(createSubAdminSchema), adminController.createSubAdmin);

/**
 * @route   GET /api/admin/sub-admins
 * @desc    Get all sub-admins
 * @access  Private (Admin only)
 */
router.get('/sub-admins', isAdmin, adminController.getAllSubAdmins);

/**
 * @route   GET /api/admin/sub-admins/:id
 * @desc    Get sub-admin by ID
 * @access  Private (Admin only)
 */
router.get('/sub-admins/:id', isAdmin, adminController.getSubAdminById);

/**
 * @route   DELETE /api/admin/sub-admins/:id
 * @desc    Delete sub-admin
 * @access  Private (Admin only)
 */
router.delete('/sub-admins/:id', isAdmin, adminController.deleteSubAdmin);

export default router;