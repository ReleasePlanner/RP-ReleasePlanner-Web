import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  categorizeError,
  ErrorCategory,
} from "../../../../../../api/resilience/ErrorHandler";

export function useFeatureRetry() {
  const queryClient = useQueryClient();

  // Helper: Calculate retry delay based on error category
  const calculateRetryDelay = useCallback(
    (
      errorContext: ReturnType<typeof categorizeError>,
      retryCount: number
    ): number => {
      if (errorContext.category === ErrorCategory.RATE_LIMIT) {
        return Math.min(2000 * Math.pow(2, retryCount), 10000);
      }
      if (errorContext.category === ErrorCategory.CONFLICT) {
        return Math.min(500 * (retryCount + 1), 2000);
      }
      return Math.min(1000 * Math.pow(2, retryCount), 5000);
    },
    []
  );

  // Helper: Check if error should be retried
  const shouldRetry = useCallback(
    (
      errorContext: ReturnType<typeof categorizeError>,
      retryCount: number,
      maxRetries: number
    ): boolean => {
      return (
        (errorContext.category === ErrorCategory.CONFLICT ||
          errorContext.category === ErrorCategory.RATE_LIMIT ||
          (errorContext.retryable && retryCount < maxRetries - 1)) &&
        retryCount < maxRetries
      );
    },
    []
  );

  // Helper: Refresh queries before retry
  const refreshQueries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["plans"] });
    await queryClient.invalidateQueries({ queryKey: ["features"] });
    await new Promise((resolve) => setTimeout(resolve, 200));
  }, [queryClient]);

  // Helper: Handle retry logic
  const handleRetryError = useCallback(
    async (
      error: unknown,
      retryCount: number,
      maxRetries: number,
      onMaxRetries: (errorContext: ReturnType<typeof categorizeError>) => void,
      onNonRetryable: (
        errorContext: ReturnType<typeof categorizeError>,
        errorMessage?: string
      ) => void
    ): Promise<boolean> => {
      const errorContext = categorizeError(error);

      if (shouldRetry(errorContext, retryCount, maxRetries)) {
        const delay = calculateRetryDelay(errorContext, retryCount + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        await refreshQueries();
        return true; // Should retry
      }

      if (retryCount >= maxRetries) {
        onMaxRetries(errorContext);
      } else {
        const errorMessage = error instanceof Error ? error.message : undefined;
        onNonRetryable(errorContext, errorMessage);
      }

      return false; // Should not retry
    },
    [calculateRetryDelay, shouldRetry, refreshQueries]
  );

  return {
    handleRetryError,
  };
}

