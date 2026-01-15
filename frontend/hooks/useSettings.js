/**
 * ============================================
 * SETTINGS QUERY HOOKS
 * ============================================
 * TanStack Query hooks for system settings, faculties, and departments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSystemSettings,
  updateSystemSettings,
  getFaculties,
  createFaculty,
  deleteFaculty,
  createDepartment,
  deleteDepartment,
} from '@/lib/settingsApi';
import toast from 'react-hot-toast';
import { facultyKeys } from './useFaculties';

// Query Keys
export const settingsKeys = {
  all: ['settings'],
  system: () => [...settingsKeys.all, 'system'],
};

/**
 * Fetch system settings (session, semester)
 */
export function useSystemSettings() {
  return useQuery({
    queryKey: settingsKeys.system(),
    queryFn: getSystemSettings,
    select: (data) => data.data,
  });
}

/**
 * Update system settings mutation
 */
export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: (response) => {
      queryClient.setQueryData(settingsKeys.system(), { data: response.data });
      toast.success('System settings updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
}

/**
 * Create faculty mutation
 */
export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      toast.success('Faculty created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create faculty');
    },
  });
}

/**
 * Delete faculty mutation
 */
export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      toast.success('Faculty deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete faculty');
    },
  });
}

/**
 * Create department mutation
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      toast.success('Department created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create department');
    },
  });
}

/**
 * Delete department mutation
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facultyKeys.all });
      toast.success('Department deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    },
  });
}
