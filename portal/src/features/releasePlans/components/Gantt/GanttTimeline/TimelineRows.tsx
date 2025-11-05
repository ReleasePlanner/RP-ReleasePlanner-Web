import { TIMELINE_DIMENSIONS, TIMELINE_COLORS } from "./constants";

export type TimelineRowProps = {
  height: number;
  children: React.ReactNode;
};

export function TimelineRow({ height, children }: TimelineRowProps) {
  return (
    <div className="relative" style={{ height }}>
      {children}
    </div>
  );
}

export type MonthSegment = {
  startIndex: number;
  length: number;
  label: string;
};

export type MonthsRowProps = {
  monthSegments: MonthSegment[];
  pxPerDay: number;
};

export function MonthsRow({ monthSegments, pxPerDay }: MonthsRowProps) {
  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT}>
      {monthSegments.map((m) => (
        <div
          key={m.startIndex}
          className="absolute top-0 text-[11px] font-medium flex items-center justify-center border-r"
          style={{
            left: m.startIndex * pxPerDay,
            width: m.length * pxPerDay,
            height: TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT,
            color: TIMELINE_COLORS.TEXT_PRIMARY,
            borderColor: TIMELINE_COLORS.BORDER_LIGHT,
          }}
        >
          {m.label}
        </div>
      ))}
    </TimelineRow>
  );
}

export type WeekSegment = {
  startIndex: number;
  length: number;
  label: string;
};

export type WeeksRowProps = {
  weekSegments: WeekSegment[];
  pxPerDay: number;
};

export function WeeksRow({ weekSegments, pxPerDay }: WeeksRowProps) {
  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT}>
      {weekSegments.map((w) => (
        <div
          key={w.startIndex}
          className="absolute top-0 text-[10px] flex items-center justify-center border-r border-gray-100"
          style={{
            left: w.startIndex * pxPerDay,
            width: w.length * pxPerDay,
            height: TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT,
            color: TIMELINE_COLORS.TEXT_SECONDARY,
          }}
        >
          {w.label}
        </div>
      ))}
    </TimelineRow>
  );
}

export type DaysRowProps = {
  days: Date[];
  pxPerDay: number;
};

export function DaysRow({ days, pxPerDay }: DaysRowProps) {
  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT}>
      {days.map((d, i) => (
        <div
          key={d.getTime()}
          className="absolute top-0 border-r border-gray-100 text-[10px] flex items-center justify-center"
          style={{
            left: i * pxPerDay,
            width: pxPerDay,
            height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
            color: TIMELINE_COLORS.TEXT_MUTED,
            backgroundColor:
              d.getDay() === 0 || d.getDay() === 6
                ? TIMELINE_COLORS.WEEKEND_BG
                : undefined,
          }}
          title={d.toISOString().slice(0, 10)}
        >
          {d.getDate()}
        </div>
      ))}
    </TimelineRow>
  );
}
