/**
 * Comprehensive logging and error monitoring system
 * Follows enterprise-grade practices for web applications
 */

export const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  planId?: string;
  phaseId?: string;
  timestamp?: Date;
  userAgent?: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
  stack?: string;
  timestamp: Date;
  correlationId: string;
}

export interface LogTransport {
  name: string;
  log(entry: LogEntry): Promise<void> | void;
}

/**
 * Central logger class implementing enterprise logging patterns
 * - Structured logging with context
 * - Multiple transports (console, remote, local storage)
 * - Correlation IDs for tracing
 * - Performance monitoring
 * - Error aggregation
 */
export class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private context: LogContext = {};
  private minLevel: LogLevel = LogLevel.INFO;

  private constructor() {
    this.initializeDefaultTransports();
    this.setupGlobalErrorHandling();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set the minimum log level
   */
  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Add a transport for log output
   */
  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  /**
   * Set global context that will be included in all logs
   */
  public setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Create a child logger with additional context
   */
  public child(context: Partial<LogContext>): Logger {
    const childLogger = Object.create(this);
    childLogger.context = { ...this.context, ...context };
    return childLogger;
  }

  /**
   * Log debug information
   */
  public debug(message: string, context?: Partial<LogContext>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log informational messages
   */
  public info(message: string, context?: Partial<LogContext>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warnings
   */
  public warn(message: string, context?: Partial<LogContext>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log errors
   */
  public error(
    message: string,
    error?: Error,
    context?: Partial<LogContext>
  ): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log fatal errors
   */
  public fatal(
    message: string,
    error?: Error,
    context?: Partial<LogContext>
  ): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  /**
   * Main logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Partial<LogContext>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      context: {
        ...this.context,
        ...context,
        timestamp: new Date(),
        url: window.location?.href,
        userAgent: navigator?.userAgent,
      },
      error,
      stack: error?.stack,
      timestamp: new Date(),
      correlationId: this.generateCorrelationId(),
    };

    // Send to all transports
    this.transports.forEach((transport) => {
      try {
        transport.log(logEntry);
      } catch (transportError) {
        console.error("Transport error:", transportError);
      }
    });
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.FATAL,
    ];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDefaultTransports(): void {
    // Console transport for development
    if (process.env.NODE_ENV === "development") {
      this.addTransport({
        name: "console",
        log: (entry: LogEntry) => {
          const { level, message, context, error } = entry;

          // Map log levels to console methods
          const consoleMethod = (() => {
            switch (level) {
              case LogLevel.DEBUG:
                return console.debug;
              case LogLevel.INFO:
                return console.info;
              case LogLevel.WARN:
                return console.warn;
              case LogLevel.ERROR:
              case LogLevel.FATAL:
                return console.error;
              default:
                return console.log;
            }
          })();

          if (error) {
            consoleMethod(`[${level.toUpperCase()}] ${message}`, {
              context,
              error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
              },
            });
          } else {
            consoleMethod(`[${level.toUpperCase()}] ${message}`, context);
          }
        },
      });
    }

    // Local storage transport for client-side persistence
    this.addTransport({
      name: "localStorage",
      log: (entry: LogEntry) => {
        if (typeof window === "undefined") return;

        try {
          const logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
          logs.push({
            ...entry,
            error: entry.error
              ? {
                  message: entry.error.message,
                  stack: entry.error.stack,
                  name: entry.error.name,
                }
              : undefined,
          });

          // Keep only last 100 logs to prevent storage overflow
          if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
          }

          localStorage.setItem("app_logs", JSON.stringify(logs));
        } catch (storageError) {
          console.error("Failed to store log:", storageError);
        }
      },
    });
  }

  private setupGlobalErrorHandling(): void {
    if (typeof window === "undefined") return;

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.error("Unhandled promise rejection", event.reason, {
        action: "unhandled_rejection",
      });
    });

    // Handle global JavaScript errors
    window.addEventListener("error", (event) => {
      const errorMessage = event.message || String(event.error) || 'Unknown error';
      const error = event.error instanceof Error 
        ? event.error 
        : new Error(errorMessage);
      this.error("Global JavaScript error", error, {
        action: "global_error",
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          errorType: typeof event.error,
        },
      });
    });
  }

  /**
   * Get logs from localStorage for debugging
   */
  public getLogs(): LogEntry[] {
    if (typeof window === "undefined") return [];

    try {
      return JSON.parse(localStorage.getItem("app_logs") || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Clear stored logs
   */
  public clearLogs(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("app_logs");
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
