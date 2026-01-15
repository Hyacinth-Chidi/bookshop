/**
 * ============================================
 * ADMIN AUTHENTICATION CONTEXT (ACTIVE)
 * ============================================
 * Manages admin and sub-admin authentication state
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, adminLogout, getCurrentAdmin } from '@/lib/adminApi';
import { handleApiError } from '@/lib/utils';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if admin is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentAdmin();
      setAdmin(response.data);
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await adminLogin(credentials);
      setAdmin(response.data.user);
      
      toast.success('Login successful!');
      router.push('/admin/dashboard');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
      setAdmin(null);
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
    isAdmin: admin?.role === 'admin',
    isSubAdmin: admin?.role === 'sub-admin',
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};