// @ts-nocheck
import { logger } from "./Logger";

/**
 * Performance and monitoring utilities
 * Provides comprehensive application monitoring capabilities
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface UserInteractionMetric {
  action: string;
  component: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface ApiCallMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
}

/**
 * Central monitoring system for application metrics
 */
class MonitoringSystem {
  private static instance: MonitoringSystem;
  private performanceObserver?: PerformanceObserver;
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;

  private constructor() {
    this.initializePerformanceObserver();
    this.initializeWebVitals();
  }

  public static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }

  /**
   * Track custom performance metric
   */
  public trackMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only recent metrics to prevent memory issues
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.splice(0, this.metrics.length - this.MAX_METRICS);
    }

    logger.debug("Performance metric tracked", {
      metadata: metric,
    });
  }

  /**
   * Track user interaction
   */
  public trackUserInteraction(interaction: UserInteractionMetric): void {
    logger.info(`User interaction: ${interaction.action}`, {
      component: interaction.component,
      action: interaction.action,
      metadata: {
        duration: interaction.duration,
        ...interaction.metadata,
      },
    });

    this.trackMetric({
      name: "user_interaction",
      value: interaction.duration || 0,
      unit: "ms",
      timestamp: new Date(),
      context: {
        action: interaction.action,
        component: interaction.component,
        ...interaction.metadata,
      },
    });
  }

  /**
   * Track API call performance
   */
  public trackApiCall(apiMetric: ApiCallMetric): void {
    const level = apiMetric.success ? "info" : "error";

    logger[level](
      `API call: ${apiMetric.method} ${apiMetric.endpoint}`,
      undefined,
      {
        metadata: {
          endpoint: apiMetric.endpoint,
          method: apiMetric.method,
          statusCode: apiMetric.statusCode,
          duration: apiMetric.duration,
          success: apiMetric.success,
          errorMessage: apiMetric.errorMessage,
        },
      }
    );

    this.trackMetric({
      name: "api_call",
      value: apiMetric.duration,
      unit: "ms",
      timestamp: new Date(),
      context: {
        endpoint: apiMetric.endpoint,
        method: apiMetric.method,
        statusCode: apiMetric.statusCode,
        success: apiMetric.success,
      },
    });
  }

  /**
   * Track memory usage
   */
  public trackMemoryUsage(): void {
    if ("memory" in performance) {
      const memory = (performance as any).memory;

      this.trackMetric({
        name: "memory_used",
        value: memory.usedJSHeapSize,
        unit: "bytes",
        timestamp: new Date(),
      });

      this.trackMetric({
        name: "memory_limit",
        value: memory.jsHeapSizeLimit,
        unit: "bytes",
        timestamp: new Date(),
      });

      logger.debug("Memory usage tracked", {
        metadata: {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        },
      });
    }
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics summary
   */
  public getMetricsSummary(): Record<
    string,
    { count: number; average: number; min: number; max: number }
  > {
    const summary: Record<
      string,
      { count: number; average: number; min: number; max: number }
    > = {};

    this.metrics.forEach((metric) => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          average: 0,
          min: Infinity,
          max: -Infinity,
        };
      }

      const stats = summary[metric.name];
      stats.count++;
      stats.min = Math.min(stats.min, metric.value);
      stats.max = Math.max(stats.max, metric.value);
      stats.average =
        (stats.average * (stats.count - 1) + metric.value) / stats.count;
    });

    return summary;
  }

  private initializePerformanceObserver(): void {
    if (typeof PerformanceObserver === "undefined") return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.trackMetric({
            name: entry.entryType,
            value: entry.duration || entry.startTime,
            unit: "ms",
            timestamp: new Date(),
            context: {
              name: entry.name,
              entryType: entry.entryType,
            },
          });
        });
      });

      this.performanceObserver.observe({
        entryTypes: ["measure", "navigation", "paint", "resource"],
      });
    } catch (error) {
      logger.warn("Failed to initialize PerformanceObserver", error as Error);
    }
  }

  private initializeWebVitals(): void {
    // Track Core Web Vitals
    if ("web-vitals" in window) {
      // This would require the web-vitals library
      // For now, we'll track basic metrics
      this.trackBasicWebVitals();
    }
  }

  private trackBasicWebVitals(): void {
    // Track page load time
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        this.trackMetric({
          name: "page_load_time",
          value: navigation.loadEventEnd - navigation.fetchStart,
          unit: "ms",
          timestamp: new Date(),
        });

        this.trackMetric({
          name: "dom_content_loaded",
          value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          unit: "ms",
          timestamp: new Date(),
        });
      }
    });

    // Track first paint
    const paintEntries = performance.getEntriesByType("paint");
    paintEntries.forEach((entry) => {
      this.trackMetric({
        name: entry.name,
        value: entry.startTime,
        unit: "ms",
        timestamp: new Date(),
      });
    });
  }
}

// Helper functions for easy monitoring
export const monitoring = MonitoringSystem.getInstance();

/**
 * Decorator for automatic API call monitoring
 */
export function monitorApiCall(endpoint: string, method: string = "GET") {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      let success = false;
      let statusCode = 0;
      let errorMessage: string | undefined;

      try {
        const result = await originalMethod.apply(this, args);
        success = true;
        statusCode = 200; // Assume success if no error
        return result;
      } catch (error) {
        success = false;
        errorMessage = error instanceof Error ? error.message : String(error);
        statusCode = 500; // Assume server error if not specified
        throw error;
      } finally {
        const duration = performance.now() - startTime;
        monitoring.trackApiCall({
          endpoint,
          method,
          statusCode,
          duration,
          success,
          errorMessage,
        });
      }
    };

    return descriptor;
  };
}

/**
 * Decorator for user interaction monitoring
 */
export function monitorUserAction(action: string, component?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result.finally(() => {
            const duration = performance.now() - startTime;
            monitoring.trackUserInteraction({
              action,
              component: component || target.constructor.name,
              duration,
            });
          });
        } else {
          const duration = performance.now() - startTime;
          monitoring.trackUserInteraction({
            action,
            component: component || target.constructor.name,
            duration,
          });
          return result;
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        monitoring.trackUserInteraction({
          action,
          component: component || target.constructor.name,
          duration,
          metadata: { error: true },
        });
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Manual tracking functions for React components
 */
export const trackComponentMount = (componentName: string) => {
  monitoring.trackUserInteraction({
    action: "component_mount",
    component: componentName,
  });
};

export const trackComponentUnmount = (componentName: string) => {
  monitoring.trackUserInteraction({
    action: "component_unmount",
    component: componentName,
  });
};

export const trackUserClick = (
  element: string,
  component: string,
  metadata?: Record<string, unknown>
) => {
  monitoring.trackUserInteraction({
    action: "click",
    component,
    metadata: { element, ...metadata },
  });
};

export const trackFormSubmission = (
  formName: string,
  component: string,
  success: boolean
) => {
  monitoring.trackUserInteraction({
    action: "form_submit",
    component,
    metadata: { formName, success },
  });
};
