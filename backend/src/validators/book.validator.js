
import { z } from 'zod';

/**
 * Create book validation schema
 */
export const createBookSchema = z.object({
  title: z.string()
    .min(1, 'Book title is required')
    .max(200, 'Book title must not exceed 200 characters')
    .trim(),
  description: z.string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional(),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Price must be greater than 0'),
  courseCode: z.string()
    .min(1, 'Course code is required')
    .max(20, 'Course code must not exceed 20 characters')
    .trim()
    .toUpperCase(),
  departmentId: z.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid Department ID (UUID expected)')
    .optional(),
  facultyId: z.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid Faculty ID (UUID expected)'),
  level: z.enum(['100L', '200L', '300L', '400L', '500L'], {
    errorMap: () => ({ message: 'Level must be one of: 100L, 200L, 300L, 400L, 500L' }),
  }),
  semester: z.enum(['First Semester', 'Second Semester'], {
    errorMap: () => ({ message: 'Semester must be either "First Semester" or "Second Semester"' }),
  }),
  session: z.string()
    .regex(/^\d{4}\/\d{4}$/, 'Session must be in format: 2025/2026')
    .trim(),
  courseLecturer: z.string()
    .trim()
    .optional(),
  hasManual: z.string()
    .transform((val) => val === 'true')
    .optional(),
  manualPrice: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Price must be greater than 0')
    .optional(),
  quantity: z.string()
    .regex(/^\d+$/, 'Quantity must be a valid integer')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, 'Quantity cannot be negative')
    .optional(),

});

/**
 * Update book validation schema (all fields optional)
 */
export const updateBookSchema = z.object({
  title: z.string()
    .min(1, 'Book title cannot be empty')
    .max(200, 'Book title must not exceed 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional(),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Price must be greater than 0')
    .optional(),
  courseCode: z.string()
    .min(1, 'Course code cannot be empty')
    .max(20, 'Course code must not exceed 20 characters')
    .trim()
    .toUpperCase()
    .optional(),
  departmentId: z.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid Department ID (UUID expected)')
    .optional(),
  facultyId: z.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid Faculty ID (UUID expected)')
    .optional(),
  level: z.enum(['100L', '200L', '300L', '400L', '500L'])
    .optional(),
  semester: z.enum(['First Semester', 'Second Semester'])
    .optional(),
  session: z.string()
    .regex(/^\d{4}\/\d{4}$/, 'Session must be in format: 2025/2026')
    .optional(),
  courseLecturer: z.string()
    .trim()
    .optional(),
  hasManual: z.string()
    .transform((val) => val === 'true')
    .optional(),
  manualPrice: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Price must be greater than 0')
    .optional(),

  quantity: z.string()
    .regex(/^\d+$/, 'Quantity must be a valid integer')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, 'Quantity cannot be negative')
    .optional(),
});

/**
 * Book search/filter query validation
 */
export const bookSearchSchema = z.object({
  search: z.string()
    .max(100, 'Search query must not exceed 100 characters')
    .trim()
    .optional(),
  courseCode: z.string().trim().toUpperCase().optional(),
  departmentId: z.string().optional().transform(val => val === '' ? undefined : val).pipe(z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).optional()),
  facultyId: z.string().optional().transform(val => val === '' ? undefined : val).pipe(z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i).optional()),
  level: z.string().regex(/^\d{3}L$/).trim().optional(),
  semester: z.enum(['First Semester', 'Second Semester']).optional(),
  session: z.string().regex(/^\d{4}\/\d{4}$/).trim().optional(),
  hasManual: z.string().transform((val) => val === 'true').optional(),
  inStock: z.string().transform((val) => val === 'true').optional(),

  page: z.string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(1, 'Page must be at least 1'))
    .optional()
    .default('1'),
  limit: z.string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must not exceed 100'))
    .optional()
    .default('20'),
});