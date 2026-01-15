
import express from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
import * as facultyController from '../controllers/faculty.controller.js';

const router = express.Router();

// ==========================================
// FACULTY ROUTES
// ==========================================

// Get all faculties (with departments)
router.get('/', authenticate, facultyController.getFaculties);

// Create Faculty (Admin Only)
router.post('/', authenticate, isAdmin, facultyController.createFaculty);

// Delete Faculty (Admin Only)
router.delete('/:id', authenticate, isAdmin, facultyController.deleteFaculty);

// ==========================================
// DEPARTMENT ROUTES
// ==========================================

// Create Department (Admin Only)
router.post('/departments', authenticate, isAdmin, facultyController.createDepartment);

// Delete Department (Admin Only)
router.delete('/departments/:id', authenticate, isAdmin, facultyController.deleteDepartment);

export default router;
