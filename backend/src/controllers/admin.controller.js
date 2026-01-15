
// Handles admin-specific operations


import * as adminService from '../services/admin.service.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Create sub-admin
 * POST /api/admin/sub-admins
 */
export const createSubAdmin = async (req, res, next) => {
  try {
    const result = await adminService.createSubAdmin(req.body);

    return successResponse(
      res,
      result,
      'Sub-admin created successfully. Credentials sent via email.',
      201
    );
  } catch (error) {
    if (error.message.includes('already exists')) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Get all sub-admins
 * GET /api/admin/sub-admins
 */
export const getAllSubAdmins = async (req, res, next) => {
  try {
    const subAdmins = await adminService.getAllSubAdmins();
    return successResponse(res, subAdmins, 'Sub-admins retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get sub-admin by ID
 * GET /api/admin/sub-admins/:id
 */
export const getSubAdminById = async (req, res, next) => {
  try {
    const subAdmin = await adminService.getSubAdminById(req.params.id);
    return successResponse(res, subAdmin, 'Sub-admin retrieved successfully');
  } catch (error) {
    if (error.message === 'Sub-admin not found' || error.message === 'This is not a sub-admin account') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Delete sub-admin
 *  DELETE /api/admin/sub-admins/:id
 */
export const deleteSubAdmin = async (req, res, next) => {
  try {
    await adminService.deleteSubAdmin(req.params.id);
    return successResponse(res, null, 'Sub-admin deleted successfully');
  } catch (error) {
    if (error.message === 'Sub-admin not found' || error.message === 'Cannot delete admin account') {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Change password
 * @route PUT /api/admin/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await adminService.changePassword(req.user.id, currentPassword, newPassword);
    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    if (error.message === 'Current password is incorrect') {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Get dashboard statistics
 * @route GET /api/admin/dashboard/stats
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};