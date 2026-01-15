/**
 * ============================================
 * STUDENT ROUTES (INACTIVE - FUTURE FEATURE)
 * ============================================
 * 
 * NOTE: These routes are built but NOT connected to the main router
 * They will be activated when student features are needed
 */

import express from 'express';
import * as studentController from '../controllers/student.controller.js';
import * as passwordResetController from '../controllers/passwordReset.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { studentRegistrationSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema } from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route   POST /api/students/register
 * @desc    Register new student
 * @access  Public
 */
router.post('/register', validateBody(studentRegistrationSchema), studentController.registerStudent);

/**
 * @route   POST /api/students/login
 * @desc    Student login
 * @access  Public
 */
router.post('/login', validateBody(loginSchema), studentController.loginStudent);

/**
 * @route   POST /api/students/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validateBody(requestPasswordResetSchema), passwordResetController.requestStudentPasswordReset);

/**
 * @route   POST /api/students/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', validateBody(resetPasswordSchema), passwordResetController.resetStudentPassword);

/**
 * @route   GET /api/students/profile
 * @desc    Get student profile
 * @access  Private (Student)
 */
router.get('/profile', authenticate, studentController.getStudentProfile);

/**
 * @route   GET /api/students
 * @desc    Get all students (Admin only)
 * @access  Private (Admin)
 */
router.get('/', authenticate, isAdmin, studentController.getAllStudents);

export default router;s