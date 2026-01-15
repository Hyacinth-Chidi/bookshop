// Student API calls (INACTIVE)
/**
 * ============================================
 * STUDENT API CALLS (INACTIVE - FUTURE USE)
 * ============================================
 * Student-related API functions
 * 
 * NOTE: Complete implementation ready to activate
 */

import api from './api';

// ============================================
// AUTHENTICATION
// ============================================

export const studentRegister = async (data) => {
  return await api.post('/students/register', data);
};

export const studentLogin = async (credentials) => {
  return await api.post('/students/login', credentials);
};

export const getCurrentStudent = async () => {
  return await api.get('/students/profile');
};

export const requestStudentPasswordReset = async (email) => {
  return await api.post('/students/forgot-password', { email });
};

export const resetStudentPassword = async (data) => {
  return await api.post('/students/reset-password', data);
};

// ============================================
// PURCHASES (INACTIVE)
// ============================================

export const initializePurchase = async (data) => {
  return await api.post('/purchases/initialize', data);
};

export const verifyPurchase = async (reference) => {
  return await api.get(`/purchases/verify/${reference}`);
};

export const getMyPurchases = async () => {
  return await api.get('/purchases/my-purchases');
};