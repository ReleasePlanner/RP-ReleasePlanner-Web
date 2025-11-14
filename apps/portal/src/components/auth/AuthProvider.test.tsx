import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthProvider } from './AuthProvider';
import { authReducer } from '../../store/authSlice';
import { authService } from '../../api/services/auth.service';
import { useCurrentUser } from '../../api/hooks/useAuth';

vi.mock('../../api/hooks/useAuth', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('../../api/services/auth.service', () => ({
  authService: {
    getUser: vi.fn(),
    getAccessToken: vi.fn(),
    clearAuth: vi.fn(),
  },
}));

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn(),
  };
});

describe('AuthProvider', () => {
  let queryClient: QueryClient;
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    vi.clearAllMocks();
  });

  it('renders children', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    vi.mocked(authService.getUser).mockReturnValue(null);
    vi.mocked(authService.getAccessToken).mockReturnValue(null);

    const { getByText } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes auth state from localStorage when user and token exist', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user' as const,
    };

    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    vi.mocked(authService.getUser).mockReturnValue(mockUser);
    vi.mocked(authService.getAccessToken).mockReturnValue('token123');

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(authService.getUser).toHaveBeenCalled();
      expect(authService.getAccessToken).toHaveBeenCalled();
    });
  });

  it('clears auth when no token exists', async () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    vi.mocked(authService.getUser).mockReturnValue(null);
    vi.mocked(authService.getAccessToken).mockReturnValue(null);

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(authService.clearAuth).toHaveBeenCalled();
    });
  });

  it('syncs Redux state with React Query when user changes', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user' as const,
    };

    vi.mocked(useCurrentUser).mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as any);

    vi.mocked(authService.getUser).mockReturnValue(null);
    vi.mocked(authService.getAccessToken).mockReturnValue(null);

    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(useCurrentUser).toHaveBeenCalled();
    });
  });
});

