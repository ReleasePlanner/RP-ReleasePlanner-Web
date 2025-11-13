/**
 * Auth Hooks
 * 
 * React Query hooks for authentication
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginDto, RegisterDto, User } from '../services/auth.service';
import { logger } from '../../utils/logging/Logger';
import { getErrorMessage } from '../../utils/notifications/errorNotification';

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      logger.info('User logged in successfully', {
        component: 'useAuth',
        action: 'login',
        metadata: { userId: data.user.id, username: data.user.username },
      });
    },
    onError: (error) => {
      logger.error('Login failed', error instanceof Error ? error : new Error(String(error)), {
        component: 'useAuth',
        action: 'login',
      });
    },
  });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      logger.info('User registered successfully', {
        component: 'useAuth',
        action: 'register',
        metadata: { userId: data.user.id, username: data.user.username },
      });
    },
    onError: (error) => {
      logger.error('Registration failed', error instanceof Error ? error : new Error(String(error)), {
        component: 'useAuth',
        action: 'register',
      });
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(['auth', 'user'], null);
      logger.info('User logged out successfully', {
        component: 'useAuth',
        action: 'logout',
      });
    },
    onError: (error) => {
      // Clear cache even if logout fails
      queryClient.clear();
      queryClient.setQueryData(['auth', 'user'], null);
      logger.error('Logout failed', error instanceof Error ? error : new Error(String(error)), {
        component: 'useAuth',
        action: 'logout',
      });
    },
  });
}

/**
 * Hook for refresh token mutation
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
    onError: (error) => {
      // Clear auth on refresh failure
      authService.clearAuth();
      queryClient.clear();
      queryClient.setQueryData(['auth', 'user'], null);
      logger.error('Token refresh failed', error instanceof Error ? error : new Error(String(error)), {
        component: 'useAuth',
        action: 'refreshToken',
      });
    },
  });
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: () => {
      // Try to get user from localStorage first
      const storedUser = authService.getUser();
      return storedUser || undefined;
    },
  });
}

/**
 * Hook to check authentication status
 */
export function useAuth() {
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  return {
    user: user || null,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    logout: logout.mutate,
    isLoggingOut: logout.isPending,
  };
}

