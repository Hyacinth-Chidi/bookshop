/**
 * ============================================
 * ADMIN QUERY HOOKS
 * ============================================
 * TanStack Query hooks for admin data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardStats,
  getAllSubAdmins,
  createSubAdmin,
  deleteSubAdmin,
} from '@/lib/adminApi';
import toast from 'react-hot-toast';

// Query Keys
export const adminKeys = {
  all: ['admin'],
  stats: () => [...adminKeys.all, 'stats'],
  subAdmins: () => [...adminKeys.all, 'subAdmins'],
};

/**
 * Fetch dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: getDashboardStats,
    select: (data) => data.data,
  });
}

/**
 * Fetch all sub-admins
 */
export function useSubAdmins() {
  return useQuery({
    queryKey: adminKeys.subAdmins(),
    queryFn: getAllSubAdmins,
    select: (data) => data.data,
  });
}

/**
 * Create sub-admin mutation
 */
export function useCreateSubAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubAdmin,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subAdmins() });
      toast.success('Sub-admin created successfully');
      if (response.data?.temporaryPassword) {
        toast.success(
          `Temporary password: ${response.data.temporaryPassword}`,
          { duration: 10000 }
        );
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to create sub-admin'
      );
    },
  });
}

/**
 * Delete sub-admin mutation
 */
export function useDeleteSubAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.subAdmins() });
      toast.success('Sub-admin deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete sub-admin');
    },
  });
}
