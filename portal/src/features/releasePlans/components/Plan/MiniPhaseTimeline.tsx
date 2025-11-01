import { useMemo } from "react";
import type { PlanPhase } from "../../types";
import { daysBetween, buildDaysArray, buildMonthSegments, buildWeekSegments } from "../../lib/date";

type MiniPhaseTimelineProps = {
  phase: PlanPhase;
  calendarStart: string;
  calendarEnd: string;
  pxPerDay?: number;
  height?: number;
};

export default function MiniPhaseTimeline({ phase, calendarStart, calendarEnd, pxPerDay = 6, height = 10 }: MiniPhaseTimelineProps) {
  const { yearStart, yearEnd, totalDays, offsetDays, lenDays, days, monthSegments, weekSegments } = useMemo(() => {
    const y = new Date(calendarStart).getFullYear();
    const yearStart = new Date(y, 0, 1);
    const yearEnd = new Date(y, 11, 31);
    yearStart.setHours(0,0,0,0); yearEnd.setHours(0,0,0,0);
    const total = Math.max(1, daysBetween(yearStart, yearEnd));
    const days = buildDaysArray(yearStart, total);
    const monthSegments = buildMonthSegments(days);
    const weekSegments = buildWeekSegments(days);
    let offset = 0; let len = 1;
    if (phase.startDate && phase.endDate) {
      const s = new Date(phase.startDate); s.setHours(0,0,0,0);
      const e = new Date(phase.endDate); e.setHours(0,0,0,0);
      offset = Math.max(0, daysBetween(yearStart, s));
      len = Math.max(1, daysBetween(s, e));
    }
    return { yearStart, yearEnd, totalDays: total, offsetDays: offset, lenDays: len, days, monthSegments, weekSegments };
  }, [phase.startDate, phase.endDate, calendarStart]);

  const contentWidth = totalDays * pxPerDay;
  const barLeft = offsetDays * pxPerDay;
  const barWidth = lenDays * pxPerDay;
  const monthsRow = 16;
  const weeksRow = 14;
  const daysRow = 12;

  return (
    <div className="overflow-auto">
      <div className="relative bg-white" style={{ minWidth: contentWidth }}>
        {/* Months */}
        <div className="relative" style={{ height: monthsRow }}>
          {monthSegments.map((m, idx) => (
            <div key={idx} className="absolute top-0 text-[10px] text-gray-700 flex items-center justify-center border-r border-gray-200"
              style={{ left: m.startIndex * pxPerDay, width: m.length * pxPerDay, height: monthsRow }}>
              {m.label}
            </div>
          ))}
        </div>
        {/* Weeks */}
        <div className="relative" style={{ height: weeksRow }}>
          {weekSegments.map((w, idx) => (
            <div key={idx} className="absolute top-0 text-[9px] text-gray-500 flex items-center justify-center border-r border-gray-100"
              style={{ left: w.startIndex * pxPerDay, width: w.length * pxPerDay, height: weeksRow }}>
              {w.label}
            </div>
          ))}
        </div>
        {/* Days grid */}
        <div className="relative" style={{ height: daysRow }}>
          {days.map((d, i) => (
            <div key={i} className="absolute top-0 border-r border-gray-100 text-[9px] text-gray-400 flex items-center justify-center"
              style={{ left: i * pxPerDay, width: pxPerDay, height: daysRow }} title={d.toISOString().slice(0,10)}>
              {d.getDate()}
            </div>
          ))}
        </div>
        {/* Phase bar */}
        <div className="relative" style={{ height }}>
          <div className="absolute" style={{ left: barLeft, top: 0, width: barWidth, height }}>
            <div className="h-full rounded" style={{ backgroundColor: phase.color ?? '#185ABD' }} />
          </div>
        </div>
      </div>
    </div>
  );
}


