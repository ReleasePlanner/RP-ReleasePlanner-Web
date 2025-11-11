import { TIMELINE_DIMENSIONS, TIMELINE_COLORS } from "./constants";
import { Tooltip } from "@mui/material";
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
  milestones?: Map<string, PlanMilestone>; // Add this
  onDayClick?: (date: string) => void; // Add this
};

export function DaysRow({
  days,
  pxPerDay,
  milestones = new Map(), // Add this
  onDayClick, // Add this
}: DaysRowProps) {
  return (
    <TimelineRow height={TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT}>
      {days.map((d, i) => {
        const dateKey = d.toISOString().slice(0, 10);
        const milestone = milestones.get(dateKey);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

        return (
          <div
            key={d.getTime()}
            className="absolute top-0 border-r border-gray-100 text-[10px] flex items-center justify-center relative"
            style={{
              left: i * pxPerDay,
              width: pxPerDay,
              height: TIMELINE_DIMENSIONS.DAYS_ROW_HEIGHT,
              color: TIMELINE_COLORS.TEXT_MUTED,
              backgroundColor: isWeekend
                ? TIMELINE_COLORS.WEEKEND_BG
                : undefined,
              cursor: onDayClick ? "pointer" : "default",
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
                    color: "#f59e0b", // Amber color for milestones
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
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
