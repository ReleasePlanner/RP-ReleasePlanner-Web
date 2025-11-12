import { TIMELINE_DIMENSIONS, getTimelineColors } from "./constants";
import { Tooltip, useTheme } from "@mui/material";
import { Flag as FlagIcon } from "@mui/icons-material";
import type { PlanMilestone } from "../../../types";

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
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT}>
      {monthSegments.map((m) => (
        <div
          key={m.startIndex}
          className="absolute top-0 flex items-center justify-center border-r"
          style={{
            left: m.startIndex * pxPerDay,
            width: m.length * pxPerDay,
            height: TIMELINE_DIMENSIONS.MONTHS_ROW_HEIGHT,
            color: colors.TEXT_PRIMARY,
            borderColor: colors.BORDER_LIGHT,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
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
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT}>
      {weekSegments.map((w) => (
        <div
          key={w.startIndex}
          className="absolute top-0 flex items-center justify-center border-r"
          style={{
            left: w.startIndex * pxPerDay,
            width: w.length * pxPerDay,
            height: TIMELINE_DIMENSIONS.WEEKS_ROW_HEIGHT,
            color: colors.TEXT_SECONDARY,
            borderColor: colors.BORDER_LIGHT,
            fontSize: "0.6875rem",
            fontWeight: 500,
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
  milestones?: Map<string, PlanMilestone>; // Add this
  onDayClick?: (date: string) => void; // Add this
};

export function DaysRow({
  days,
  pxPerDay,
  milestones = new Map(), // Add this
  onDayClick, // Add this
}: DaysRowProps) {
  const theme = useTheme();
  const colors = getTimelineColors(theme);

  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT}>
      {days.map((d, i) => {
        const dateKey = d.toISOString().slice(0, 10);
        const milestone = milestones.get(dateKey);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

        return (
          <div
            key={d.getTime()}
            className="absolute top-0 border-r flex items-center justify-center"
            style={{
              left: i * pxPerDay,
              width: pxPerDay,
              height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
              color: colors.TEXT_MUTED,
              backgroundColor: isWeekend ? colors.WEEKEND_BG : undefined,
              borderColor: colors.BORDER_LIGHT,
              cursor: onDayClick ? "pointer" : "default",
              fontSize: "0.6875rem",
              fontWeight: 400,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (onDayClick) {
                e.currentTarget.style.backgroundColor = 
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)";
              }
            }}
            onMouseLeave={(e) => {
              if (onDayClick) {
                e.currentTarget.style.backgroundColor = isWeekend 
                  ? colors.WEEKEND_BG 
                  : undefined;
              }
            }}
            title={milestone ? milestone.name : d.toISOString().slice(0, 10)}
            onClick={() => {
              if (onDayClick) {
                onDayClick(dateKey);
              }
            }}
          >
            {d.getDate()}
            {/* Milestone marker */}
            {milestone && (
              <Tooltip
                title={
                  <div style={{ fontSize: "0.75rem" }}>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {milestone.name}
                    </div>
                    {milestone.description && (
                      <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>
                        {milestone.description}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "0.7rem",
                        opacity: 0.8,
                        marginTop: "4px",
                      }}
                    >
                      {dateKey}
                    </div>
                  </div>
                }
                arrow
                placement="top"
              >
                <FlagIcon
                  sx={{
                    position: "absolute",
                    top: -2,
                    right: 2,
                    fontSize: "12px",
                    color:
                      theme.palette.mode === "dark" ? "#fbbf24" : "#f59e0b",
                    filter:
                      theme.palette.mode === "dark"
                        ? "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
                        : "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      })}
    </TimelineRow>
  );
}
