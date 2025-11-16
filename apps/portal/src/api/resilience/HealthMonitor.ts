/**
 * Health Monitor
 * 
 * Monitors API health and provides degradation strategies
 */

import { circuitBreakerManager } from './CircuitBreaker';
import { bulkheadManager } from './Bulkhead';

export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  circuitBreakers: {
    open: number;
    halfOpen: number;
    closed: number;
    total: number;
  };
  bulkheads: {
    overloaded: number;
    total: number;
  };
  timestamp: number;
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthStatus: HealthStatus | null = null;
  private listeners: Set<(status: HealthStatus) => void> = new Set();

  private constructor() {}

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  /**
   * Get current health status
   */
  getHealthStatus(): HealthStatus {
    const breakerStats = circuitBreakerManager.getAllStats();
    const bulkheadStats = bulkheadManager.getAllStats();

    const circuitBreakers = {
      open: breakerStats.filter((s) => s.state === 'OPEN').length,
      halfOpen: breakerStats.filter((s) => s.state === 'HALF_OPEN').length,
      closed: breakerStats.filter((s) => s.state === 'CLOSED').length,
      total: breakerStats.length,
    };

    const bulkheads = {
      overloaded: bulkheadStats.filter(
        (s) => s.activeRequests >= s.maxConcurrent * 0.8
      ).length,
      total: bulkheadStats.length,
    };

    // Determine overall health
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Unhealthy if more than 50% of circuit breakers are open
    if (circuitBreakers.total > 0 && circuitBreakers.open / circuitBreakers.total > 0.5) {
      overall = 'unhealthy';
    }
    // Degraded if any circuit breakers are open or half-open
    else if (circuitBreakers.open > 0 || circuitBreakers.halfOpen > 0) {
      overall = 'degraded';
    }
    // Degraded if bulkheads are overloaded
    else if (bulkheads.overloaded > 0) {
      overall = 'degraded';
    }

    const status: HealthStatus = {
      overall,
      circuitBreakers,
      bulkheads,
      timestamp: Date.now(),
    };

    this.healthStatus = status;
    this.notifyListeners(status);

    return status;
  }

  /**
   * Subscribe to health status changes
   */
  subscribe(listener: (status: HealthStatus) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current status
    if (this.healthStatus) {
      listener(this.healthStatus);
    }
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(status: HealthStatus): void {
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in health status listener:', error);
      }
    });
  }

  /**
   * Start monitoring health status
   */
  startMonitoring(interval: number = 5000): () => void {
    const updateHealth = () => {
      this.getHealthStatus();
    };

    // Initial update
    updateHealth();

    // Set up interval
    const intervalId = setInterval(updateHealth, interval);

    // Return stop function
    return () => {
      clearInterval(intervalId);
    };
  }
}

export const healthMonitor = HealthMonitor.getInstance();

