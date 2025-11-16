/**
 * Circuit Breaker Pattern Implementation
 * 
 * Prevents cascading failures by stopping requests to a failing service
 * and allowing it time to recover before attempting again.
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests are rejected immediately
 * - HALF_OPEN: Testing if service has recovered, limited requests allowed
 */

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Time in ms to wait before attempting half-open */
  resetTimeout: number;
  /** Time window in ms to count failures */
  monitoringWindow: number;
  /** Number of successful requests needed in half-open to close circuit */
  successThreshold: number;
  /** Maximum number of requests allowed in half-open state */
  halfOpenMaxRequests: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  monitoringWindow: 60000, // 1 minute
  successThreshold: 2,
  halfOpenMaxRequests: 3,
};

interface FailureRecord {
  timestamp: number;
  error: Error;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: FailureRecord[] = [];
  private successes: number = 0;
  private halfOpenRequests: number = 0;
  private lastFailureTime: number = 0;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config?: Partial<CircuitBreakerConfig>) {
    this.name = name;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check circuit state before execution
    this.checkState();

    if (this.state === CircuitState.OPEN) {
      throw new CircuitBreakerOpenError(
        `Circuit breaker "${this.name}" is OPEN. Service is unavailable.`,
        this.getTimeUntilRetry()
      );
    }

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenRequests >= this.config.halfOpenMaxRequests) {
        throw new CircuitBreakerOpenError(
          `Circuit breaker "${this.name}" is HALF_OPEN. Too many concurrent requests.`,
          0
        );
      }
      this.halfOpenRequests++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Check and update circuit state based on current conditions
   */
  private checkState(): void {
    const now = Date.now();

    // Clean old failures outside monitoring window
    this.failures = this.failures.filter(
      (f) => now - f.timestamp < this.config.monitoringWindow
    );

    // Transition from OPEN to HALF_OPEN after reset timeout
    if (
      this.state === CircuitState.OPEN &&
      now - this.lastFailureTime >= this.config.resetTimeout
    ) {
      this.state = CircuitState.HALF_OPEN;
      this.halfOpenRequests = 0;
      this.successes = 0;
    }

    // Transition from HALF_OPEN to CLOSED if enough successes
    if (
      this.state === CircuitState.HALF_OPEN &&
      this.successes >= this.config.successThreshold
    ) {
      this.state = CircuitState.CLOSED;
      this.failures = [];
      this.halfOpenRequests = 0;
      this.successes = 0;
    }

    // Transition from CLOSED to OPEN if threshold exceeded
    if (
      this.state === CircuitState.CLOSED &&
      this.failures.length >= this.config.failureThreshold
    ) {
      this.state = CircuitState.OPEN;
      this.lastFailureTime = now;
    }
  }

  /**
   * Handle successful request
   */
  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      this.halfOpenRequests--;
    } else if (this.state === CircuitState.CLOSED) {
      // Clear failures on success in closed state (optimistic recovery)
      if (this.failures.length > 0) {
        this.failures = [];
      }
    }
  }

  /**
   * Handle failed request
   */
  private onFailure(error: Error): void {
    if (this.state === CircuitState.HALF_OPEN) {
      // Any failure in half-open immediately opens circuit
      this.state = CircuitState.OPEN;
      this.lastFailureTime = Date.now();
      this.halfOpenRequests = 0;
      this.successes = 0;
    }

    // Record failure
    this.failures.push({
      timestamp: Date.now(),
      error,
    });

    this.lastFailureTime = Date.now();
  }

  /**
   * Get time remaining until circuit breaker will attempt retry
   */
  getTimeUntilRetry(): number {
    if (this.state !== CircuitState.OPEN) {
      return 0;
    }
    const elapsed = Date.now() - this.lastFailureTime;
    return Math.max(0, this.config.resetTimeout - elapsed);
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get failure count
   */
  getFailureCount(): number {
    return this.failures.length;
  }

  /**
   * Manually reset circuit breaker
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = [];
    this.successes = 0;
    this.halfOpenRequests = 0;
    this.lastFailureTime = 0;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failures.length,
      successes: this.successes,
      halfOpenRequests: this.halfOpenRequests,
      timeUntilRetry: this.getTimeUntilRetry(),
      config: this.config,
    };
  }
}

export class CircuitBreakerOpenError extends Error {
  timeUntilRetry: number;

  constructor(message: string, timeUntilRetry: number) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
    this.timeUntilRetry = timeUntilRetry;
  }
}

/**
 * Circuit Breaker Manager - manages multiple circuit breakers
 */
class CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map();

  /**
   * Get or create a circuit breaker for a given service/endpoint
   */
  getBreaker(
    name: string,
    config?: Partial<CircuitBreakerConfig>
  ): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, config));
    }
    return this.breakers.get(name)!;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach((breaker) => breaker.reset());
  }

  /**
   * Reset a specific circuit breaker
   */
  reset(name: string): void {
    this.breakers.get(name)?.reset();
  }

  /**
   * Get all circuit breaker stats
   */
  getAllStats() {
    return Array.from(this.breakers.values()).map((breaker) =>
      breaker.getStats()
    );
  }
}

export const circuitBreakerManager = new CircuitBreakerManager();

