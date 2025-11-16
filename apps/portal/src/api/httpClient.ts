/**
 * HTTP Client for API requests
 *
 * Features:
 * - Automatic retry with exponential backoff
 * - Request timeout handling
 * - Structured error handling
 * - Request/response logging
 * - Correlation ID support
 * - Offline detection
 * - JWT token injection
 * - Automatic token refresh on 401
 */
import { API_BASE_URL } from "./config";
import { logger } from "../utils/logging/Logger";
import { authService } from "./services/auth.service";
import {
  circuitBreakerManager,
  CircuitBreakerOpenError,
} from "./resilience/CircuitBreaker";
import {
  calculateRetryDelay,
  isRetryableError as isRetryableErrorStrategy,
  getRetryConfigForError,
  sleep as sleepUtil,
} from "./resilience/RetryStrategy";
import {
  categorizeError,
  getUserErrorMessage,
  isErrorRetryable,
  ErrorCategory,
} from "./resilience/ErrorHandler";
import { bulkheadManager, BulkheadRejectedError, BulkheadTimeoutError } from "./resilience/Bulkhead";

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
    this.name = "HttpClientError";
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

// Flag to prevent recursive refresh token attempts
let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string } | null> | null = null;
let refreshFailed = false; // Flag to prevent immediate retry after refresh failure
let refreshFailureTime = 0; // Timestamp of last refresh failure
const REFRESH_FAILURE_COOLDOWN = 5000; // 5 seconds cooldown after refresh failure

/**
 * Reset refresh state (exposed for authService to call after successful login)
 */
function resetRefreshState(): void {
  isRefreshing = false;
  refreshPromise = null;
  refreshFailed = false;
  refreshFailureTime = 0;
}

// Expose reset function globally so authService can call it
if (typeof window !== 'undefined') {
  (window as any).__resetRefreshState = resetRefreshState;
}

/**
 * Check if the browser is online
 */
function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine !== false;
}

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
 * Check if error is retryable (using advanced strategy)
 */
function isRetryableError(error: HttpClientError): boolean {
  return isRetryableErrorStrategy(error);
}

/**
 * Handle HTTP response with proper error handling
 */
async function handleResponse<T>(
  response: Response,
  correlationId: string
): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const responseCorrelationId =
    response.headers.get("x-correlation-id") || correlationId;
  const requestId = response.headers.get("x-request-id") || "unknown";

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    let error: string | undefined;
    let errorCode: string | undefined;

    if (isJson) {
      try {
        const errorData = await response.json();
        // NestJS may wrap error responses in { data: {...}, message: ..., statusCode: ... }
        // or { message: ..., error: ..., statusCode: ... }
        if (errorData && typeof errorData === 'object') {
          if ('data' in errorData && errorData.data) {
            // If error is wrapped in data field
            const data = errorData.data;
            errorMessage = data.message || data.error || errorData.message || errorMessage;
            error = data.error || errorData.error;
            errorCode = data.code || errorData.code;
          } else {
            // Standard error format
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
      requestId
    );

    // Log error
    logger.error("API request failed", httpError, {
      component: "httpClient",
      action: "handleResponse",
      metadata: {
        statusCode: response.status,
        statusText: response.statusText,
        url: response.url,
        correlationId: responseCorrelationId,
        requestId,
        errorCode,
      },
    });

    throw httpError;
  }

  if (response.status === 204 || (response.status === 201 && !isJson)) {
    return {} as T;
  }

  if (isJson) {
    const jsonData = await response.json();
    // NestJS wraps responses in { data: {...}, statusCode: ... }
    // Extract data if it exists, otherwise return the full response
    if (jsonData && typeof jsonData === 'object' && 'data' in jsonData && jsonData.data !== undefined) {
      return jsonData.data as T;
    }
    return jsonData as T;
  }

  return response.text() as unknown as T;
}

/**
 * Execute HTTP request with retry logic, circuit breaker, and bulkhead
 */
async function executeRequest<T>(
  url: string,
  method: string,
  options: HttpClientOptions = {},
  data?: unknown
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    skipRetry = false,
    ...fetchOptions
  } = options;

  const correlationId = generateCorrelationId();
  const fullUrl = `${API_BASE_URL}${url}`;
  let lastError: HttpClientError | null = null;

  // Get circuit breaker for this endpoint (group by base URL + method)
  const endpointKey = `${method}:${url.split('?')[0]}`;
  const circuitBreaker = circuitBreakerManager.getBreaker(endpointKey, {
    failureThreshold: 5,
    resetTimeout: 60000,
  });

  // Get bulkhead for this endpoint (limit concurrent requests)
  const bulkhead = bulkheadManager.getBulkhead(endpointKey, {
    maxConcurrent: 10,
    maxQueueSize: 50,
  });

  // Check online status
  if (!isOnline()) {
    const offlineError = new HttpClientError(
      "Network request failed: Device is offline",
      0,
      "NETWORK_ERROR",
      "OFFLINE",
      correlationId,
      undefined,
      true
    );
    logger.error("API request failed: offline", offlineError, {
      component: "httpClient",
      action: "executeRequest",
      metadata: { url: fullUrl, method },
    });
    throw offlineError;
  }

  // Execute with circuit breaker and bulkhead protection
  return circuitBreaker.execute(async () => {
    return bulkhead.execute(async () => {
      return executeRequestWithRetry<T>(
        url,
        method,
        options,
        data,
        correlationId,
        fullUrl,
        circuitBreaker
      );
    });
  });
}

