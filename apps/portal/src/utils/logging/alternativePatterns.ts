// @ts-nocheck
/**
 * Alternative logging patterns without decorators
 * For environments where decorators are not available
 */

import React from "react";
import { logger } from "./Logger";
import { monitoring } from "./monitoring";

/**
 * Higher-order function for method logging
 * Usage: const loggedMethod = withLog(originalMethod, 'MyComponent');
 */
export function withLog<T extends (...args: unknown[]) => unknown>(
  fn: T,
  component: string,
  action?: string
): T {
  return ((...args: Parameters<T>) => {
    const methodName = action || fn.name || "anonymous";
    logger.info(`${component}.${methodName}`, {
      component,
      action: methodName,
      metadata: { args: args.slice(0, 2) },
    });
    return fn.apply(this, args);
  }) as T;
}

/**
 * Higher-order function for error handling
 */
export function withCatch<T extends (...args: unknown[]) => unknown>(
  fn: T,
  component: string,
  action?: string
): T {
  return ((...args: Parameters<T>) => {
    const methodName = action || fn.name || "anonymous";
    try {
      const result = fn.apply(this, args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          logger.error(`${component}.${methodName} failed`, error as Error);
          throw error;
        });
      }
      return result;
    } catch (error) {
      logger.error(`${component}.${methodName} failed`, error as Error);
      throw error;
    }
  }) as T;
}

/**
 * Higher-order function for performance monitoring
 */
export function withPerf<T extends (...args: unknown[]) => unknown>(
  fn: T,
  component: string,
  action?: string
): T {
  return ((...args: Parameters<T>) => {
    const methodName = action || fn.name || "anonymous";
    const start = performance.now();

    try {
      const result = fn.apply(this, args);

      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          logger.debug(
            `${component}.${methodName} took ${duration.toFixed(2)}ms`
          );
        });
      }

      const duration = performance.now() - start;
      logger.debug(`${component}.${methodName} took ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.warn(
        `${component}.${methodName} failed after ${duration.toFixed(2)}ms`
      );
      throw error;
    }
  }) as T;
}

/**
 * Higher-order function for user action tracking
 */
export function withTracking<T extends (...args: unknown[]) => unknown>(
  fn: T,
  actionName: string,
  component: string
): T {
  return ((...args: Parameters<T>) => {
    monitoring.trackUserInteraction({
      action: actionName,
      component,
      metadata: { method: fn.name },
    });
    return fn.apply(this, args);
  }) as T;
}

/**
 * Compose multiple logging behaviors
 */
export function compose<T extends (...args: unknown[]) => unknown>(
  fn: T,
  component: string,
  options: {
    log?: boolean;
    track?: string;
    perf?: boolean;
    catch?: boolean;
    action?: string;
  } = {}
): T {
  let wrappedFn = fn;

  if (options.catch) {
    wrappedFn = withCatch(wrappedFn, component, options.action);
  }

  if (options.perf) {
    wrappedFn = withPerf(wrappedFn, component, options.action);
  }

  if (options.track) {
    wrappedFn = withTracking(wrappedFn, options.track, component);
  }

  if (options.log) {
    wrappedFn = withLog(wrappedFn, component, options.action);
  }

  return wrappedFn;
}

/**
 * Class mixin for automatic logging
 */
export function createLoggedClass<T extends new (...args: unknown[]) => object>(
  BaseClass: T,
  component: string
) {
  return class extends BaseClass {
    constructor(...args: unknown[]) {
      super(...args);

      // Auto-wrap all methods
      const proto = Object.getPrototypeOf(this);
      const propertyNames = Object.getOwnPropertyNames(proto);

      for (const name of propertyNames) {
        if (name !== "constructor" && typeof proto[name] === "function") {
          const originalMethod = proto[name];
          proto[name] = withLog(originalMethod, component, name);
        }
      }
    }
  };
}

/**
 * Utility functions for quick logging
 */
export const quickLog = {
  /**
   * Log and execute a function
   */
  run: <T>(fn: () => T, message: string, component: string): T => {
    logger.info(message, { component });
    return fn();
  },

  /**
   * Track user action and execute
   */
  track: <T>(fn: () => T, action: string, component: string): T => {
    monitoring.trackUserInteraction({ action, component });
    return fn();
  },

  /**
   * Measure performance and execute
   */
  time: <T>(fn: () => T, label: string, component: string): T => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    logger.debug(`${label} took ${duration.toFixed(2)}ms`, { component });
    return result;
  },

  /**
   * Safe execution with error handling
   */
  safe: <T>(fn: () => T, fallback: T, component: string): T => {
    try {
      return fn();
    } catch (error) {
      logger.error(`Safe execution failed in ${component}`, error as Error);
      return fallback;
    }
  },
};

/**
 * React hooks for functional components
 */
export const useQuickLog = (component: string) => {
  const loggedCallback = <T extends (...args: unknown[]) => unknown>(
    callback: T,
    deps: React.DependencyList,
    options: {
      log?: boolean;
      track?: string;
      perf?: boolean;
      catch?: boolean;
    } = {}
  ): T => {
    return React.useCallback(compose(callback, component, options), deps) as T;
  };

  return {
    loggedCallback,
    quickLog: {
      run: <T>(fn: () => T, message: string) =>
        quickLog.run(fn, message, component),
      track: <T>(fn: () => T, action: string) =>
        quickLog.track(fn, action, component),
      time: <T>(fn: () => T, label: string) =>
        quickLog.time(fn, label, component),
      safe: <T>(fn: () => T, fallback: T) =>
        quickLog.safe(fn, fallback, component),
    },
  };
};

export default {
  withLog,
  withCatch,
  withPerf,
  withTracking,
  compose,
  createLoggedClass,
  quickLog,
  useQuickLog,
};
