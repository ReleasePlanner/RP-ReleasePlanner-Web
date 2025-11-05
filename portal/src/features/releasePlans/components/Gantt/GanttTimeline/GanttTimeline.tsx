import { useMemo } from "react";
import {
  buildDaysArray,
  buildMonthSegments,
  buildWeekSegments,
} from "../../../lib/date";
import {
  TodayMarker,
  TodayButton,
  TimelineLegend,
  MonthsRow,
  WeeksRow,
  DaysRow,
  TIMELINE_DIMENSIONS,
} from "./index";

export type GanttTimelineProps = {
  start: Date;
  totalDays: number;
  pxPerDay: number;
  todayIndex?: number;
  onJumpToToday?: () => void;
};

export default function GanttTimeline({
  start,
  totalDays,
  pxPerDay,
  todayIndex,
  onJumpToToday,
}: GanttTimelineProps) {
  // Use start time (number) in deps so changes to the Date value are detected
  const startTime = start instanceof Date ? start.getTime() : 0;

  // Ensure we have safe numeric values to avoid NaN in styles when callers omit props
  const safeTotalDays =
    Number.isFinite(totalDays) && totalDays > 0 ? totalDays : 0;
  const safePxPerDay = Number.isFinite(pxPerDay) && pxPerDay > 0 ? pxPerDay : 1;

  const days = useMemo(
    () => buildDaysArray(new Date(startTime), safeTotalDays),
    [startTime, safeTotalDays]
  );
  const monthSegments = useMemo(() => buildMonthSegments(days), [days]);
  const weekSegments = useMemo(() => buildWeekSegments(days), [days]);

  const shouldShowTodayMarker =
    typeof todayIndex === "number" &&
    todayIndex >= 0 &&
    todayIndex < safeTotalDays;

  return (
    <div
      className="sticky top-0 z-10 bg-white border-b border-gray-200"
      style={{ height: TIMELINE_DIMENSIONS.TOTAL_HEIGHT }}
    >
      {/* Today marker */}
      {shouldShowTodayMarker && (
        <TodayMarker
          todayIndex={todayIndex!}
          pxPerDay={safePxPerDay}
          totalHeight={TIMELINE_DIMENSIONS.TOTAL_HEIGHT}
        />
      )}

      {/* Jump to today button */}
      {onJumpToToday && <TodayButton onJumpToToday={onJumpToToday} />}

      {/* Legend */}
      <TimelineLegend />

      {/* Timeline rows */}
      <MonthsRow monthSegments={monthSegments} pxPerDay={safePxPerDay} />
      <WeeksRow weekSegments={weekSegments} pxPerDay={safePxPerDay} />
      <DaysRow days={days} pxPerDay={safePxPerDay} />
    </div>
  );
}
