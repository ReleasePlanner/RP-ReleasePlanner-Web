/**
 * Advanced Retry Strategies
 * 
 * Provides different retry strategies with jitter, adaptive backoff,
 * and configurable behavior based on error types.
 */

export enum RetryStrategyType {
  EXPONENTIAL = 'exponential',
  LINEAR = 'linear',
  FIXED = 'fixed',
  ADAPTIVE = 'adaptive',
}

export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay in milliseconds */
  initialDelay: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
  /** Strategy type */
  strategy: RetryStrategyType;
  /** Add jitter to prevent thundering herd */
  jitter: boolean;
  /** Multiplier for exponential backoff */
  multiplier: number;
  /** Factor for adaptive strategy */
  adaptiveFactor: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  strategy: RetryStrategyType.EXPONENTIAL,
  jitter: true,
  multiplier: 2,
  adaptiveFactor: 1.5,
};

/**
 * Calculate retry delay based on strategy
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_CONFIG
): number {
  let delay: number;

  switch (config.strategy) {
    case RetryStrategyType.EXPONENTIAL:
      delay = config.initialDelay * Math.pow(config.multiplier, attempt);
      break;

    case RetryStrategyType.LINEAR:
      delay = config.initialDelay * (attempt + 1);
      break;

    case RetryStrategyType.FIXED:
      delay = config.initialDelay;
      break;

    case RetryStrategyType.ADAPTIVE:
      // Adaptive: starts exponential, then adapts based on success rate
      const exponentialDelay =
        config.initialDelay * Math.pow(config.multiplier, attempt);
      delay = exponentialDelay * config.adaptiveFactor;
      break;

    default:
      delay = config.initialDelay;
  }

  // Apply jitter to prevent thundering herd problem
  if (config.jitter) {
    // Full jitter: random value between 0 and calculated delay
    delay = Math.random() * delay;
  }

  // Cap at max delay
  return Math.min(delay, config.maxDelay);
}

/**
 * Check if error is retryable based on error type and status code
 */
export function isRetryableError(error: any): boolean {
  // Bulkhead errors are retryable (after a delay)
  if (error?.name === 'BulkheadRejectedError' || error?.name === 'BulkheadTimeoutError') {
    return true;
  }

  // Network errors are always retryable
  if (error?.isNetworkError || error?.isTimeout) {
    return true;
  }

  // Don't retry client errors except specific cases
  if (error?.statusCode >= 400 && error?.statusCode < 500) {
    // Retry on: 408 (timeout), 429 (rate limit), 409 (conflict - optimistic locking)
    return [408, 429, 409].includes(error.statusCode);
  }

  // Retry server errors (5xx)
  if (error?.statusCode >= 500) {
    return true;
  }

  // Don't retry authentication errors (handled separately)
  if (error?.statusCode === 401 || error?.code === 'UNAUTHORIZED') {
    return false;
  }

  // Don't retry validation errors
  if (error?.statusCode === 400 && error?.code !== 'TIMEOUT') {
    return false;
  }

  return false;
}

/**
 * Get retry config based on error type
 */
export function getRetryConfigForError(error: any): Partial<RetryConfig> {
  // Bulkhead errors: moderate delay to allow queue to clear
  if (error?.name === 'BulkheadRejectedError' || error?.name === 'BulkheadTimeoutError') {
    return {
      initialDelay: 1000,
      maxDelay: 10000,
      strategy: RetryStrategyType.FIXED,
      jitter: true,
    };
  }

  // Rate limit errors: longer delays
  if (error?.statusCode === 429) {
    return {
      initialDelay: 2000,
      maxDelay: 60000,
      strategy: RetryStrategyType.EXPONENTIAL,
    };
  }

  // Timeout errors: quick retry
  if (error?.isTimeout || error?.statusCode === 408) {
    return {
      initialDelay: 500,
      maxDelay: 5000,
      strategy: RetryStrategyType.FIXED,
    };
  }

  // Server errors: exponential backoff
  if (error?.statusCode >= 500) {
    return {
      initialDelay: 1000,
      maxDelay: 30000,
      strategy: RetryStrategyType.EXPONENTIAL,
      multiplier: 2,
    };
  }

  // Network errors: adaptive strategy
  if (error?.isNetworkError) {
    return {
      initialDelay: 1000,
      maxDelay: 30000,
      strategy: RetryStrategyType.ADAPTIVE,
    };
  }

  // Default config
  return DEFAULT_CONFIG;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

