import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';
import App from './App.tsx';
import { store } from './store/store.ts';
import { queryClient } from './api/queryClient.ts';
import { theme } from './theme.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ThemeProvider>
			</QueryClientProvider>
		</Provider>
	</StrictMode>,
);
