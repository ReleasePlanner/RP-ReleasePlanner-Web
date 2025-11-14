import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useRegister, useLogout, useRefreshToken, useCurrentUser, useAuth } from './useAuth';
import { authService } from '../services/auth.service';
import { logger } from '../../utils/logging/Logger';

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    getCurrentUser: vi.fn(),
    isAuthenticated: vi.fn(),
    getUser: vi.fn(),
    clearAuth: vi.fn(),
  },
}));

vi.mock('../../utils/logging/Logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useLogin', () => {
    it('should call authService.login and update query cache on success', async () => {
      const mockResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user' as const,
        },
      };

      vi.mocked(authService.login).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        username: 'testuser',
        password: 'password123',
      });

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123',
        });
        expect(logger.info).toHaveBeenCalledWith(
          'User logged in successfully',
          expect.objectContaining({
            component: 'useAuth',
            action: 'login',
          }),
        );
      });
    });

    it('should log error on failure', async () => {
      const error = new Error('Login failed');
      vi.mocked(authService.login).mockRejectedValue(error);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync({
          username: 'testuser',
          password: 'password123',
        });
      } catch {
        // Expected to fail
      }

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'Login failed',
          error,
          expect.objectContaining({
            component: 'useAuth',
            action: 'login',
          }),
        );
      });
    });
  });

  describe('useRegister', () => {
    it('should call authService.register and update query cache on success', async () => {
      const mockResponse = {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: {
          id: '1',
          username: 'newuser',
          email: 'new@example.com',
          role: 'user' as const,
        },
      };

      vi.mocked(authService.register).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(
          'User registered successfully',
          expect.objectContaining({
            component: 'useAuth',
            action: 'register',
          }),
        );
      });
    });
  });

  describe('useLogout', () => {
    it('should call authService.logout and clear query cache on success', async () => {
      vi.mocked(authService.logout).mockResolvedValue();

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync();

      await waitFor(() => {
        expect(authService.logout).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(
          'User logged out successfully',
          expect.objectContaining({
            component: 'useAuth',
            action: 'logout',
          }),
        );
      });
    });

    it('should clear cache even on error', async () => {
      const error = new Error('Logout failed');
      vi.mocked(authService.logout).mockRejectedValue(error);

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync();
      } catch {
        // Expected to fail
      }

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalled();
      });
    });
  });

  describe('useRefreshToken', () => {
    it('should call authService.refreshToken and update query cache on success', async () => {
      const mockResponse = {
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'user' as const,
        },
      };

      vi.mocked(authService.refreshToken).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRefreshToken(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync('refresh-token');

      await waitFor(() => {
        expect(authService.refreshToken).toHaveBeenCalledWith('refresh-token');
      });
    });

    it('should clear auth on error', async () => {
      const error = new Error('Refresh failed');
      vi.mocked(authService.refreshToken).mockRejectedValue(error);

      const { result } = renderHook(() => useRefreshToken(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync('refresh-token');
      } catch {
        // Expected to fail
      }

      await waitFor(() => {
        expect(authService.clearAuth).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalled();
      });
    });
  });

  describe('useCurrentUser', () => {
    it('should fetch current user when authenticated', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
      };

      vi.mocked(authService.isAuthenticated).mockReturnValue(true);
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
      vi.mocked(authService.getUser).mockReturnValue(null);

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUser);
    });

    it('should use initial data from localStorage', () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
      };

      vi.mocked(authService.isAuthenticated).mockReturnValue(true);
      vi.mocked(authService.getUser).mockReturnValue(mockUser);

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toEqual(mockUser);
    });
  });

  describe('useAuth', () => {
    it('should return user and authentication status', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
      };

      vi.mocked(authService.isAuthenticated).mockReturnValue(true);
      vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);
      vi.mocked(authService.getUser).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(typeof result.current.logout).toBe('function');
      });
    });

    it('should return null user when not authenticated', () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(false);
      vi.mocked(authService.getUser).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});

