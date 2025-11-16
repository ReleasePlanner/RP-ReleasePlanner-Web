import { QueryClient } from '@tanstack/react-query';
import { logger } from '../utils/logging/Logger';
import { HttpClientError } from './httpClient';
import { categorizeError, getUserErrorMessage, ErrorCategory } from './resilience/ErrorHandler';

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
				// Use advanced error categorization
				const errorContext = categorizeError(error);
				
				// Never retry non-retryable errors
				if (!errorContext.retryable) {
					return false;
				}
				
				// Limit retries based on error category
				if (errorContext.category === ErrorCategory.RATE_LIMIT) {
					return failureCount < 5; // More retries for rate limits
				}
				
				if (errorContext.category === ErrorCategory.SERVER_ERROR) {
					return failureCount < 3; // Standard retries for server errors
				}
				
				if (errorContext.category === ErrorCategory.NETWORK || errorContext.category === ErrorCategory.TIMEOUT) {
					return failureCount < 3; // Retries for network issues
				}
				
				// Bulkhead errors: retry with delay to allow queue to clear
				if (errorContext.category === ErrorCategory.BULKHEAD_REJECTED || errorContext.category === ErrorCategory.BULKHEAD_TIMEOUT) {
					return failureCount < 3;
				}
				
				// Default: retry up to 2 times
				return failureCount < 2;
			},
			retryDelay: (attemptIndex, error) => {
				// Use advanced retry strategy based on error type
				const errorContext = categorizeError(error);
				
				// Rate limit: longer delays
				if (errorContext.category === ErrorCategory.RATE_LIMIT) {
					return Math.min(2000 * Math.pow(2, attemptIndex), 60000);
				}
				
				// Server errors: exponential backoff
				if (errorContext.category === ErrorCategory.SERVER_ERROR) {
					return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
				}
				
				// Network errors: adaptive delay with jitter
				if (errorContext.category === ErrorCategory.NETWORK || errorContext.category === ErrorCategory.TIMEOUT) {
					const baseDelay = 500 * (attemptIndex + 1);
					return Math.min(baseDelay + Math.random() * 1000, 10000);
				}
				
				// Bulkhead errors: fixed delay with jitter to allow queue to clear
				if (errorContext.category === ErrorCategory.BULKHEAD_REJECTED || errorContext.category === ErrorCategory.BULKHEAD_TIMEOUT) {
					return Math.min(1000 + Math.random() * 1000, 10000);
				}
				
				// Default: exponential backoff with jitter
				const baseDelay = 1000 * Math.pow(2, attemptIndex);
				return Math.min(baseDelay + Math.random() * 1000, 30000);
			},
			onError: (error) => {
				const errorContext = categorizeError(error);
				logger.error('React Query error', error instanceof Error ? error : new Error(String(error)), {
					component: 'queryClient',
					action: 'queryError',
					metadata: {
						errorType: error instanceof HttpClientError ? 'HttpClientError' : 'Unknown',
						statusCode: error instanceof HttpClientError ? error.statusCode : undefined,
						isNetworkError: error instanceof HttpClientError ? error.isNetworkError : undefined,
						errorCategory: errorContext.category,
						userMessage: errorContext.userMessage,
						retryable: errorContext.retryable,
					},
				});
			},
		},
		mutations: {
			retry: (failureCount, error) => {
				// Use advanced error categorization for mutations
				const errorContext = categorizeError(error);
				
				// Never retry non-retryable errors
				if (!errorContext.retryable) {
					return false;
				}
				
				// Retry mutations only on network errors, server errors, rate limits, bulkhead errors, or conflicts
				if (
					errorContext.category === ErrorCategory.NETWORK ||
					errorContext.category === ErrorCategory.TIMEOUT ||
					errorContext.category === ErrorCategory.SERVER_ERROR ||
					errorContext.category === ErrorCategory.RATE_LIMIT ||
					errorContext.category === ErrorCategory.BULKHEAD_REJECTED ||
					errorContext.category === ErrorCategory.BULKHEAD_TIMEOUT ||
					errorContext.category === ErrorCategory.CONFLICT // Optimistic locking conflicts
				) {
					return failureCount < 2;
				}
				
				return false;
			},
			retryDelay: (attemptIndex, error) => {
				// Use advanced retry strategy based on error type
				const errorContext = categorizeError(error);
				
				// Rate limit: longer delays
				if (errorContext.category === ErrorCategory.RATE_LIMIT) {
					return Math.min(2000 * Math.pow(2, attemptIndex), 30000);
				}
				
				// Conflict (optimistic locking): quick retry
				if (errorContext.category === ErrorCategory.CONFLICT) {
					return Math.min(500 * (attemptIndex + 1), 2000);
				}
				
				// Server errors: exponential backoff
				if (errorContext.category === ErrorCategory.SERVER_ERROR) {
					return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
				}
				
				// Network errors: adaptive delay
				if (errorContext.category === ErrorCategory.NETWORK || errorContext.category === ErrorCategory.TIMEOUT) {
					return Math.min(500 * (attemptIndex + 1), 5000);
				}
				
				// Bulkhead errors: fixed delay with jitter to allow queue to clear
				if (errorContext.category === ErrorCategory.BULKHEAD_REJECTED || errorContext.category === ErrorCategory.BULKHEAD_TIMEOUT) {
					return Math.min(1000 + Math.random() * 1000, 10000);
				}
				
				// Default: exponential backoff with jitter
				const baseDelay = 1000 * Math.pow(2, attemptIndex);
				return Math.min(baseDelay + Math.random() * 1000, 10000);
			},
			onError: (error) => {
				const errorContext = categorizeError(error);
				logger.error('React Query mutation error', error instanceof Error ? error : new Error(String(error)), {
					component: 'queryClient',
					action: 'mutationError',
					metadata: {
						errorType: error instanceof HttpClientError ? 'HttpClientError' : 'Unknown',
						statusCode: error instanceof HttpClientError ? error.statusCode : undefined,
						isNetworkError: error instanceof HttpClientError ? error.isNetworkError : undefined,
						errorCategory: errorContext.category,
						userMessage: errorContext.userMessage,
						retryable: errorContext.retryable,
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