/**
 * Internal function to execute request with retry logic
 */
async function executeRequestWithRetry<T>(
  url: string,
  method: string,
  options: HttpClientOptions,
  data: unknown | undefined,
  correlationId: string,
  fullUrl: string,
  circuitBreaker: any
): Promise<T> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    skipRetry = false,
    ...fetchOptions
  } = options;

  let lastError: HttpClientError | null = null;
  let retryConfig = getRetryConfigForError(null);

  for (let attempt = 0; attempt <= retries; attempt++) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), timeout);

      // Log request
      if (attempt === 0) {
        logger.debug(`API request: ${method} ${url}`, {
          component: "httpClient",
          action: "executeRequest",
          metadata: {
            method,
            url: fullUrl,
            correlationId,
            attempt: attempt + 1,
            hasData: !!data,
          },
        });
      } else {
        logger.warn(
          `API request retry: ${method} ${url} (attempt ${attempt + 1}/${
            retries + 1
          })`,
          {
            component: "httpClient",
            action: "executeRequest",
            metadata: {
              method,
              url: fullUrl,
              correlationId,
              attempt: attempt + 1,
              previousError: lastError?.message,
            },
          }
        );
      }

      // Get access token and add to headers
      const accessToken = authService.getAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
        ...(fetchOptions.headers as Record<string, string>),
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(fullUrl, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...fetchOptions,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Handle 401 Unauthorized - try to refresh token
      // Skip refresh if this is already a refresh token request to avoid infinite loop
      const isRefreshEndpoint = fullUrl.includes('/auth/refresh');
      const canAttemptRefresh = 
        response.status === 401 && 
        attempt === 0 && 
        !skipRetry && 
        !isRefreshEndpoint &&
        !refreshFailed && // Don't attempt if refresh recently failed
        (Date.now() - refreshFailureTime) > REFRESH_FAILURE_COOLDOWN; // Respect cooldown period

      if (canAttemptRefresh) {
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          try {
            // Use existing refresh promise if one is in progress
            if (!refreshPromise && !isRefreshing) {
              isRefreshing = true;
              refreshFailed = false; // Reset failure flag when starting new refresh
              
              logger.debug("Attempting to refresh token after 401", {
                component: "httpClient",
                action: "executeRequest",
                metadata: { url: fullUrl, method },
              });

              refreshPromise = authService.refreshToken(refreshToken)
                .then((refreshResponse) => {
                  // Success - reset all refresh state
                  resetRefreshState();
                  return { accessToken: refreshResponse.accessToken };
                })
                .catch((error) => {
                  isRefreshing = false;
                  refreshPromise = null;
                  refreshFailed = true; // Mark as failed
                  refreshFailureTime = Date.now();
                  
                  // Refresh failed, clear auth
                  authService.clearAuth();
                  
                  // Only log error once, not for every waiting request
                  logger.error(
                    "Token refresh failed - clearing authentication",
                    error instanceof Error
                      ? error
                      : new Error(String(error)),
                    {
                      component: "httpClient",
                      action: "executeRequest",
                      metadata: { 
                        url: fullUrl, 
                        method,
                        note: "This error may appear multiple times if multiple requests failed simultaneously"
                      },
                    }
                  );
                  
                  throw error;
                });
            }

            // Wait for refresh (either new or existing)
            if (refreshPromise) {
              const refreshResult = await refreshPromise;
              
              if (refreshResult) {
                // Retry original request with new token
                const retryHeaders: Record<string, string> = {
                  "Content-Type": "application/json",
                  "X-Correlation-ID": correlationId,
                  Authorization: `Bearer ${refreshResult.accessToken}`,
                  ...(fetchOptions.headers as Record<string, string>),
                };

                const retryResponse = await fetch(fullUrl, {
                  method,
                  headers: retryHeaders,
                  body: data ? JSON.stringify(data) : undefined,
                  signal: controller.signal,
                  ...fetchOptions,
                });

                if (retryResponse.ok) {
                  const result = await handleResponse<T>(
                    retryResponse,
                    correlationId
                  );
                  logger.debug(
                    `API request succeeded after token refresh: ${method} ${url}`,
                    {
                      component: "httpClient",
                      action: "executeRequest",
                      metadata: {
                        method,
                        url: fullUrl,
                        correlationId,
                        attempt: attempt + 1,
                        statusCode: retryResponse.status,
                      },
                    }
                  );
                  return result;
                }
              }
            }
          } catch (refreshError) {
            // If refresh failed and we're here, it means the promise was rejected
            // Don't log again or clear auth again - it's already done in the catch handler
            // Just throw the error to prevent retry
            throw new HttpClientError(
              "Authentication failed: Token refresh unsuccessful",
              response.status,
              "UNAUTHORIZED",
              "TOKEN_REFRESH_FAILED",
              correlationId
            );
          }
        }
      } else if (isRefreshEndpoint && response.status === 401) {
        // If refresh endpoint itself returns 401, clear auth and throw
        refreshFailed = true;
        refreshFailureTime = Date.now();
        authService.clearAuth();
        throw new HttpClientError(
          "Authentication failed: Refresh token expired or invalid",
          response.status,
          "UNAUTHORIZED",
          "REFRESH_TOKEN_INVALID",
          correlationId
        );
      } else if (refreshFailed && response.status === 401) {
        // If refresh recently failed, don't attempt again - just throw error
        throw new HttpClientError(
          "Authentication failed: Token refresh recently failed",
          response.status,
          "UNAUTHORIZED",
          "TOKEN_REFRESH_FAILED",
          correlationId
        );
      }

      const result = await handleResponse<T>(response, correlationId);

      // Log success
      logger.debug(`API request succeeded: ${method} ${url}`, {
        component: "httpClient",
        action: "executeRequest",
        metadata: {
          method,
          url: fullUrl,
          correlationId,
          attempt: attempt + 1,
          statusCode: response.status,
        },
      });

      return result;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Handle circuit breaker errors
      if (error instanceof CircuitBreakerOpenError) {
        const errorContext = categorizeError(error);
        logger.warn(
          `Circuit breaker OPEN for ${method} ${url}`,
          {
            component: "httpClient",
            action: "executeRequest",
            metadata: {
              method,
              url: fullUrl,
              correlationId,
              timeUntilRetry: error.timeUntilRetry,
            },
          }
        );
        lastError = new HttpClientError(
          getUserErrorMessage(error),
          503,
          "SERVICE_UNAVAILABLE",
          "CIRCUIT_BREAKER_OPEN",
          correlationId
        );
      }
      // Handle bulkhead errors
      else if (error instanceof BulkheadRejectedError || error instanceof BulkheadTimeoutError) {
        const errorContext = categorizeError(error);
        logger.warn(
          `Bulkhead ${error instanceof BulkheadRejectedError ? 'rejected' : 'timeout'} for ${method} ${url}`,
          {
            component: "httpClient",
            action: "executeRequest",
            metadata: {
              method,
              url: fullUrl,
              correlationId,
              errorType: error instanceof BulkheadRejectedError ? 'BULKHEAD_REJECTED' : 'BULKHEAD_TIMEOUT',
            },
          }
        );
        lastError = new HttpClientError(
          getUserErrorMessage(error),
          error instanceof BulkheadRejectedError ? 503 : 504,
          "SERVICE_UNAVAILABLE",
          error instanceof BulkheadRejectedError ? "BULKHEAD_REJECTED" : "BULKHEAD_TIMEOUT",
          correlationId
        );
      }
      // Handle timeout
      else if (error instanceof Error && error.name === "AbortError") {
        lastError = new HttpClientError(
          `Request timeout: The operation took longer than ${timeout}ms to complete`,
          408,
          "TIMEOUT",
          "REQUEST_TIMEOUT",
          correlationId,
          undefined,
          false,
          true
        );
      } else if (error instanceof HttpClientError) {
        lastError = error;
      } else if (
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        // Network error
        lastError = new HttpClientError(
          "Network request failed: Unable to reach server",
          0,
          "NETWORK_ERROR",
          "NETWORK_ERROR",
          correlationId,
          undefined,
          true
        );
      } else {
        lastError = new HttpClientError(
          error instanceof Error ? error.message : "Unknown error",
          500,
          "UNKNOWN_ERROR",
          "UNKNOWN_ERROR",
          correlationId
        );
      }

      // Update retry config based on error type
      if (lastError) {
        retryConfig = getRetryConfigForError(lastError);
      }

      // Don't retry if:
      // - Skip retry is enabled
      // - Max retries reached
      // - Error is not retryable
      // - Last attempt
      if (
        skipRetry ||
        attempt >= retries ||
        !isRetryableError(lastError) ||
        attempt === retries
      ) {
        // Categorize error for better logging
        const errorContext = categorizeError(lastError);
        logger.error(
          `API request failed after ${attempt + 1} attempts: ${method} ${url}`,
          lastError,
          {
            component: "httpClient",
            action: "executeRequest",
            metadata: {
              method,
              url: fullUrl,
              correlationId,
              attempts: attempt + 1,
              errorCategory: errorContext.category,
              retryable: errorContext.retryable,
            },
          }
        );
        throw lastError;
      }

      // Calculate delay using advanced retry strategy
      const delay = calculateRetryDelay(attempt, retryConfig);
      logger.debug(`Retrying request after ${delay}ms delay`, {
        component: "httpClient",
        action: "executeRequest",
        metadata: {
          method,
          url: fullUrl,
          correlationId,
          attempt: attempt + 1,
          delay,
          strategy: retryConfig.strategy,
        },
      });
      await sleepUtil(delay);
    }
  }

  // This should never happen, but TypeScript needs this check
  if (!lastError) {
    throw new HttpClientError(
      "Request failed: Unknown error occurred",
      500,
      "UNKNOWN_ERROR",
      "UNKNOWN_ERROR",
      correlationId
    );
  }

  throw lastError;
}

export const httpClient = {
  async get<T>(url: string, options?: HttpClientOptions): Promise<T> {
    return executeRequest<T>(url, "GET", options);
  },

  async post<T>(
    url: string,
    data?: unknown,
    options?: HttpClientOptions
  ): Promise<T> {
    return executeRequest<T>(url, "POST", options, data);
  },

  async put<T>(
    url: string,
    data?: unknown,
    options?: HttpClientOptions
  ): Promise<T> {
    return executeRequest<T>(url, "PUT", options, data);
  },

  async patch<T>(
    url: string,
    data?: unknown,
    options?: HttpClientOptions
  ): Promise<T> {
    return executeRequest<T>(url, "PATCH", options, data);
  },

  async delete<T>(url: string, options?: HttpClientOptions): Promise<T> {
    return executeRequest<T>(url, "DELETE", options);
  },
};
