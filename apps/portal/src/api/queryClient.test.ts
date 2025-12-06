import { describe, it, expect } from 'vitest';
import { queryClient } from './queryClient';
import { HttpClientError } from './httpClient';

describe('queryClient', () => {
  it('has expected defaults', () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.staleTime).toBe(60 * 1000);
    expect(opts.queries?.refetchOnWindowFocus).toBe(false);
    expect(typeof opts.queries?.retry).toBe('function');
  });

  it('retry function handles HttpClientError correctly', () => {
    const opts = queryClient.getDefaultOptions();
    const retryFn = opts.queries?.retry;
    
    if (typeof retryFn === 'function') {
      // Test with 4xx error (should not retry except 408 and 429)
      const error400 = new HttpClientError('Bad Request', 400);
      expect(retryFn(0, error400)).toBe(false);
      
      // 408 timeout error needs isTimeout flag to be categorized correctly
      const error408 = new HttpClientError('Timeout', 408, 'TIMEOUT', 'REQUEST_TIMEOUT', undefined, undefined, false, true);
      expect(retryFn(0, error408)).toBe(true);
      
      // 429 rate limit error
      const error429 = new HttpClientError('Rate Limit', 429, 'RATE_LIMIT', 'RATE_LIMIT');
      expect(retryFn(0, error429)).toBe(true);
      
      // Test with 5xx error (should retry)
      const error500 = new HttpClientError('Server Error', 500);
      expect(retryFn(0, error500)).toBe(true);
      expect(retryFn(3, error500)).toBe(false); // Max retries reached
      
      // Test with network error (should retry)
      const networkError = new HttpClientError('Network Error', 0, 'NETWORK_ERROR', 'NETWORK_ERROR', undefined, undefined, true);
      expect(retryFn(0, networkError)).toBe(true);
      expect(retryFn(3, networkError)).toBe(false);
      
      // Test with unknown error (should not retry - ErrorHandler marks unknown errors as non-retryable)
      const unknownError = new Error('Unknown error');
      expect(retryFn(0, unknownError)).toBe(false);
    }
  });
});


