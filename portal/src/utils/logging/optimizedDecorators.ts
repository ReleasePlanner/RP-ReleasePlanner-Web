import { logger } from "./Logger";
import { monitoring } from "./monitoring";

/**
 * Optimized logging decorators - More concise and efficient
 * Reduces boilerplate code while maintaining comprehensive logging
 */

// Type definitions
type ClassMethod = (...args: unknown[]) => unknown;
type ClassConstructor = new (...args: unknown[]) => object;
type LogLevel = "debug" | "info" | "warn" | "error";
type Metadata = Record<string, unknown>;

type LogConfig = {
  action?: string;
  level?: LogLevel;
  includeArgs?: boolean;
  component?: string;
};

/**
 * Lightweight logging decorator - Single line of code
 * @log({ action: 'user_action' })
 */
export function log(config: LogConfig = {}) {
  return function (
    target: ClassConstructor,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as ClassMethod;
    const component = config.component || target.constructor.name;
    const action = config.action || propertyName;
    const level = config.level || "info";

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const metadata: Metadata = {
        component,
        action,
        ...(config.includeArgs && { args: args.slice(0, 2) }),
      };

      logger[level](`${component}.${action}`, undefined, metadata);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * User action tracking - Ultra concise
 * @track('button_click')
 */
export function track(actionName: string, component?: string) {
  return function (
    target: ClassConstructor,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as ClassMethod;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      // Single line tracking
      monitoring.trackUserInteraction({
        action: actionName,
        component: component || target.constructor.name,
        metadata: { method: propertyName },
      });

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Error handling - Automatic with minimal code
 * @catchErrors
 */
export function catchErrors(
  target: ClassConstructor,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value as ClassMethod;

  descriptor.value = function (this: unknown, ...args: unknown[]) {
    try {
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.catch((error) => {
          logger.error(
            `${target.constructor.name}.${propertyName} failed`,
            error as Error
          );
          throw error;
        });
      }

      return result;
    } catch (error) {
      logger.error(
        `${target.constructor.name}.${propertyName} failed`,
        error as Error
      );
      throw error;
    }
  };

  return descriptor;
}

/**
 * Performance monitoring - Single line
 * @perf
 */
export function perf(
  target: ClassConstructor,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value as ClassMethod;

  descriptor.value = function (this: unknown, ...args: unknown[]) {
    const start = performance.now();

    try {
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          logger.debug(
            `${target.constructor.name}.${propertyName} took ${duration.toFixed(
              2
            )}ms`
          );
        });
      }

      const duration = performance.now() - start;
      logger.debug(
        `${target.constructor.name}.${propertyName} took ${duration.toFixed(
          2
        )}ms`
      );
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logger.warn(
        `${
          target.constructor.name
        }.${propertyName} failed after ${duration.toFixed(2)}ms`
      );
      throw error;
    }
  };

  return descriptor;
}

type LogActionConfig = {
  track?: boolean;
  perf?: boolean;
  catch?: boolean;
  action?: string;
  component?: string;
};

/**
 * Combined decorator - All-in-one solution
 * @logAction({ track: true, perf: true, catch: true })
 */
export function logAction(config: LogActionConfig = {}) {
  return function (
    target: ClassConstructor,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as ClassMethod;
    const component = config.component || target.constructor.name;
    const action = config.action || propertyName;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const start = config.perf ? performance.now() : 0;

      // Single line tracking if enabled
      if (config.track) {
        monitoring.trackUserInteraction({ action, component });
      }

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result
            .then((res) => {
              if (config.perf) {
                logger.debug(
                  `${component}.${action} completed in ${(
                    performance.now() - start
                  ).toFixed(2)}ms`
                );
              }
              return res;
            })
            .catch((error) => {
              if (config.catch) {
                logger.error(`${component}.${action} failed`, error);
              }
              throw error;
            });
        }

        if (config.perf) {
          logger.debug(
            `${component}.${action} completed in ${(
              performance.now() - start
            ).toFixed(2)}ms`
          );
        }

        return result;
      } catch (error) {
        if (config.catch) {
          logger.error(`${component}.${action} failed`, error as Error);
        }
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Hook-based logging utilities for functional components
 * Much more concise than manual logging
 */
export const useLog = (component: string) => {
  const componentLogger = logger.child({ component });

  return {
    // Single line logging methods
    info: (message: string, meta?: Metadata) =>
      componentLogger.info(message, { metadata: meta }),
    debug: (message: string, meta?: Metadata) =>
      componentLogger.debug(message, { metadata: meta }),
    warn: (message: string, meta?: Metadata) =>
      componentLogger.warn(message, { metadata: meta }),
    error: (message: string, error?: Error, meta?: Metadata) =>
      componentLogger.error(message, error, { metadata: meta }),

    // Single line tracking
    track: (action: string, meta?: Metadata) =>
      monitoring.trackUserInteraction({
        action,
        component,
        metadata: meta,
      }),

    // Combined action logging
    action: <T>(actionName: string, fn: () => T, meta?: Metadata): T => {
      componentLogger.info(actionName, { metadata: meta });
      monitoring.trackUserInteraction({
        action: actionName,
        component,
        metadata: meta,
      });
      return fn();
    },
  };
};
