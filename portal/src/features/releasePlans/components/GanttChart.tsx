import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import GanttTimeline from "./Gantt/GanttTimeline";
import { daysBetween, addDays } from "../lib/date";
import type { PlanTask, PlanPhase } from "../types";

// header timeline moved to GanttTimeline component

export type GanttChartProps = {
  startDate: string;
  endDate: string;
  tasks: PlanTask[];
  phases?: PlanPhase[];
  onPhaseRangeChange?: (phaseId: string, startDate: string, endDate: string) => void;
};

export default function GanttChart({
  startDate,
  endDate,
  tasks,
  phases = [],
  onPhaseRangeChange,
}: GanttChartProps) {
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

  const pxPerDay = 24;
  const trackHeight = 28;
  const width = totalDays * pxPerDay;

  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(start, i)),
    [start, totalDays]
  );

  // Auto-scroll to today by default
  const containerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
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
    const target = index * pxPerDay - el.clientWidth / 2;
    const left = Math.max(0, target);
    if (typeof (el as any).scrollTo === 'function') {
      el.scrollTo({ left, behavior: "auto" });
    } else {
      el.scrollLeft = left;
    }
  }, [start, end, days.length]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<{ phaseId: string; phaseIdx: number; startIdx: number; currentIdx: number } | null>(null);

  const clientXToDayIndex = useCallback((clientX: number) => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return 0;
    const contentLeft = content.getBoundingClientRect().left;
    const x = container.scrollLeft + clientX - contentLeft;
    const idx = Math.floor(x / pxPerDay);
    return Math.max(0, Math.min(days.length - 1, idx));
  }, [days.length, pxPerDay]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!drag) return;
      const idx = clientXToDayIndex(e.clientX);
      setDrag((d) => (d ? { ...d, currentIdx: idx } : d));
    }
    function onUp() {
      if (drag) {
        const a = Math.min(drag.startIdx, drag.currentIdx);
        const b = Math.max(drag.startIdx, drag.currentIdx);
        const s = days[a].toISOString().slice(0, 10);
        const e = days[b].toISOString().slice(0, 10);
        onPhaseRangeChange && onPhaseRangeChange(drag.phaseId, s, e);
      }
      setDrag(null);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, days, onPhaseRangeChange, clientXToDayIndex]);

  const todayIndex = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (t < start || t > end) return undefined;
    return Math.max(0, Math.min(days.length - 1, Math.floor((t.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))));
  }, [start, end, days]);


  return (
    <div
      ref={containerRef}
      className="overflow-auto border border-gray-200 rounded-md"
    >
      <div ref={contentRef} className="min-w-full" style={{ minWidth: width }}>
        <GanttTimeline
          start={start}
          totalDays={totalDays}
          pxPerDay={pxPerDay}
          todayIndex={todayIndex}
          onJumpToToday={() => {
            const el = containerRef.current;
            if (!el) return;
            const index = typeof todayIndex === 'number' ? todayIndex : 0;
            const target = index * pxPerDay - el.clientWidth / 2;
            const left = Math.max(0, target);
            if (typeof (el as any).scrollTo === 'function') {
              el.scrollTo({ left, behavior: 'smooth' });
            } else {
              el.scrollLeft = left;
            }
          }}
        />
        {/* Tracks */}
        <div
          className="relative"
          style={{ height: (phases.length + tasks.length) * (trackHeight + 8) + 8 }}
        >
          {/* grid lines */}
          {days.map((_, i) => (
            <div
              key={i}
              className="absolute top-0 border-r border-gray-100"
              style={{ left: i * pxPerDay, width: 0, height: "100%" }}
            />
          ))}
          {/* Today marker across tracks */}
          {typeof todayIndex === 'number' && (
            <div className="absolute top-0" style={{ left: todayIndex * pxPerDay, width: 0, height: '100%', zIndex: 4 }}>
              <div className="h-full" style={{ borderLeft: `2px dashed ${theme.palette.secondary.main}` }} />
            </div>
          )}
          {/* phase bars */}
          {phases.map((ph, idx) => {
            if (!ph.startDate || !ph.endDate) return null;
            const ts = new Date(ph.startDate);
            const te = new Date(ph.endDate);
            const offset = Math.max(0, daysBetween(start, ts));
            const len = Math.max(1, daysBetween(ts, te));
            const left = offset * pxPerDay;
            const barWidth = len * pxPerDay;
            const top = 8 + idx * (trackHeight + 8);
            const color = ph.color ?? theme.palette.secondary.main;
            return (
              <div key={ph.id} className="absolute" style={{ left, top, width: barWidth, height: trackHeight }} title={`${ph.name} (${ph.startDate} → ${ph.endDate})`}>
                <div className="h-full rounded-sm opacity-70" style={{ backgroundColor: color }} />
                <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity">
                  {ph.name}
                </div>
              </div>
            );
          })}
          {/* selection preview */}
          {drag && (
            (() => {
              const a = Math.min(drag.startIdx, drag.currentIdx);
              const b = Math.max(drag.startIdx, drag.currentIdx);
              const left = a * pxPerDay;
              const widthSel = (b - a + 1) * pxPerDay;
              const top = 8 + drag.phaseIdx * (trackHeight + 8);
              return (
                <div className="absolute pointer-events-none" style={{ left, top, width: widthSel, height: trackHeight, zIndex: 5 }}>
                  <div className="h-full rounded-sm" style={{ border: `2px solid ${theme.palette.primary.main}`, backgroundColor: `${theme.palette.primary.main}1A` }} />
                </div>
              );
            })()
          )}
          {/* interactive overlays for phases */}
          {phases.map((ph, idx) => {
            const top = 8 + idx * (trackHeight + 8);
            return (
              <div
                key={`ol-${ph.id}`}
                className="absolute z-10"
                style={{ left: 0, top, width: width, height: trackHeight, cursor: 'crosshair' }}
                onMouseDown={(e) => {
                  const dayIdx = clientXToDayIndex(e.clientX);
                  setDrag({ phaseId: ph.id, phaseIdx: idx, startIdx: dayIdx, currentIdx: dayIdx });
                }}
                title={`Drag to set ${ph.name} period`}
              />
            );
          })}
          {/* task bars */}
          {tasks.map((t, idx) => {
            const ts = new Date(t.startDate);
            const te = new Date(t.endDate);
            const offset = Math.max(0, daysBetween(start, ts));
            const len = Math.max(1, daysBetween(ts, te));
            const left = offset * pxPerDay;
            const barWidth = len * pxPerDay;
            const top = 8 + (phases.length + idx) * (trackHeight + 8);
            const color = t.color ?? theme.palette.primary.main;
            return (
              <div
                key={t.id}
                className="absolute"
                style={{ left, top, width: barWidth, height: trackHeight }}
                title={`${t.title} (${t.startDate} → ${t.endDate})`}
              >
                <div
                  className="h-full rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity">
                  {t.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
