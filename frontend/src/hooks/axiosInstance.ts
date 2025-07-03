import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000, //   15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available (prioritize Clerk session token)
    const clerkToken = localStorage.getItem('clerk_session_token');
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    const token = clerkToken || authToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Also add as clerk_session_token header for backend compatibility
      if (clerkToken) {
        config.headers['clerk_session_token'] = clerkToken;
      }
    }

    // Add any other request modifications here
    console.log('Request sent:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      hasToken: !!token,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    console.log('Response received:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    });

    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    console.error('Response error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear all auth tokens and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('clerk_session_token');
      sessionStorage.removeItem('authToken');

      // You can dispatch a logout action or redirect here
      window.location.href = '/login';
      console.warn('Unauthorized access - tokens cleared, redirecting to login');
    }

    if (error.response?.status === 403) {
      // Forbidden
      console.warn('Forbidden access');
    }

    if (error.response?.status === 404) {
      // Not found
      console.warn('Resource not found');
    }

    if (error.response?.status && error.response.status >= 500) {
      // Server errors
      console.error('Server error occurred');
    }

    // Return the error for handling in components
    return Promise.reject(error);
  }
);

// Export the configured instance
export default axiosInstance;

// Optional: Export a function to update the base URL dynamically
export const updateBaseURL = (newBaseURL: string) => {
  axiosInstance.defaults.baseURL = newBaseURL;
};

// Optional: Export a function to set auth token (supports both types)
export const setAuthToken = (token: string, type: 'clerk' | 'jwt' = 'jwt') => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  if (type === 'clerk') {
    localStorage.setItem('clerk_session_token', token);
    axiosInstance.defaults.headers.common['clerk_session_token'] = token;
  } else {
    localStorage.setItem('authToken', token);
  }
};

// Set Clerk session token specifically
export const setClerkSessionToken = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axiosInstance.defaults.headers.common['clerk_session_token'] = token;
  localStorage.setItem('clerk_session_token', token);
};

// Optional: Export a function to clear all auth tokens
export const clearAuthToken = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
  delete axiosInstance.defaults.headers.common['clerk_session_token'];
  localStorage.removeItem('authToken');
  localStorage.removeItem('clerk_session_token');
  sessionStorage.removeItem('authToken');
};

// Optional: Export types for better TypeScript support
export type { AxiosResponse, AxiosError } from 'axios';
