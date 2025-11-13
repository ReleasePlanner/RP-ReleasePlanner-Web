import { QueryClient } from '@tanstack/react-query';
import { logger } from '../utils/logging/Logger';
import { HttpClientError } from './httpClient';

/**
 * Query Client Configuration
 * 
 * Features:
 * - Intelligent retry logic
 * - Error handling and logging
 * - Optimistic updates support
 * - Cache management
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			retry: (failureCount, error) => {
				// Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
				if (error instanceof HttpClientError) {
					if (error.statusCode >= 400 && error.statusCode < 500) {
						return error.statusCode === 408 || error.statusCode === 429;
					}
					// Retry network errors and server errors (5xx)
					if (error.isNetworkError || error.statusCode >= 500) {
						return failureCount < 3;
					}
				}
				// Retry unknown errors up to 2 times
				return failureCount < 2;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s
			onError: (error) => {
				logger.error('React Query error', error instanceof Error ? error : new Error(String(error)), {
					component: 'queryClient',
					action: 'queryError',
					metadata: {
						errorType: error instanceof HttpClientError ? 'HttpClientError' : 'Unknown',
						statusCode: error instanceof HttpClientError ? error.statusCode : undefined,
						isNetworkError: error instanceof HttpClientError ? error.isNetworkError : undefined,
					},
				});
			},
		},
		mutations: {
			retry: (failureCount, error) => {
				// Retry mutations only on network errors or server errors
				if (error instanceof HttpClientError) {
					if (error.isNetworkError || error.statusCode >= 500) {
						return failureCount < 2;
					}
				}
				return false;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff, max 10s
			onError: (error) => {
				logger.error('React Query mutation error', error instanceof Error ? error : new Error(String(error)), {
					component: 'queryClient',
					action: 'mutationError',
					metadata: {
						errorType: error instanceof HttpClientError ? 'HttpClientError' : 'Unknown',
						statusCode: error instanceof HttpClientError ? error.statusCode : undefined,
						isNetworkError: error instanceof HttpClientError ? error.isNetworkError : undefined,
					},
				});
			},
			onSuccess: (data, variables, context) => {
				logger.debug('React Query mutation succeeded', {
					component: 'queryClient',
					action: 'mutationSuccess',
				});
			},
		},
	},
});


