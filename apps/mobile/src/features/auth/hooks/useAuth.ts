/**
 * Authentication hook
 * Manages authentication state and provides auth methods
 */
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../../api/config';
import { authService } from '../../../api/services/auth.service';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch {
          // Invalid user data, clear it
          await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await authService.register(email, password, name);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
  };
}

