import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './LoginForm';
import { useLogin } from '../../api/hooks/useAuth';

vi.mock('../../api/hooks/useAuth', () => ({
  useLogin: vi.fn(),
}));

describe('LoginForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario o Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  it('displays error message when login fails', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: true,
      error: new Error('Login failed'),
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onSuccess callback when login succeeds', async () => {
    const onSuccess = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue({});

    vi.mocked(useLogin).mockReturnValue({
      mutateAsync,
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm onSuccess={onSuccess} />
      </QueryClientProvider>
    );

    const usernameInput = screen.getByLabelText(/Usuario o Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('disables submit button when fields are empty', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when pending', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: true,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole('button', { name: /Iniciando sesión/i });
    expect(submitButton).toBeDisabled();
  });

  it('calls onSwitchToRegister when link is clicked', () => {
    const onSwitchToRegister = vi.fn();

    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm onSwitchToRegister={onSwitchToRegister} />
      </QueryClientProvider>
    );

    const registerLink = screen.getByText(/Regístrate aquí/i);
    fireEvent.click(registerLink);

    expect(onSwitchToRegister).toHaveBeenCalled();
  });
});

