import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import { queryClient } from './api/queryClient';
import { theme } from './theme';

it('renders ReleasePlanner via routes', () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByRole('button', { name: /expand all/i })).toBeInTheDocument();
});
