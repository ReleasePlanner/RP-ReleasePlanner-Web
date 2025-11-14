import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RegisterForm } from './RegisterForm';
import { useRegister } from '../../api/hooks/useAuth';

vi.mock('../../api/hooks/useAuth', () => ({
  useRegister: vi.fn(),
}));

describe('RegisterForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('renders register form', () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeInTheDocument();
  });

  it('displays error message when registration fails', () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: true,
      error: new Error('Registration failed'),
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('validates username length', async () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const usernameInput = screen.getByLabelText(/Usuario/i);
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.blur(usernameInput);

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
    });
  });

  it('validates password strength', async () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const passwordInput = screen.getByLabelText(/Contraseña/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates password contains uppercase, lowercase and numbers', async () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const passwordInput = screen.getByLabelText(/Contraseña/i);
    fireEvent.change(passwordInput, { target: { value: 'lowercase123' } });
    fireEvent.blur(passwordInput);

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/mayúsculas, minúsculas y números/i)).toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm />
      </QueryClientProvider>
    );

    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Different123' } });
    fireEvent.blur(confirmPasswordInput);

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
    });
  });

  it('calls onSuccess callback when registration succeeds', async () => {
    const onSuccess = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue({});

    vi.mocked(useRegister).mockReturnValue({
      mutateAsync,
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm onSuccess={onSuccess} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: 'Password123' } });

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        firstName: undefined,
        lastName: undefined,
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('calls onSwitchToLogin when link is clicked', () => {
    const onSwitchToLogin = vi.fn();

    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isError: false,
      isPending: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <RegisterForm onSwitchToLogin={onSwitchToLogin} />
      </QueryClientProvider>
    );

    const loginLink = screen.getByText(/Inicia sesión aquí/i);
    fireEvent.click(loginLink);

    expect(onSwitchToLogin).toHaveBeenCalled();
  });
});

