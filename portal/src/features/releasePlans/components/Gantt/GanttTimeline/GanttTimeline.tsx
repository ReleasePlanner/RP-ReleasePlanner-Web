import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
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
  getTimelineColors,
} from "./index";
import type { PlanMilestone } from "../../../types";

export type GanttTimelineProps = {
  start: Date;
  totalDays: number;
  pxPerDay: number;
  todayIndex?: number;
  milestones?: PlanMilestone[]; // Add this
  onJumpToToday?: () => void;
  onDayClick?: (date: string) => void; // Add this for milestone creation
};

export default function GanttTimeline({
  start,
  totalDays,
  pxPerDay,
  todayIndex,
  milestones = [], // Add this
  onJumpToToday,
  onDayClick, // Add this
}: GanttTimelineProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

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

  // Create a map of dates to milestones for quick lookup
  const milestonesMap = useMemo(() => {
    const map = new Map<string, PlanMilestone>();
    milestones.forEach((milestone) => {
      map.set(milestone.date, milestone);
    });
    return map;
  }, [milestones]);

  const shouldShowTodayMarker =
    typeof todayIndex === "number" &&
    todayIndex >= 0 &&
    todayIndex < safeTotalDays;

  return (
    <div
      className="sticky top-0 z-10 border-b"
      style={{
        height: TIMELINE_DIMENSIONS.TOTAL_HEIGHT,
        backgroundColor: colors.BACKGROUND,
        borderColor: colors.BORDER,
        boxShadow: theme.palette.mode === "dark"
          ? "0 2px 8px rgba(0,0,0,0.3)"
          : "0 2px 4px rgba(0,0,0,0.08)",
      }}
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
      <DaysRow
        days={days}
        pxPerDay={safePxPerDay}
        milestones={milestonesMap}
        onDayClick={onDayClick}
      />
    </div>
  );
}
