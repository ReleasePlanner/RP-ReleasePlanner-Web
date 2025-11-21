import {
  TimelineMonths,
  TimelineWeeks,
  TimelineDays,
  PhaseBar,
  DragOverlay,
  DragSelection,
} from "./components";
import { useTimelineData, useDragSelection, useTimelineTheme } from "./hooks";
import type { PlanPhase } from "../../../types";

type MiniPhaseTimelineProps = {
  readonly phase: PlanPhase;
  readonly calendarStart: string;
  readonly pxPerDay?: number;
  readonly height?: number;
  readonly onRangeChange?: (start: string, end: string) => void;
};

// Row height constants
const ROW_HEIGHTS = {
  months: 16,
  weeks: 14,
  days: 12,
} as const;

export default function MiniPhaseTimeline({
  phase,
  calendarStart,
  pxPerDay = 6,
  height = 10,
  onRangeChange,
}: MiniPhaseTimelineProps) {
  // Calculate timeline data
  const { totalDays, offsetDays, lenDays, days, monthSegments, weekSegments } =
    useTimelineData(calendarStart, phase);

  // Drag selection logic
  const { containerRef, drag, startDrag } = useDragSelection(
    totalDays,
    pxPerDay,
    days,
    onRangeChange
  );

  // Theme colors
  const theme = useTimelineTheme();

  // Calculated dimensions
  const contentWidth = totalDays * pxPerDay;
  const barLeft = offsetDays * pxPerDay;
  const barWidth = lenDays * pxPerDay;
  const phaseColor = phase.color ?? "#185ABD";

  return (
    <div className="overflow-auto" ref={containerRef}>
      <div
        className="relative"
        style={{
          minWidth: contentWidth,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <TimelineMonths
          segments={monthSegments}
          pxPerDay={pxPerDay}
          height={ROW_HEIGHTS.months}
          textColor={theme.textPrimary}
          borderColor={theme.borderLight}
        />

        <TimelineWeeks
          segments={weekSegments}
          pxPerDay={pxPerDay}
          height={ROW_HEIGHTS.weeks}
          textColor={theme.textSecondary}
          borderColor={theme.borderMedium}
        />

        <TimelineDays
          days={days}
          pxPerDay={pxPerDay}
          height={ROW_HEIGHTS.days}
          textColor={theme.textMuted}
          borderColor={theme.borderMedium}
        />

        {/* Phase bar and drag area */}
        <div className="relative" style={{ height }}>
          <PhaseBar
            left={barLeft}
            width={barWidth}
            height={height}
            color={phaseColor}
          />

          <DragOverlay
            width={contentWidth}
            height={height}
            totalDays={totalDays}
            pxPerDay={pxPerDay}
            onStartDrag={startDrag}
          />

          <DragSelection drag={drag} pxPerDay={pxPerDay} height={height} />
        </div>
      </div>
    </div>
  );
}
