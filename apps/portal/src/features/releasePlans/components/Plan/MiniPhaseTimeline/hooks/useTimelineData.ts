import { useMemo } from "react";
import type { PlanPhase } from "../../../../types";
import {
  daysBetween,
  buildDaysArray,
  buildMonthSegments,
  buildWeekSegments,
} from "../../../../lib/date";

export type TimelineData = {
  totalDays: number;
  offsetDays: number;
  lenDays: number;
  days: Date[];
  monthSegments: Array<{ label: string; startIndex: number; length: number }>;
  weekSegments: Array<{ label: string; startIndex: number; length: number }>;
};

export function useTimelineData(
  calendarStart: string,
  phase: PlanPhase
): TimelineData {
  return useMemo(() => {
    const year = new Date(calendarStart).getFullYear();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    yearStart.setHours(0, 0, 0, 0);
    yearEnd.setHours(0, 0, 0, 0);

    const total = Math.max(1, daysBetween(yearStart, yearEnd));
    const days = buildDaysArray(yearStart, total);
    const monthSegments = buildMonthSegments(days);
    const weekSegments = buildWeekSegments(days);

    // Calculate phase offset and length
    let offset = 0;
    let len = 1;
    if (phase.startDate && phase.endDate) {
      const startDate = new Date(phase.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(phase.endDate);
      endDate.setHours(0, 0, 0, 0);
      offset = Math.max(0, daysBetween(yearStart, startDate));
      len = Math.max(1, daysBetween(startDate, endDate));
    }

    return {
      totalDays: total,
      offsetDays: offset,
      lenDays: len,
      days,
      monthSegments,
      weekSegments,
    };
  }, [calendarStart, phase.startDate, phase.endDate]);
}

