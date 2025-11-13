import React, { Component, type ReactNode } from "react";
import {
  Alert,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, Refresh, BugReport } from "@mui/icons-material";
import { logger } from "./Logger";

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  component?: string;
}

/**
 * Enterprise-grade Error Boundary with comprehensive logging
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const enhancedErrorInfo: ErrorInfo = {
      componentStack: errorInfo.componentStack || "",
      errorBoundary: this.props.component || "ErrorBoundary",
      errorInfo,
    };

    this.setState({
      errorInfo: enhancedErrorInfo,
    });

    // Log error with full context
    const errorLogger = logger.child({
      component: this.props.component || "ErrorBoundary",
      action: "componentDidCatch",
    });

    errorLogger.error("React Error Boundary caught an error", error, {
      metadata: {
        componentStack:
          errorInfo.componentStack || "No component stack available",
        errorId: this.state.errorId,
        props: this.sanitizeProps(this.props),
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, enhancedErrorInfo);
    }
  }

  private sanitizeProps = (props: ErrorBoundaryProps) => {
    // Remove functions and complex objects to avoid circular references
    const { children, onError, fallback, ...sanitizedProps } = props;
    return {
      ...sanitizedProps,
      hasChildren: !!children,
      hasFallback: !!fallback,
      hasOnError: !!onError,
    };
  };

  private handleRetry = () => {
    const retryLogger = logger.child({
      component: this.props.component || "ErrorBoundary",
      action: "retry",
    });

    retryLogger.info("User triggered error boundary retry", {
      metadata: {
        errorId: this.state.errorId,
      },
    });

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  private handleReportError = () => {
    const reportLogger = logger.child({
      component: this.props.component || "ErrorBoundary",
      action: "reportError",
    });

    reportLogger.info("User reported error", {
      metadata: {
        errorId: this.state.errorId,
        error: this.state.error?.message,
      },
    });

    // Here you could integrate with error reporting services like Sentry, Bugsnag, etc.
    if (this.state.error && this.state.errorInfo) {
      const errorReport = {
        errorId: this.state.errorId,
        message: this.state.error.message,
        stack: this.state.error.stack,
        componentStack: this.state.errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Example: Send to error reporting service
      // errorReportingService.report(errorReport);

      console.log("Error Report Generated:", errorReport);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Refresh />}
                  onClick={this.handleRetry}
                  variant="outlined"
                >
                  Retry
                </Button>
                <Button
                  size="small"
                  startIcon={<BugReport />}
                  onClick={this.handleReportError}
                  variant="outlined"
                >
                  Report
                </Button>
              </Box>
            }
          >
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2">
              An unexpected error occurred. You can try refreshing the page or
              report this issue.
            </Typography>
            {this.state.errorId && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Error ID: {this.state.errorId}
              </Typography>
            )}
          </Alert>

          {this.props.showDetails && this.state.error && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Technical Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error Message:
                  </Typography>
                  <Box
                    sx={{ p: 1, bgcolor: "grey.100", borderRadius: 1, mb: 2 }}
                  >
                    {this.state.error.message}
                  </Box>

                  {this.state.error.stack && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Stack Trace:
                      </Typography>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          mb: 2,
                          overflow: "auto",
                        }}
                      >
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                          {this.state.error.stack}
                        </pre>
                      </Box>
                    </>
                  )}

                  {this.state.errorInfo?.componentStack && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Component Stack:
                      </Typography>
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          overflow: "auto",
                        }}
                      >
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </Box>
                    </>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithErrorBoundaryComponent;
}

/**
 * Hook for handling errors in functional components
 */
export function useErrorHandler() {
  return React.useCallback(
    (error: Error, errorInfo?: { componentStack?: string }) => {
      const errorLogger = logger.child({
        component: "useErrorHandler",
        action: "handleError",
      });

      errorLogger.error("Manual error handling triggered", error, {
        metadata: {
          componentStack: errorInfo?.componentStack,
          userAgent: navigator.userAgent,
          url: window.location.href,
        },
      });

      // You could also trigger a state update to show error UI
      // or integrate with external error reporting here
    },
    []
  );
}

export default ErrorBoundary;
