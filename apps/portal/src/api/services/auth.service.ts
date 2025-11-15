/**
 * Auth Service
 * 
 * API service for authentication operations
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../config';

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}/login`,
      credentials,
    );
    
    // Store tokens and user
    this.setTokens(response.accessToken, response.refreshToken);
    this.setUser(response.user);
    
    // Reset refresh failure state on successful login
    this.resetRefreshState();
    
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}/register`,
      data,
    );
    
    // Store tokens and user
    this.setTokens(response.accessToken, response.refreshToken);
    this.setUser(response.user);
    
    // Reset refresh failure state on successful registration
    this.resetRefreshState();
    
    return response;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Use skipRetry to prevent infinite loop if refresh token is invalid
    const response = await httpClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}/refresh`,
      { refreshToken },
      { skipRetry: true },
    );
    
    // Update stored tokens and user
    this.setTokens(response.accessToken, response.refreshToken);
    this.setUser(response.user);
    
    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(`${API_ENDPOINTS.AUTH}/logout`);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      this.clearAuth();
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    return httpClient.post<User>(`${API_ENDPOINTS.AUTH}/me`);
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  /**
   * Get stored user
   */
  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      // If JSON is invalid, clear the corrupted data
      console.warn('Invalid user data in localStorage, clearing...', error);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Set tokens in storage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  },

  /**
   * Set user in storage
   */
  setUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Reset refresh failure state (used after successful login/refresh)
   */
  resetRefreshState(): void {
    // This will be called by httpClient to reset refresh state
    // We expose it here so authService can reset it on login
    if (typeof window !== 'undefined' && (window as any).__resetRefreshState) {
      (window as any).__resetRefreshState();
    }
  },
};

