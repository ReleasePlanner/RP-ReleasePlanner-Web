import {
  buildDaysArray,
  buildMonthSegments,
  buildWeekSegments,
} from "../../lib/date";

export type GanttTimelineProps = {
  start: Date;
  totalDays: number;
  pxPerDay: number;
  todayIndex?: number;
  onJumpToToday?: () => void;
};

export default function GanttTimeline({ start, totalDays, pxPerDay, todayIndex, onJumpToToday }: GanttTimelineProps) {
  const monthsRow = 28;
  const weeksRow = 24;
  const daysRow = 24;
  const days = buildDaysArray(start, totalDays);
  const monthSegments = buildMonthSegments(days);
  const weekSegments = buildWeekSegments(days);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200" style={{ height: monthsRow + weeksRow + daysRow }}>
      {/* Today marker */}
      {typeof todayIndex === 'number' && todayIndex >= 0 && todayIndex < totalDays && (
        <>
          <div className="absolute top-0" style={{ left: todayIndex * pxPerDay, width: 0, height: monthsRow + weeksRow + daysRow }}>
            <div className="h-full" style={{ borderLeft: '2px solid rgba(24,90,189,0.6)' }} />
          </div>
          <div className="absolute" style={{ left: todayIndex * pxPerDay, top: 0 }}>
            <span className="-translate-x-1/2 relative left-[-50%] text-[10px] px-1 py-0.5 rounded bg-gray-100 border border-gray-300 text-gray-700">Today</span>
          </div>
        </>
      )}
      {/* Jump to today button */}
      {onJumpToToday && (
        <div className="absolute top-1 right-2">
          <button className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={onJumpToToday} type="button">
            Today
          </button>
        </div>
      )}
      {/* Months */}
      <div className="relative" style={{ height: monthsRow }}>
        {monthSegments.map((m, idx) => (
          <div
            key={idx}
            className="absolute top-0 text-[11px] text-gray-700 font-medium flex items-center justify-center border-r border-gray-200"
            style={{
              left: m.startIndex * pxPerDay,
              width: m.length * pxPerDay,
              height: monthsRow,
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
            className="absolute top-0 text-[10px] text-gray-500 flex items-center justify-center border-r border-gray-100"
            style={{
              left: w.startIndex * pxPerDay,
              width: w.length * pxPerDay,
              height: weeksRow,
            }}
          >
            {w.label}
          </div>
        ))}
      </div>
      {/* Days */}
      <div className="relative" style={{ height: daysRow }}>
        {days.map((d, i) => (
          <div
            key={i}
            className="absolute top-0 border-r border-gray-100 text-[10px] text-gray-400 flex items-center justify-center"
            style={{ left: i * pxPerDay, width: pxPerDay, height: daysRow }}
            title={d.toISOString().slice(0, 10)}
          >
            {d.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
