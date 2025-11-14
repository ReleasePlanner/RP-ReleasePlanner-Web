import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../../api/hooks/useAuth';

vi.mock('../../api/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
      },
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('allows access when user has required role', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin' as const,
      },
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProtectedRoute requiredRole="admin">
            <div>Admin Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('allows access when user role is higher than required', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin' as const,
      },
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProtectedRoute requiredRole="user">
            <div>User Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('User Content')).toBeInTheDocument();
  });

  it('redirects when user role is lower than required', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        username: 'viewer',
        email: 'viewer@example.com',
        role: 'viewer' as const,
      },
      isAuthenticated: true,
      isLoading: false,
      logout: vi.fn(),
      isLoggingOut: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute requiredRole="admin">
            <div>Admin Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});

