/**
 * HTTP Client for Mobile API requests
 * Adapted from portal's httpClient for React Native
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request timeout handling
 * - Structured error handling
 * - JWT token injection
 * - Automatic token refresh on 401
 * - AsyncStorage for token persistence
 */
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './config';

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
  code?: string;
  correlationId?: string;
  requestId?: string;
}

export class HttpClientError extends Error {
  statusCode: number;
  error?: string;
  code?: string;
  correlationId?: string;
  requestId?: string;
  isNetworkError: boolean;
  isTimeout: boolean;

  constructor(
    message: string,
    statusCode: number,
    error?: string,
    code?: string,
    correlationId?: string,
    requestId?: string,
    isNetworkError = false,
    isTimeout = false
  ) {
    super(message);
    this.name = 'HttpClientError';
    this.statusCode = statusCode;
    this.error = error;
    this.code = code;
    this.correlationId = correlationId;
    this.requestId = requestId;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
  }
}

interface HttpClientOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipRetry?: boolean;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

/**
 * Generate correlation ID for request tracking
 */
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: HttpClientError): boolean {
  // Don't retry client errors (4xx) except 408 (timeout) and 429 (rate limit)
  if (error.statusCode >= 400 && error.statusCode < 500) {
    return error.statusCode === 408 || error.statusCode === 429;
  }
  // Retry server errors (5xx) and network errors
  return error.statusCode >= 500 || error.isNetworkError || error.isTimeout;
}

/**
 * Handle HTTP response with proper error handling
 */
async function handleResponse<T>(
  response: Response,
  correlationId: string
): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const responseCorrelationId =
    response.headers.get('x-correlation-id') || correlationId;
  const requestId = response.headers.get('x-request-id') || 'unknown';

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    let error: string | undefined;
    let errorCode: string | undefined;

    if (isJson) {
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData === 'object') {
          if ('data' in errorData && errorData.data) {
            const data = errorData.data;
            errorMessage = data.message || data.error || errorData.message || errorMessage;
            error = data.error || errorData.error;
            errorCode = data.code || errorData.code;
          } else {
            errorMessage = errorData.message || errorData.error || errorMessage;
            error = errorData.error;
            errorCode = errorData.code;
          }
        }
      } catch {
        // Fallback to status text
      }
    }

    const httpError = new HttpClientError(
      errorMessage,
      response.status,
      error,
      errorCode,
      responseCorrelationId,
      requestId,
      false,
      response.status === 408
    );

    // Handle 401 Unauthorized - refresh token will be handled in the request loop
    // Don't throw RETRY_REQUEST here, let the caller handle retry logic
    throw httpError;
  }

  if (isJson) {
    const jsonData = await response.json();
    // NestJS wraps responses in { data: {...}, statusCode: ... }
    if (jsonData && typeof jsonData === 'object' && 'data' in jsonData && jsonData.data !== undefined) {
      return jsonData.data as T;
    }
    return jsonData as T;
  }

  return response.text() as unknown as T;
}

/**
 * Get stored access token
 */
async function getAccessToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get stored refresh token
 */
async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshToken(): Promise<boolean> {
  try {
    const refreshTokenValue = await getRefreshToken();
    if (!refreshTokenValue) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!response.ok) {
      // Clear tokens if refresh fails
      await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY]);
      return false;
    }

    const data = await response.json();
    const tokens = data.data || data;
    
    if (tokens.accessToken) {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, tokens.accessToken);
    }
    if (tokens.refreshToken) {
      await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
    }

    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

/**
 * HTTP Client class
 */
class HttpClient {
  /**
   * Make HTTP request with retry logic
   */
  async request<T>(
    endpoint: string,
    options: HttpClientOptions = {}
  ): Promise<T> {
    const {
      timeout = DEFAULT_TIMEOUT,
      retries = DEFAULT_RETRIES,
      retryDelay = DEFAULT_RETRY_DELAY,
      skipRetry = false,
      ...fetchOptions
    } = options;

    const correlationId = generateCorrelationId();
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Get access token
    const token = await getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
      ...fetchOptions.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let lastError: HttpClientError | Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if response is 401 and try to refresh token before handling response
        if (response.status === 401 && attempt < retries && !skipRetry) {
          const refreshed = await refreshToken();
          if (refreshed) {
            // Get new token and retry the request
            const newToken = await getAccessToken();
            if (newToken) {
              headers['Authorization'] = `Bearer ${newToken}`;
              // Clone the response to avoid "body already read" error
              continue;
            }
          }
        }

        try {
          return await handleResponse<T>(response, correlationId);
        } catch (error) {
          // If it's a 401 error and we haven't exhausted retries, try refresh
          if (error instanceof HttpClientError && error.statusCode === 401 && attempt < retries && !skipRetry) {
            const refreshed = await refreshToken();
            if (refreshed) {
              const newToken = await getAccessToken();
              if (newToken) {
                headers['Authorization'] = `Bearer ${newToken}`;
                continue;
              }
            }
          }
          throw error;
        }
      } catch (error: any) {
        // Handle abort (timeout)
        if (error.name === 'AbortError') {
          lastError = new HttpClientError(
            `Request timeout after ${timeout}ms`,
            408,
            'TIMEOUT',
            'TIMEOUT',
            correlationId,
            undefined,
            false,
            true
          );
        } else if (error instanceof HttpClientError) {
          lastError = error;
          // Don't retry non-retryable errors
          if (!isRetryableError(error) || skipRetry) {
            throw error;
          }
        } else {
          // Network error
          lastError = new HttpClientError(
            error.message || 'Network error',
            0,
            'NETWORK_ERROR',
            'NETWORK_ERROR',
            correlationId,
            undefined,
            true,
            false
          );
        }

        // If this was the last attempt, throw the error
        if (attempt === retries) {
          throw lastError;
        }

        // Wait before retrying with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }

    throw lastError || new HttpClientError('Unknown error', 500);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();

