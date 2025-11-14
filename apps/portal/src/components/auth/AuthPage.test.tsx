import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthPage } from './AuthPage';

vi.mock('./LoginForm', () => ({
  LoginForm: ({ onSuccess, onSwitchToRegister }: any) => (
    <div>
      <div>Login Form</div>
      <button onClick={onSwitchToRegister}>Switch to Register</button>
      <button onClick={onSuccess}>Login Success</button>
    </div>
  ),
}));

vi.mock('./RegisterForm', () => ({
  RegisterForm: ({ onSuccess, onSwitchToLogin }: any) => (
    <div>
      <div>Register Form</div>
      <button onClick={onSwitchToLogin}>Switch to Login</button>
      <button onClick={onSuccess}>Register Success</button>
    </div>
  ),
}));

describe('AuthPage', () => {
  let queryClient: QueryClient;
  const mockNavigate = vi.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });
  });

  it('renders login form by default', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('switches to register form when register tab is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const registerTab = screen.getByText('Registrarse');
    fireEvent.click(registerTab);

    expect(screen.getByText('Register Form')).toBeInTheDocument();
  });

  it('switches back to login form when login tab is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Switch to register
    const registerTab = screen.getByText('Registrarse');
    fireEvent.click(registerTab);

    // Switch back to login
    const loginTab = screen.getByText('Iniciar Sesión');
    fireEvent.click(loginTab);

    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  it('switches to register when LoginForm calls onSwitchToRegister', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const switchButton = screen.getByText('Switch to Register');
    fireEvent.click(switchButton);

    expect(screen.getByText('Register Form')).toBeInTheDocument();
  });

  it('switches to login when RegisterForm calls onSwitchToLogin', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Switch to register first
    const registerTab = screen.getByText('Registrarse');
    fireEvent.click(registerTab);

    // Switch back via form button
    const switchButton = screen.getByText('Switch to Login');
    fireEvent.click(switchButton);

    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });
});

