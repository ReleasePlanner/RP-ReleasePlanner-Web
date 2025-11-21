import { useMemo } from "react";
import { formatDateLocal } from "../../../../lib/date";

export function usePlanCalculations(
  startDate: string,
  endDate: string
) {
  // Calculate duration in days - memoized to avoid recalculation on every render
  const duration = useMemo(() => {
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const diffTime = Math.abs(endTime - startTime);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Format date range using browser locale (dates are in UTC) - memoized
  const formattedDateRange = useMemo(() => {
    return `${formatDateLocal(startDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${formatDateLocal(endDate, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }, [startDate, endDate]);

  return {
    duration,
    formattedDateRange,
  };
}

