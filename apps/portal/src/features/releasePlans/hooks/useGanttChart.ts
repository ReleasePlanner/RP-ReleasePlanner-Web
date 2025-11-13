import { useMemo, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { daysBetween, addDays } from "../lib/date";
import { GANTT_DIMENSIONS } from "../constants";
import { safeScrollToX } from "../../../utils/dom";
import { useGanttDragAndDrop } from "../components/GanttChart/useGanttDragAndDrop";
import type { PlanTask, PlanPhase } from "../types";

/**
 * Hook for GanttChart business logic
 * Centralizes all complex state management and calculations
 */
export function useGanttChart({
  startDate,
  endDate: _endDate,
  tasks: _tasks,
  phases: _phases = [],
  onPhaseRangeChange,
}: {
  startDate: string;
  endDate: string;
  tasks: PlanTask[];
  phases?: PlanPhase[];
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
}) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);

  // Force calendar to full year (Jan 1 to Dec 31) based on plan's start year
  const yearStart = useMemo(() => {
    const y = new Date(startDate).getFullYear();
    return new Date(y, 0, 1);
  }, [startDate]);

  const yearEnd = useMemo(
    () => new Date(yearStart.getFullYear(), 11, 31),
    [yearStart]
  );

  const start = yearStart;
  const end = yearEnd;

  const totalDays = useMemo(
    () => Math.max(1, daysBetween(start, end)),
    [start, end]
  );

  const { PX_PER_DAY, TRACK_HEIGHT, LABEL_WIDTH } = GANTT_DIMENSIONS;
  const width = totalDays * PX_PER_DAY;

  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(start, i)),
    [start, totalDays]
  );

  const todayIndex = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (t < start || t > end) return undefined;
    return Math.max(
      0,
      Math.min(
        days.length - 1,
        Math.floor((t.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      )
    );
  }, [start, end, days]);

  // Auto-scroll to today by default
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let index = 0;
    if (today <= start) index = 0;
    else if (today >= end) index = Math.max(0, days.length - 1);
    else
      index = Math.max(
        0,
        Math.min(
          days.length - 1,
          Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        )
      );

    const visibleWidth = Math.max(0, el.clientWidth);
    const target = index * PX_PER_DAY - visibleWidth / 2;
    const left = Math.max(0, target);
    safeScrollToX(el, left, "auto");
  }, [start, end, days.length, LABEL_WIDTH, PX_PER_DAY]);

  // Drag and drop functionality
  const dragAndDrop = useGanttDragAndDrop({
    days,
    onPhaseRangeChange,
    containerRef,
    contentRef,
  });

  // Jump to today functionality
  const handleJumpToToday = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const index = typeof todayIndex === "number" ? todayIndex : 0;
    const visibleWidth = Math.max(0, el.clientWidth);
    const target = index * PX_PER_DAY - visibleWidth / 2;
    const left = Math.max(0, target);
    safeScrollToX(el, left, "smooth");
  }, [todayIndex, PX_PER_DAY]);

  const showSelectedDayAlert = useCallback((isoDate: string) => {
    if (typeof window !== "undefined" && typeof window.alert === "function") {
      try {
        window.alert(`Selected day: ${isoDate}`);
      } catch {
        /* ignore alert errors in test environment (jsdom) */
      }
    }
  }, []);

  return {
    // Refs
    containerRef,
    contentRef,

    // Calculated values
    start,
    end,
    totalDays,
    width,
    days,
    todayIndex,
    theme,

    // Constants
    PX_PER_DAY,
    TRACK_HEIGHT,
    LABEL_WIDTH,

    // Functions
    handleJumpToToday,
    showSelectedDayAlert,

    // Drag and drop
    ...dragAndDrop,
  };
}
