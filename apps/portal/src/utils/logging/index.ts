/**
 * Comprehensive Logging and Error Handling System
 *
 * This module provides enterprise-grade logging, error handling, and monitoring
 * capabilities for the Release Planner application.
 *
 * Features:
 * - Structured logging with context
 * - Performance monitoring and metrics
 * - Error boundaries for React components
 * - Decorators for automatic logging
 * - User interaction tracking
 * - API call monitoring
 *
 * @example
 * ```typescript
 * import { logger, ErrorBoundary, monitoring } from '@/utils/logging';
 *
 * // Basic logging
 * logger.info('User logged in', { userId: '123' });
 *
 * // Error handling
 * <ErrorBoundary component="MyComponent">
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // Monitoring
 * monitoring.trackUserInteraction({
 *   action: 'button_click',
 *   component: 'Navigation'
 * });
 * ```
 */

// Core logging
export { logger, Logger, LogLevel } from "./Logger";
export type { LogContext, LogEntry, LogTransport } from "./Logger";

// Error handling
export { default as ErrorBoundary } from "./ErrorBoundary";
export type { ErrorInfo } from "./ErrorBoundary";
export { withErrorBoundary } from "./withErrorBoundary";
export { useErrorHandler } from "./useErrorHandler";

// Decorators (commented out due to TypeScript issues - can be enabled when needed)
// export {
//   logPerformance,
//   logErrors,
//   logUserAction,
//   logRetry,
//   LoggableClass
// } from './decorators';

// Monitoring and metrics
export {
  monitoring,
  monitorApiCall,
  monitorUserAction,
  trackComponentMount,
  trackComponentUnmount,
  trackUserClick,
  trackFormSubmission,
} from "./monitoring";

export type {
  PerformanceMetric,
  UserInteractionMetric,
  ApiCallMetric,
} from "./monitoring";

// Utility functions for common logging patterns
import { logger } from "./Logger";
import { LogLevel } from "./Logger";
import ErrorBoundary from "./ErrorBoundary";
import { monitoring } from "./monitoring";

export const logUtils = {
  /**
   * Create a component-scoped logger
   */
  createComponentLogger: (componentName: string) => {
    return logger.child({ component: componentName });
  },

  /**
   * Log React component lifecycle
   */
  logComponentLifecycle: (
    componentName: string,
    lifecycle: string,
    props?: Record<string, unknown>
  ) => {
    logger.debug(`Component ${componentName} ${lifecycle}`, {
      component: componentName,
      action: lifecycle,
      metadata: props ? { propsCount: Object.keys(props).length } : undefined,
    });
  },

  /**
   * Log user navigation
   */
  logNavigation: (from: string, to: string, userId?: string) => {
    logger.info("User navigation", {
      action: "navigate",
      userId,
      metadata: { from, to },
    });
  },

  /**
   * Log form interactions
   */
  logFormInteraction: (formName: string, field: string, action: string) => {
    logger.debug("Form interaction", {
      component: formName,
      action: "form_interaction",
      metadata: { field, interaction: action },
    });
  },

  /**
   * Log async operation results
   */
  logAsyncOperation: async <T>(
    operationName: string,
    operation: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> => {
    const startTime = performance.now();
    const operationLogger = logger.child({
      action: operationName,
      ...context,
    });

    try {
      operationLogger.debug(`Starting ${operationName}`);
      const result = await operation();
      const duration = performance.now() - startTime;

      operationLogger.info(`${operationName} completed successfully`, {
        metadata: { duration: `${duration.toFixed(2)}ms` },
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      operationLogger.error(`${operationName} failed`, error as Error, {
        metadata: { duration: `${duration.toFixed(2)}ms` },
      });
      throw error;
    }
  },
};

// Configuration helpers
export const loggingConfig = {
  /**
   * Configure logging for development
   */
  setupDevelopment: () => {
    logger.setLevel(LogLevel.DEBUG);
    logger.setContext({ timestamp: new Date() });
  },

  /**
   * Configure logging for production
   */
  setupProduction: () => {
    logger.setLevel(LogLevel.INFO);
    logger.setContext({ timestamp: new Date() });
  },

  /**
   * Configure user context
   */
  setUserContext: (userId: string, sessionId: string) => {
    logger.setContext({
      userId,
      sessionId,
    });
  },
};

// Default initialization
if (typeof window !== "undefined") {
  // Auto-configure based on environment
  if (process.env.NODE_ENV === "development") {
    loggingConfig.setupDevelopment();
  } else {
    loggingConfig.setupProduction();
  }
}

export default {
  logger,
  ErrorBoundary,
  monitoring,
  logUtils,
  loggingConfig,
};
