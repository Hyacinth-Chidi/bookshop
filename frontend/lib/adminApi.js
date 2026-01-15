/**
 * ============================================
 * ADMIN API CALLS (ACTIVE)
 * ============================================
 * Admin and sub-admin related API functions
 */

import api from './api';

// ============================================
// AUTHENTICATION
// ============================================

export const adminLogin = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const adminLogout = async () => {
  return await api.post('/auth/logout');
};

export const getCurrentAdmin = async () => {
  return await api.get('/auth/me');
};

export const requestPasswordReset = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (data) => {
  return await api.post('/auth/reset-password', data);
};

export const changePassword = async (data) => {
  return await api.put('/admin/change-password', data);
};

// ============================================
// DASHBOARD
// ============================================

export const getDashboardStats = async () => {
  return await api.get('/admin/dashboard/stats');
};

// ============================================
// BOOKS MANAGEMENT
// ============================================

export const createBook = async (formData) => {
  return await api.post('/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateBook = async (id, formData) => {
  return await api.put(`/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteBook = async (id) => {
  return await api.delete(`/books/${id}`);
};

// ============================================
// SUB-ADMINS MANAGEMENT (Admin Only)
// ============================================

export const getAllSubAdmins = async () => {
  return await api.get('/admin/sub-admins');
};

export const createSubAdmin = async (data) => {
  return await api.post('/admin/sub-admins', data);
};

export const deleteSubAdmin = async (id) => {
  return await api.delete(`/admin/sub-admins/${id}`);
};