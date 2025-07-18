// lib/auth.js - WordPress JWT Authentication
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

// Create axios instance for WordPress auth
export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/wp-json`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A simple utility to strip HTML tags from a string.
 * @param {string} html The string containing HTML.
 * @returns {string} The cleaned string.
 */
const stripHtml = (html) => {
  if (typeof html !== 'string') return html;
  return html.replace(/<[^>]*>?/gm, '');
};

export const auth = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await authApi.post('/jwt-auth/v1/token', {
        username,
        password,
      });
      
      const { token, user_email, user_nicename, user_display_name } = response.data;
      
      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify({
          email: user_email,
          username: user_nicename,
          displayName: user_display_name,
        }));
      }
      
      return {
        success: true,
        token,
        user: {
          email: user_email,
          username: user_nicename,
          displayName: user_display_name,
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      // Extract and clean the error message from the API response
      const rawMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      const cleanMessage = stripHtml(rawMessage);
      return {
        success: false,
        error: cleanMessage
      };
    }
  },

  // Register new user
  register: async (username, email, password, firstName = '', lastName = '') => {
    try {
      const response = await authApi.post('/wp/v2/users/register', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      
      return {
        success: true,
        message: 'Registration successful. Please check your email for verification.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific 404 error for registration endpoint
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          error: 'Registration is currently unavailable. Please contact support.'
        };
      }
      
      const rawMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      const cleanMessage = stripHtml(rawMessage);
      return {
        success: false,
        error: cleanMessage
      };
    }
  },

  // Validate token
  validateToken: async (token) => {
    try {
      const response = await authApi.post('/jwt-auth/v1/token/validate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.code === 'jwt_auth_valid_token';
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // Get current user
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user_data');
      const token = localStorage.getItem('auth_token');
      
      if (userData && token) {
        return {
          ...JSON.parse(userData),
          token
        };
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    
    return null;
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/';
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    return !!token;
  }
};
