/**
 * Authentication Service
 * Handles login, register, logout, and token management
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient } from '../httpClient';
import { API_ENDPOINTS, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}/login`,
      { email, password }
    );

    // Store tokens and user data
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

    return response;
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}/register`,
      { email, password, name }
    );

    // Store tokens and user data
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(`${API_ENDPOINTS.AUTH}/logout`);
    } catch (error) {
      console.error('Error during logout API call:', error);
    } finally {
      // Always clear local storage
      await AsyncStorage.multiRemove([
        TOKEN_STORAGE_KEY,
        REFRESH_TOKEN_STORAGE_KEY,
        USER_STORAGE_KEY,
      ]);
    }
  }

  /**
   * Get current user from storage
   */
  async getUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.warn('Invalid user data in storage, clearing...', error);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    return !!token;
  }
}

export const authService = new AuthService();

