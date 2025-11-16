/**
 * Hook to monitor resilience patterns (Circuit Breaker, Bulkhead stats)
 */

import { useEffect, useState } from 'react';
import { circuitBreakerManager } from './CircuitBreaker';
import { bulkheadManager } from './Bulkhead';

export interface ResilienceStats {
  circuitBreakers: Array<{
    name: string;
    state: string;
    failureCount: number;
    timeUntilRetry: number;
  }>;
  bulkheads: Array<{
    name: string;
    activeRequests: number;
    queueSize: number;
    maxConcurrent: number;
  }>;
}

/**
 * Hook to get resilience statistics
 */
export function useResilienceStats(updateInterval: number = 5000) {
  const [stats, setStats] = useState<ResilienceStats>({
    circuitBreakers: [],
    bulkheads: [],
  });

  useEffect(() => {
    const updateStats = () => {
      const breakerStats = circuitBreakerManager.getAllStats();
      const bulkheadStats = bulkheadManager.getAllStats();

      setStats({
        circuitBreakers: breakerStats.map((s) => ({
          name: s.name,
          state: s.state,
          failureCount: s.failureCount,
          timeUntilRetry: s.timeUntilRetry,
        })),
        bulkheads: bulkheadStats.map((s) => ({
          name: s.name,
          activeRequests: s.activeRequests,
          queueSize: s.queueSize,
          maxConcurrent: s.maxConcurrent,
        })),
      });
    };

    // Initial update
    updateStats();

    // Set up interval
    const interval = setInterval(updateStats, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return stats;
}

