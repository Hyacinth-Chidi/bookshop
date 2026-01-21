/**
 * ============================================
 * BOOK QUERY HOOKS
 * ============================================
 * TanStack Query hooks for book data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBooks, getBookById, getFilterOptions } from '@/lib/bookApi';
import { createBook, updateBook, deleteBook } from '@/lib/adminApi';
import toast from 'react-hot-toast';

// Query Keys (for easy invalidation)
export const bookKeys = {
  all: ['books'],
  lists: () => [...bookKeys.all, 'list'],
  list: (filters) => [...bookKeys.lists(), filters],
  details: () => [...bookKeys.all, 'detail'],
  detail: (id) => [...bookKeys.details(), id],
  filterOptions: () => [...bookKeys.all, 'filterOptions'],
};

/**
 * Fetch all books with filters
 */
export function useBooks(filters = {}, options = {}) {
  const { enabled = true, ...restOptions } = options;
  return useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: () => getAllBooks(filters),
    select: (data) => ({ books: data.data, pagination: data.pagination }),
    enabled: Boolean(enabled),
    ...restOptions,
  });
}

/**
 * Fetch single book by ID
 */
export function useBook(id) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBookById(id),
    enabled: !!id, // Only run if id exists
    select: (data) => data.data,
  });
}

/**
 * Fetch filter options (faculties, departments, levels, etc.)
 */
export function useFilterOptions() {
  return useQuery({
    queryKey: bookKeys.filterOptions(),
    queryFn: getFilterOptions,
    staleTime: 10 * 60 * 1000, // Cache for 10 mins (rarely changes)
    select: (data) => data.data,
  });
}

/**
 * Create book mutation
 */
export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => createBook(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      toast.success('Book created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create book');
    },
  });
}

/**
 * Update book mutation
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateBook(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) });
      toast.success('Book updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update book');
    },
  });
}

/**
 * Delete book mutation
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      toast.success('Book deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete book');
    },
  });
}
