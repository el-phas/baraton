import { useState, useEffect } from 'react';
import { config } from '@/config/environment';
import api from '@/lib/axios';
import { logger } from '@/utils/logger';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const adminData = localStorage.getItem('admin_user');
      const token = localStorage.getItem('admin_token');
      if (adminData && token) {
        const parsed = JSON.parse(adminData);
        // keep compatibility: admin object may include role and isAdmin
        setAdmin(parsed);
      } else {
        setAdmin(null);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      // Clear invalid session data
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      setAdmin(null);
      logger.warn('Invalid admin session data cleared');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      // Query admin user from backend
      const response = await api.post(`${config.backend.url}/auth/login`, { email, password });
      if (response.status !== 200) throw new Error('Login failed');
      const { token } = response.data;
      if (!token) {
        logger.warn('Admin login attempt with invalid credentials', { email });
        throw new Error('Invalid credentials');
      }
      // Store token for future requests
      localStorage.setItem('admin_token', token);

      // Fetch admin details using the token (header is set by interceptor)
      const detailsRes = await api.get(`${config.backend.url}/admin/me`);
      const adminUser = detailsRes.data;
      if (!adminUser) throw new Error('Failed to fetch admin details');
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      setAdmin(adminUser);
      logger.info('Admin login successful', { email: adminUser.email });
      return { success: true };
    } catch (error: any) {
      logger.error('Admin login failed', { error: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      setAdmin(null);
      logger.info('Admin logout successful');
    } catch (error) {
      logger.error('Admin logout error', error);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  return {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin && !!(typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null),
    isAdmin: !!admin && (admin as any).role === 'admin',
    canEdit: !!admin && ((admin as any).role === 'admin' || (admin as any).isAdmin === true),
  };
};