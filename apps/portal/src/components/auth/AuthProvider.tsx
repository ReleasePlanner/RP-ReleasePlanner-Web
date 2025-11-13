/**
 * Auth Provider Component
 * 
 * Initializes authentication state on app load
 */
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useCurrentUser } from '../../api/hooks/useAuth';
import { setUser } from '../../store/authSlice';
import { authService } from '../../api/services/auth.service';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedUser = authService.getUser();
    const accessToken = authService.getAccessToken();

    if (storedUser && accessToken) {
      // Set initial user in Redux
      dispatch(setUser(storedUser));
      
      // Set initial user in React Query cache
      queryClient.setQueryData(['auth', 'user'], storedUser);
    } else {
      // Clear auth if no valid token
      authService.clearAuth();
      dispatch(setUser(null));
      queryClient.setQueryData(['auth', 'user'], null);
    }
  }, [dispatch, queryClient]);

  useEffect(() => {
    // Sync Redux state with React Query
    if (user) {
      dispatch(setUser(user));
    } else if (!isLoading) {
      dispatch(setUser(null));
    }
  }, [user, isLoading, dispatch]);

  return <>{children}</>;
}

