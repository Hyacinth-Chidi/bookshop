/**
 * ============================================
 * FACULTY CONTROLLER
 * ============================================
 * Request handlers for faculty and department operations
 */

import * as facultyService from '../services/faculty.service.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Get all faculties
 */
export const getFaculties = async (req, res) => {
    try {
        const faculties = await facultyService.getAllFaculties();
        return successResponse(res, faculties, 'Faculties retrieved', 200);
    } catch (error) {
        return errorResponse(res, 'Error retrieving faculties', 500, error.message);
    }
};

/**
 * Create a new faculty
 */
export const createFaculty = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return errorResponse(res, 'Faculty name is required', 400);
        }

        const faculty = await facultyService.createFaculty(name);
        return successResponse(res, faculty, 'Faculty created', 201);
    } catch (error) {
        if (error.message === 'Faculty already exists') {
            return errorResponse(res, error.message, 400);
        }
        return errorResponse(res, 'Error creating faculty', 500, error.message);
    }
};

/**
 * Delete a faculty
 */
export const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        await facultyService.deleteFaculty(id);
        return successResponse(res, null, 'Faculty deleted successfully', 200);
    } catch (error) {
        return errorResponse(res, 'Error deleting faculty', 500, error.message);
    }
};

/**
 * Create a new department
 */
export const createDepartment = async (req, res) => {
    try {
        const { name, facultyId } = req.body;

        if (!name || !facultyId) {
            return errorResponse(res, 'Department name and faculty ID are required', 400);
        }

        const department = await facultyService.createDepartment(name, facultyId);
        return successResponse(res, department, 'Department created', 201);
    } catch (error) {
        if (error.message === 'Department already exists in this faculty') {
            return errorResponse(res, error.message, 400);
        }
        return errorResponse(res, 'Error creating department', 500, error.message);
    }
};

/**
 * Delete a department
 */
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        await facultyService.deleteDepartment(id);
        return successResponse(res, null, 'Department deleted successfully', 200);
    } catch (error) {
        return errorResponse(res, 'Error deleting department', 500, error.message);
    }
};
