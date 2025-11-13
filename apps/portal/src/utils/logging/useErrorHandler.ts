import React from "react";
import { logger } from "./Logger";

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
