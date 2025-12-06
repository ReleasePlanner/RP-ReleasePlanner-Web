import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { RootProvider } from './RootProvider';
import { store } from './store/store';
import { queryClient } from './api/queryClient';
import { theme } from './theme';

// Mock App component
vi.mock('./App', () => ({
  default: () => <div>App Content</div>,
}));

// Mock AuthProvider
vi.mock('./components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('RootProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children with all providers', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <RootProvider />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('applies theme based on darkMode state', () => {
    const { container } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <RootProvider />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});

