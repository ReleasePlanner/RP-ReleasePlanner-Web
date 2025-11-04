/**
 * Simple logging utilities - No decorators needed
 * Production-ready logging patterns with minimal boilerplate
 */

import { logger } from "./Logger";
import { monitoring } from "./monitoring";

/**
 * Simple logging utilities that can be used anywhere
 */
export const L = {
  /**
   * Log and return result - one liner
   */
  log: <T>(fn: () => T, message: string, component: string): T => {
    logger.info(`${component}: ${message}`);
    return fn();
  },

  /**
   * Track user action and return result
   */
  track: <T>(fn: () => T, action: string, component: string): T => {
    monitoring.trackUserInteraction({ action, component });
    return fn();
  },

  /**
   * Time execution and return result
   */
  time: <T>(fn: () => T, label: string, component: string): T => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    logger.debug(`${component}: ${label} took ${duration.toFixed(2)}ms`);
    return result;
  },

  /**
   * Safe execution with automatic error logging
   */
  safe: <T>(fn: () => T, fallback: T, component: string): T => {
    try {
      return fn();
    } catch (error) {
      logger.error(`${component}: Operation failed`, error as Error);
      return fallback;
    }
  },

  /**
   * Async safe execution
   */
  safeAsync: async <T>(
    fn: () => Promise<T>,
    fallback: T,
    component: string
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      logger.error(`${component}: Async operation failed`, error as Error);
      return fallback;
    }
  },

  /**
   * Combined logging + tracking + timing
   */
  all: <T>(
    fn: () => T,
    options: {
      message?: string;
      action?: string;
      component: string;
      time?: boolean;
    }
  ): T => {
    const start = options.time ? performance.now() : 0;

    if (options.message) {
      logger.info(`${options.component}: ${options.message}`);
    }

    if (options.action) {
      monitoring.trackUserInteraction({
        action: options.action,
        component: options.component,
      });
    }

    const result = fn();

    if (options.time) {
      const duration = performance.now() - start;
      logger.debug(
        `${options.component}: Operation took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  },
};

/**
 * Create a component-specific logger
 */
export function createComponentLogger(componentName: string) {
  return {
    log: (message: string) => logger.info(`${componentName}: ${message}`),
    debug: (message: string) => logger.debug(`${componentName}: ${message}`),
    warn: (message: string) => logger.warn(`${componentName}: ${message}`),
    error: (message: string, error?: Error) =>
      logger.error(`${componentName}: ${message}`, error),

    track: (action: string) =>
      monitoring.trackUserInteraction({ action, component: componentName }),

    time: <T>(fn: () => T, label: string): T =>
      L.time(fn, label, componentName),

    safe: <T>(fn: () => T, fallback: T): T =>
      L.safe(fn, fallback, componentName),

    safeAsync: <T>(fn: () => Promise<T>, fallback: T): Promise<T> =>
      L.safeAsync(fn, fallback, componentName),
  };
}

/**
 * Method wrapper for class methods
 */
export function logMethod<T extends (...args: unknown[]) => unknown>(
  originalMethod: T,
  className: string,
  methodName: string
): T {
  return ((...args: unknown[]) => {
    logger.info(`${className}.${methodName} called`);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = originalMethod.apply(null as any, args);
      return result;
    } catch (error) {
      logger.error(`${className}.${methodName} failed`, error as Error);
      throw error;
    }
  }) as T;
}

/**
 * React component logging utilities
 */
export const useComponentLogger = (componentName: string) => {
  const componentLogger = createComponentLogger(componentName);

  return {
    ...componentLogger,

    /**
     * Wrap event handlers with automatic logging
     */
    handler: <T extends (...args: unknown[]) => unknown>(
      fn: T,
      actionName: string
    ): T => {
      return ((...args: unknown[]) => {
        componentLogger.log(`${actionName} triggered`);
        componentLogger.track(actionName);
        return fn(...args);
      }) as T;
    },

    /**
     * Log component lifecycle events
     */
    lifecycle: (event: "mount" | "unmount" | "update", details?: string) => {
      const message = details ? `${event}: ${details}` : event;
      componentLogger.log(message);
    },
  };
};

// Export for convenience
export default L;
