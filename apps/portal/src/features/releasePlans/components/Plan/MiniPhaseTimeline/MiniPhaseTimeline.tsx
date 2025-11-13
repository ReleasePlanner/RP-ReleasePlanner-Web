import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useTheme, alpha } from "@mui/material";
import type { PlanPhase } from "../../../types";
import {
  daysBetween,
  buildDaysArray,
  buildMonthSegments,
  buildWeekSegments,
} from "../../../lib/date";

type MiniPhaseTimelineProps = {
  phase: PlanPhase;
  calendarStart: string;
  // Remove calendarEnd if not needed
  pxPerDay?: number;
  height?: number;
  onRangeChange?: (start: string, end: string) => void;
};

export default function MiniPhaseTimeline({
  phase,
  calendarStart,
  // Remove calendarEnd from destructuring
  pxPerDay = 6,
  height = 10,
  onRangeChange,
}: MiniPhaseTimelineProps) {
  const { totalDays, offsetDays, lenDays, days, monthSegments, weekSegments } =
    useMemo(() => {
      const y = new Date(calendarStart).getFullYear();
      const yearStart = new Date(y, 0, 1);
      const yearEnd = new Date(y, 11, 31);
      yearStart.setHours(0, 0, 0, 0);
      yearEnd.setHours(0, 0, 0, 0);
      const total = Math.max(1, daysBetween(yearStart, yearEnd));
      const days = buildDaysArray(yearStart, total);
      const monthSegments = buildMonthSegments(days);
      const weekSegments = buildWeekSegments(days);
      let offset = 0;
      let len = 1;
      if (phase.startDate && phase.endDate) {
        const s = new Date(phase.startDate);
        s.setHours(0, 0, 0, 0);
        const e = new Date(phase.endDate);
        e.setHours(0, 0, 0, 0);
        offset = Math.max(0, daysBetween(yearStart, s));
        len = Math.max(1, daysBetween(s, e));
      }
      return {
        totalDays: total,
        offsetDays: offset,
        lenDays: len,
        days,
        monthSegments,
        weekSegments,
      };
    }, [phase.startDate, phase.endDate, calendarStart]);

  const contentWidth = totalDays * pxPerDay;
  const barLeft = offsetDays * pxPerDay;
  const barWidth = lenDays * pxPerDay;
  const monthsRow = 16;
  const weeksRow = 14;
  const daysRow = 12;
  const dragAreaHeight = height; // selection within phase row

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<null | {
    startIdx: number;
    currentIdx: number;
  }>(null);

  const clientXToDayIndex = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left + el.scrollLeft;
      return Math.max(0, Math.min(totalDays - 1, Math.floor(x / pxPerDay)));
    },
    [pxPerDay, totalDays]
  );

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: MouseEvent) => {
      setDrag((d) =>
        d ? { ...d, currentIdx: clientXToDayIndex(e.clientX) } : d
      );
    };
    const onUp = () => {
      setDrag((d) => {
        if (d) {
          const sIdx = Math.min(d.startIdx, d.currentIdx);
          const eIdx = Math.max(d.startIdx, d.currentIdx);
          const s = days[sIdx]?.toISOString().slice(0, 10);
          const e = days[eIdx]?.toISOString().slice(0, 10);
          if (s && e && onRangeChange) onRangeChange(s, e);
        }
        return null;
      });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, clientXToDayIndex, days, onRangeChange]);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const backgroundColor = isDark ? theme.palette.background.paper : "#ffffff";
  const textPrimary = isDark ? "rgba(255, 255, 255, 0.95)" : "#374151";
  const textSecondary = isDark ? "rgba(255, 255, 255, 0.75)" : "#6b7280";
  const textMuted = isDark ? "rgba(255, 255, 255, 0.65)" : "#9ca3af";
  const borderLight = isDark ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb";
  const borderMedium = isDark ? "rgba(255, 255, 255, 0.15)" : "#d1d5db";

  return (
    <div className="overflow-auto" ref={containerRef}>
      <div
        className="relative"
        style={{ minWidth: contentWidth, backgroundColor }}
      >
        {/* Months */}
        <div className="relative" style={{ height: monthsRow }}>
          {monthSegments.map((m, idx) => (
            <div
              key={idx}
              className="absolute top-0 text-[10px] flex items-center justify-center border-r"
              style={{
                left: m.startIndex * pxPerDay,
                width: m.length * pxPerDay,
                height: monthsRow,
                color: textPrimary,
                borderColor: borderLight,
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
        {/* Weeks */}
        <div className="relative" style={{ height: weeksRow }}>
          {weekSegments.map((w, idx) => (
            <div
              key={idx}
              className="absolute top-0 text-[9px] flex items-center justify-center border-r"
              style={{
                left: w.startIndex * pxPerDay,
                width: w.length * pxPerDay,
                height: weeksRow,
                color: textSecondary,
                borderColor: borderMedium,
              }}
            >
              {w.label}
            </div>
          ))}
        </div>
        {/* Days grid */}
        <div className="relative" style={{ height: daysRow }}>
          {days.map((d, i) => (
            <div
              key={i}
              className="absolute top-0 border-r text-[9px] flex items-center justify-center"
              style={{
                left: i * pxPerDay,
                width: pxPerDay,
                height: daysRow,
                color: textMuted,
                borderColor: borderMedium,
              }}
              title={d.toISOString().slice(0, 10)}
            >
              {d.getDate()}
            </div>
          ))}
        </div>
        {/* Phase bar */}
        <div className="relative" style={{ height: dragAreaHeight }}>
          <div
            className="absolute"
            style={{ left: barLeft, top: 0, width: barWidth, height }}
          >
            <div
              className="h-full rounded"
              style={{ backgroundColor: phase.color ?? "#185ABD" }}
            />
          </div>
          {/* Drag-select overlay */}
          <div
            className="absolute z-10"
            style={{
              left: 0,
              top: 0,
              width: contentWidth,
              height: dragAreaHeight,
              cursor: "crosshair",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const idx = clientXToDayIndex(e.clientX);
              setDrag({ startIdx: idx, currentIdx: idx });
            }}
          />
          {drag && (
            <div
              className="absolute z-20 border"
              style={{
                left: Math.min(drag.startIdx, drag.currentIdx) * pxPerDay,
                width:
                  (Math.abs(drag.currentIdx - drag.startIdx) + 1) * pxPerDay,
                top: 0,
                height: dragAreaHeight,
                pointerEvents: "none",
                backgroundColor: isDark
                  ? alpha(theme.palette.primary.main, 0.2)
                  : alpha(theme.palette.primary.main, 0.1),
                borderColor: theme.palette.primary.main,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
