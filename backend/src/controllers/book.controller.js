
//Handles book CRUD operations
 

import * as bookService from '../services/book.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util.js';

/**
  Create book
  POST /api/books (Admin/Sub-Admin only)
 */
export const createBook = async (req, res, next) => {
  try {
    const book = await bookService.createBook(req.body, req.files);
    return successResponse(res, book, 'Book created successfully', 201);
  } catch (error) {
    if (error.message.includes('required')) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Get all books (Public & Admin)
 * @route GET /api/books
 */
export const getAllBooks = async (req, res, next) => {
  try {
    const result = await bookService.getAllBooks(req.query);
    
    return paginatedResponse(
      res,
      result.books,
      result.pagination,
      'Books retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get book by ID (Public & Admin)
 * @route GET /api/books/:id
 */
export const getBookById = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    return successResponse(res, book, 'Book retrieved successfully');
  } catch (error) {
    if (error.message === 'Book not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Update book
 * @route PUT /api/books/:id (Admin/Sub-Admin only)
 */
export const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body, req.files);
    return successResponse(res, book, 'Book updated successfully');
  } catch (error) {
    if (error.message === 'Book not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Delete book
 * @route DELETE /api/books/:id (Admin/Sub-Admin only)
 */
export const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id);
    return successResponse(res, null, 'Book deleted successfully');
  } catch (error) {
    if (error.message === 'Book not found') {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

/**
 * Get filter options
 * @route GET /api/books/filters/options (Public)
 */
export const getFilterOptions = async (req, res, next) => {
  try {
    const options = await bookService.getFilterOptions();
    return successResponse(res, options, 'Filter options retrieved successfully');
  } catch (error) {
    next(error);
  }
};
/**
 * Get all books for report (no limit)
 * @route GET /api/books/report (Public)
 */
export const getReportBooks = async (req, res, next) => {
  try {
    const result = await bookService.getReportBooks(req.query);
    return successResponse(res, result, 'Report books retrieved successfully');
  } catch (error) {
    next(error);
  }
};
