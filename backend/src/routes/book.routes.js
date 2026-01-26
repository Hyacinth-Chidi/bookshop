import express from 'express';
import * as bookController from '../controllers/book.controller.js';
import { authenticate, isAdminOrSubAdmin } from '../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../middlewares/validation.middleware.js';
import { createBookSchema, updateBookSchema, bookSearchSchema } from '../validators/book.validator.js';
import { bookUploadFields } from '../utils/upload.util.js';

const router = express.Router();

/**
 * PUBLIC ROUTES (No authentication required)
 */

/**
 * @route   GET /api/books/filters/options
 * @desc    Get filter options for search
 * @access  Public
 */
router.get('/filters/options', bookController.getFilterOptions);

/**
 * @route   GET /api/books/report
 * @desc    Get all books for report (no limit)
 * @access  Public
 */
router.get('/report', bookController.getReportBooks);

/**
 * @route   GET /api/books
 * @desc    Get all books with search and filters
 * @access  Public
 */
router.get('/', validateQuery(bookSearchSchema), bookController.getAllBooks);

/**
 * @route   GET /api/books/:id
 * @desc    Get book by ID
 * @access  Public
 */
router.get('/:id', bookController.getBookById);

/**
 * PROTECTED ROUTES (Admin & Sub-Admin only)
 */

/**
 * @route   POST /api/books
 * @desc    Create new book
 * @access  Private (Admin & Sub-Admin)
 */
router.post(
  '/',
  authenticate,
  isAdminOrSubAdmin,
  bookUploadFields,
  validateBody(createBookSchema),
  bookController.createBook
);

/**
 * @route   PUT /api/books/:id
 * @desc    Update book
 * @access  Private (Admin & Sub-Admin)
 */
router.put(
  '/:id',
  authenticate,
  isAdminOrSubAdmin,
  bookUploadFields,
  validateBody(updateBookSchema),
  bookController.updateBook
);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete book
 * @access  Private (Admin & Sub-Admin)
 */
router.delete('/:id', authenticate, isAdminOrSubAdmin, bookController.deleteBook);

export default router;