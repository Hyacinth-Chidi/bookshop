/**
 * ============================================
 * STUDENT AUTHENTICATION CONTEXT (INACTIVE)
 * ============================================
 * Manages student authentication state
 * 
 * NOTE: Complete implementation ready to activate
 * To activate: Uncomment in app/layout.jsx
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { studentLogin, getCurrentStudent } from '@/lib/studentApi';
import { handleApiError } from '@/lib/utils';
import toast from 'react-hot-toast';

const StudentAuthContext = createContext();

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within StudentAuthProvider');
  }
  return context;
};

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if student is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentStudent();
      setStudent(response.data);
    } catch (error) {
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await studentLogin(credentials);
      setStudent(response.data.student);
      toast.success('Login successful!');
      router.push('/student/dashboard');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Logout API call if needed
      setStudent(null);
      toast.success('Logged out successfully');
      router.push('/student/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const register = async (data) => {
    try {
      const { studentRegister } = await import('@/lib/studentApi');
      const response = await studentRegister(data);
      toast.success('Registration successful! Please login.');
      router.push('/student/login');
      return { success: true };
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    student,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!student,
  };

  return (
    <StudentAuthContext.Provider value={value}>
      {children}
    </StudentAuthContext.Provider>
  );
};