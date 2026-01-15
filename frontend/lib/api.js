// Axios instance
/**
 * ============================================
 * API CONFIGURATION
 * ============================================
 * Axios instance with default configuration
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any necessary headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Backend response structure: { success, message, data, pagination? }
    // Return the full response object so frontend can access all parts
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't retry these endpoints - they handle their own auth
    const noRetryEndpoints = ['/auth/refresh', '/auth/login', '/auth/logout', '/auth/forgot-password', '/auth/reset-password'];
    const shouldSkipRetry = noRetryEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
    
    if (shouldSkipRetry) {
      return Promise.reject(error);
    }

    // If token expired, try to refresh (but only once)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - just reject without redirecting
        // Let the page handle 401 errors gracefully
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;