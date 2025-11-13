// @ts-nocheck
import { logger, LogLevel, type LogContext } from "./Logger";

/**
 * Performance monitoring decorator
 * Automatically logs method execution time and parameters
 */
export function logPerformance(
  component?: string,
  includeParams?: boolean,
  threshold?: number
) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();
      const methodLogger = logger.child({
        component: component || target.constructor.name,
        action: propertyName,
      });

      try {
        const result = method.apply(this, args);

        // Handle both sync and async methods
        if (result instanceof Promise) {
          return result
            .then((resolvedResult) => {
              const duration = performance.now() - startTime;
              logMethodCompletion(
                methodLogger,
                propertyName,
                duration,
                args,
                includeParams,
                threshold
              );
              return resolvedResult;
            })
            .catch((error) => {
              const duration = performance.now() - startTime;
              logMethodError(
                methodLogger,
                propertyName,
                duration,
                error,
                args,
                includeParams
              );
              throw error;
            });
        } else {
          const duration = performance.now() - startTime;
          logMethodCompletion(
            methodLogger,
            propertyName,
            duration,
            args,
            includeParams,
            threshold
          );
          return result;
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        logMethodError(
          methodLogger,
          propertyName,
          duration,
          error as Error,
          args,
          includeParams
        );
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Error boundary decorator
 * Automatically catches and logs errors from methods
 */
export function logErrors(component?: string, rethrow: boolean = true) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const methodLogger = logger.child({
        component: component || target.constructor.name,
        action: propertyName,
      });

      try {
        const result = method.apply(this, args);

        if (result instanceof Promise) {
          return result.catch((error) => {
            methodLogger.error(`Error in ${propertyName}`, error as Error, {
              metadata: { arguments: args.map(sanitizeArg) },
            });

            if (rethrow) {
              throw error;
            }
            return undefined;
          });
        }

        return result;
      } catch (error) {
        methodLogger.error(`Error in ${propertyName}`, error as Error, {
          metadata: { arguments: args.map(sanitizeArg) },
        });

        if (rethrow) {
          throw error;
        }
        return undefined;
      }
    };

    return descriptor;
  };
}

/**
 * Audit trail decorator
 * Logs user actions for compliance and debugging
 */
export function logUserAction(
  actionType: string,
  includeParams: boolean = false,
  sensitiveParams: string[] = []
) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const methodLogger = logger.child({
        component: target.constructor.name,
        action: actionType,
      });

      const sanitizedArgs = includeParams
        ? args.map((arg, index) =>
            sensitiveParams.includes(index.toString())
              ? "[REDACTED]"
              : sanitizeArg(arg)
          )
        : undefined;

      methodLogger.info(`User action: ${actionType}`, {
        metadata: {
          method: propertyName,
          arguments: sanitizedArgs,
        },
      });

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Retry decorator with exponential backoff
 * Automatically retries failed operations with logging
 */
export function logRetry(
  maxRetries: number = 3,
  baseDelay: number = 1000,
  component?: string
) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const methodLogger = logger.child({
        component: component || target.constructor.name,
        action: propertyName,
      });

      let lastError: Error;

      for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
          const result = await method.apply(this, args);

          if (attempt > 1) {
            methodLogger.info(
              `Method ${propertyName} succeeded on attempt ${attempt}`,
              {
                metadata: { totalAttempts: attempt },
              }
            );
          }

          return result;
        } catch (error) {
          lastError = error as Error;

          if (attempt <= maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt - 1);

            methodLogger.warn(
              `Method ${propertyName} failed on attempt ${attempt}, retrying in ${delay}ms`,
              lastError,
              {
                metadata: {
                  attempt,
                  maxRetries,
                  delay,
                  arguments: args.map(sanitizeArg),
                },
              }
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      methodLogger.error(
        `Method ${propertyName} failed after ${maxRetries + 1} attempts`,
        lastError!,
        {
          metadata: {
            maxRetries,
            arguments: args.map(sanitizeArg),
          },
        }
      );

      throw lastError!;
    };

    return descriptor;
  };
}

// Helper functions
function logMethodCompletion(
  methodLogger: any,
  methodName: string,
  duration: number,
  args: any[],
  includeParams?: boolean,
  threshold?: number
) {
  const logLevel =
    threshold && duration > threshold ? LogLevel.WARN : LogLevel.DEBUG;
  const message = `Method ${methodName} completed in ${duration.toFixed(2)}ms`;

  if (logLevel === LogLevel.WARN) {
    methodLogger.warn(message, {
      metadata: {
        duration,
        threshold,
        arguments: includeParams ? args.map(sanitizeArg) : undefined,
      },
    });
  } else {
    methodLogger.debug(message, {
      metadata: {
        duration,
        arguments: includeParams ? args.map(sanitizeArg) : undefined,
      },
    });
  }
}

function logMethodError(
  methodLogger: any,
  methodName: string,
  duration: number,
  error: Error,
  args: any[],
  includeParams?: boolean
) {
  methodLogger.error(
    `Method ${methodName} failed after ${duration.toFixed(2)}ms`,
    error,
    {
      metadata: {
        duration,
        arguments: includeParams ? args.map(sanitizeArg) : undefined,
      },
    }
  );
}

function sanitizeArg(arg: any): any {
  if (arg === null || arg === undefined) {
    return arg;
  }

  if (
    typeof arg === "string" ||
    typeof arg === "number" ||
    typeof arg === "boolean"
  ) {
    return arg;
  }

  if (arg instanceof Date) {
    return arg.toISOString();
  }

  if (Array.isArray(arg)) {
    return arg.map(sanitizeArg);
  }

  if (typeof arg === "object") {
    // Avoid circular references and limit depth
    try {
      return JSON.parse(JSON.stringify(arg));
    } catch {
      return "[Complex Object]";
    }
  }

  return String(arg);
}

/**
 * Class decorator to add logging to all methods
 */
export function LoggableClass(component?: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype);

    methodNames.forEach((methodName) => {
      if (methodName === "constructor") return;

      const descriptor = Object.getOwnPropertyDescriptor(
        constructor.prototype,
        methodName
      );
      if (descriptor && typeof descriptor.value === "function") {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
          const classLogger = logger.child({
            component: component || constructor.name,
            action: methodName,
          });

          try {
            const result = originalMethod.apply(this, args);

            if (result instanceof Promise) {
              return result.catch((error) => {
                classLogger.error(`Error in ${methodName}`, error as Error);
                throw error;
              });
            }

            return result;
          } catch (error) {
            classLogger.error(`Error in ${methodName}`, error as Error);
            throw error;
          }
        };

        Object.defineProperty(constructor.prototype, methodName, descriptor);
      }
    });

    return constructor;
  };
}
