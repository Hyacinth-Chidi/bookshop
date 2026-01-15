/**
 * ============================================
 * STUDENT CONTROLLER (INACTIVE - FUTURE FEATURE)
 * ============================================
 * Handles student operations
 * 
 * NOTE: This controller is built but NOT connected to routes
 * It will be activated when student features are needed
 */

import * as studentService from '../services/student.service.js';
import { 
  generateAccessToken, 
  generateRefreshToken,
  setAuthCookies 
} from '../utils/jwt.util.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Register student
 * @route POST /api/students/register
 */
export const registerStudent = async (req, res, next) => {
  try {
    const student = await studentService.registerStudent(req.body);
    return successResponse(res, student, 'Registration successful', 201);
  } catch (error) {
    if (error.message.includes('already')) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Student login
 * @route POST /api/students/login
 */
export const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await studentService.loginStudent(email, password);

    // Generate tokens
    const payload = {
      id: student.id,
      email: student.email,
      regNo: student.regNo,
      role: 'student',
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    return successResponse(res, { student }, 'Login successful');
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

/**
 * Get student profile
 * @route GET /api/students/profile
 */
export const getStudentProfile = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.user.id);
    return successResponse(res, student, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all students (Admin only)
 * @route GET /api/admin/students
 */
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    return successResponse(res, students, 'Students retrieved successfully');
  } catch (error) {
    next(error);
  }
};