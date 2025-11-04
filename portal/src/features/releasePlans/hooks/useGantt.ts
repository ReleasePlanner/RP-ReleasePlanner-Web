import { useMemo, useCallback, useRef, useEffect } from "react";
import { daysBetween, addDays } from "../lib/date";
import { safeScrollToX } from "../../../utils/dom";
import { GANTT_DIMENSIONS } from "../constants";

/**
 * Hook for calculating date ranges and timeline data
 * Centralizes date calculations across Gantt components
 */
export function useDateRange(startDate: string) {
  return useMemo(() => {
    // Force calendar to full year (Jan 1 to Dec 31) based on plan's start year
    const year = new Date(startDate).getFullYear();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const totalDays = Math.max(1, daysBetween(yearStart, yearEnd));
    const days = Array.from({ length: totalDays }, (_, i) =>
      addDays(yearStart, i)
    );

    return {
      start: yearStart,
      end: yearEnd,
      totalDays,
      days,
      width: totalDays * GANTT_DIMENSIONS.PX_PER_DAY,
    };
  }, [startDate]);
}

/**
 * Hook for calculating today's position in the timeline
 */
export function useTodayIndex(start: Date, totalDays: number) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today <= start) return 0;
    if (today >= new Date(start.getFullYear(), 11, 31)) return totalDays - 1;

    return daysBetween(start, today);
  }, [start, totalDays]);
}

/**
 * Hook for managing scrolling behavior in Gantt timeline
 */
export function useGanttScroll(todayIndex: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to today on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const visibleWidth = Math.max(0, el.clientWidth);
    const target = todayIndex * GANTT_DIMENSIONS.PX_PER_DAY - visibleWidth / 2;
    const left = Math.max(0, target);

    safeScrollToX(el, left, "smooth");
  }, [todayIndex]);

  const jumpToToday = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const visibleWidth = Math.max(0, el.clientWidth);
    const target = todayIndex * GANTT_DIMENSIONS.PX_PER_DAY - visibleWidth / 2;
    const left = Math.max(0, target);

    safeScrollToX(el, left, "smooth");
  }, [todayIndex]);

  const scrollToDate = useCallback((dayIndex: number) => {
    const el = containerRef.current;
    if (!el) return;

    const visibleWidth = Math.max(0, el.clientWidth);
    const target = dayIndex * GANTT_DIMENSIONS.PX_PER_DAY - visibleWidth / 2;
    const left = Math.max(0, target);

    safeScrollToX(el, left, "smooth");
  }, []);

  return {
    containerRef,
    jumpToToday,
    scrollToDate,
  };
}

/**
 * Hook for calculating lane positions
 */
export function useLanePositions(phases: Array<{ id: string }>) {
  return useMemo(() => {
    const positions = new Map<string, number>();

    phases.forEach((phase, index) => {
      const top =
        index * (GANTT_DIMENSIONS.TRACK_HEIGHT + GANTT_DIMENSIONS.LANE_GAP) +
        GANTT_DIMENSIONS.LANE_GAP;
      positions.set(phase.id, top);
    });

    return positions;
  }, [phases]);
}
