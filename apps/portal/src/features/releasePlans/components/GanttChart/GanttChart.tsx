import { useEffect, useMemo, useRef, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import GanttTimeline from "../Gantt/GanttTimeline/GanttTimeline";
import { daysBetween, addDays } from "../../lib/date";
import {
  PX_PER_DAY,
  TRACK_HEIGHT,
  LABEL_WIDTH,
  LANE_GAP,
} from "../Gantt/constants";
import { laneTop } from "../Gantt/utils";
import { safeScrollToX } from "../../../../utils/dom";
import GanttLane from "../Gantt/GanttLane/GanttLane";
import PhaseBar from "../Gantt/PhaseBar/PhaseBar";
import TaskBar from "../Gantt/TaskBar/TaskBar";
import type { PlanTask, PlanPhase, PlanReference } from "../../types";
import PhasesList from "../Plan/PhasesList/PhasesList";
import { useGanttDragAndDrop } from "./useGanttDragAndDrop";
import { TodayMarker, Preview, PreviewContainer } from "./GanttChart.styles";
import type { CalendarDay } from "@/features/calendar/types";
import type { PlanMilestone } from "../../types";
import { useQueries } from "@tanstack/react-query";
import { calendarsService } from "@/api/services/calendars.service";
import type { Calendar as APICalendar, CalendarDay as APICalendarDay } from "@/api/services/calendars.service";
import {
  getTimelineColors,
  TIMELINE_DIMENSIONS,
} from "../Gantt/GanttTimeline/constants";
import { TimelineToolbar, TOOLBAR_HEIGHT } from "../Gantt/GanttTimeline/TimelineToolbar";
import { GanttCell } from "../Gantt/GanttCell";

// header timeline moved to GanttTimeline component

export type GanttChartProps = {
  startDate: string;
  endDate: string;
  tasks: PlanTask[];
  phases?: PlanPhase[];
  calendarIds?: string[]; // Add this
  milestones?: PlanMilestone[]; // Add this
  onMilestoneAdd?: (milestone: PlanMilestone) => void; // Add this
  onMilestoneUpdate?: (milestone: PlanMilestone) => void; // Add this
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  onAddPhase?: () => void;
  onEditPhase?: (id: string) => void;
  onAutoGenerate?: () => void;
  hideMainCalendar?: boolean;
  // Cell data props
  cellData?: import("../../types").GanttCellData[];
  milestoneReferences?: PlanReference[]; // Milestone references for tooltips
  onCellDataChange?: (data: import("../../types").GanttCellData) => void;
  onAddCellComment?: (phaseId: string, date: string) => void;
  onAddCellFile?: (phaseId: string, date: string) => void;
  onAddCellLink?: (phaseId: string, date: string) => void;
  onToggleCellMilestone?: (phaseId: string, date: string) => void;
  // Scroll to date callback - exposes scroll function to parent
  onScrollToDateReady?: (scrollToDate: (date: string) => void) => void;
  // Timeline toolbar props
  onSaveTimeline?: () => void;
  hasTimelineChanges?: boolean;
  isSavingTimeline?: boolean;
};

export default function GanttChart({
  startDate,
  endDate: _endDate,
  tasks,
  phases = [],
  calendarIds = [], // Add this
  milestones = [], // Add this
  onMilestoneAdd, // Add this
  onMilestoneUpdate, // Add this
  onPhaseRangeChange,
  onAddPhase,
  onEditPhase,
  onAutoGenerate,
  hideMainCalendar,
  cellData = [],
  milestoneReferences = [],
  onCellDataChange,
  onAddCellComment,
  onAddCellFile,
  onAddCellLink,
  onToggleCellMilestone,
  onScrollToDateReady,
  onSaveTimeline,
  hasTimelineChanges = false,
  isSavingTimeline = false,
}: GanttChartProps) {
  const labelWidth = LABEL_WIDTH; // sticky label column width for phase names
  // mark intentionally unused until we support non-year-spanning views
  void _endDate;
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

  const pxPerDay = PX_PER_DAY;
  const trackHeight = TRACK_HEIGHT;
  const width = totalDays * pxPerDay;

  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(start, i)),
    [start, totalDays]
  );

  const showSelectedDayAlert = useCallback((isoDate: string) => {
    if (typeof window !== "undefined" && typeof window.alert === "function") {
      try {
        window.alert(`Selected day: ${isoDate}`);
      } catch {
        /* ignore alert errors in test environment (jsdom) */
      }
    }
  }, []);

  // Auto-scroll to today by default - deferred for performance
  // Non-null assertions keep refs compatible with hook types expecting HTMLDivElement
  const containerRef = useRef<HTMLDivElement>(null!);
  const theme = useTheme();
  useEffect(() => {
    // Defer scroll to avoid blocking initial render
    const timeoutId = setTimeout(() => {
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
      const visibleWidth = Math.max(0, el.clientWidth);
      const target = index * pxPerDay - visibleWidth / 2;
      const left = Math.max(0, target);
      safeScrollToX(el, left, "auto");
    }, 100); // Small delay to allow initial render

    return () => clearTimeout(timeoutId);
  }, [start, end, days.length, labelWidth, pxPerDay]);

  const contentRef = useRef<HTMLDivElement>(null!);

  const { drag, editDrag, setDrag, setEditDrag, clientXToDayIndex } =
    useGanttDragAndDrop({
      days,
      onPhaseRangeChange,
      containerRef,
      contentRef,
    });

  const todayIndex = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    if (t < start || t > end) return undefined;
    return Math.max(
      0,
      Math.min(
        days.length - 1,
        Math.floor((t.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      )
    );
  }, [start, end, days]);

  // Load calendars from API using the calendar IDs
  const calendarQueries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ['calendars', 'detail', id],
      queryFn: () => calendarsService.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Convert API calendars to local format
  const planCalendars = useMemo(() => {
    return calendarQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => {
        const apiCalendar = query.data!;
        return {
          id: apiCalendar.id,
          name: apiCalendar.name,
          description: apiCalendar.description,
          days: apiCalendar.days?.map((day: APICalendarDay) => ({
            id: day.id,
            name: day.name,
            date: day.date,
            type: day.type,
            description: day.description,
            recurring: day.recurring,
            createdAt: day.createdAt,
            updatedAt: day.updatedAt,
          })) || [],
        };
      });
  }, [calendarQueries]);

  // Create a map of dates (YYYY-MM-DD) to calendar day information
  const calendarDaysMap = useMemo(() => {
    const map = new Map<string, { day: CalendarDay; calendarName: string }[]>();

    planCalendars.forEach((calendar) => {
      calendar.days.forEach((day) => {
        const dateKey = day.date; // Already in YYYY-MM-DD format

        // Handle recurring days - check if date falls within the year range
        if (day.recurring) {
          const dayDate = new Date(day.date);
          const dayMonth = dayDate.getMonth();
          const dayDay = dayDate.getDate();

          // Check if this recurring day falls within the current year
          const currentYear = yearStart.getFullYear();
          const recurringDate = new Date(currentYear, dayMonth, dayDay);

          if (recurringDate >= yearStart && recurringDate <= yearEnd) {
            const recurringDateKey = recurringDate.toISOString().slice(0, 10);
            if (!map.has(recurringDateKey)) {
              map.set(recurringDateKey, []);
            }
            map.get(recurringDateKey)!.push({
              day,
              calendarName: calendar.name,
            });
          }
        } else {
          // Non-recurring day - use exact date
          const dayDate = new Date(day.date);
          if (dayDate >= yearStart && dayDate <= yearEnd) {
            if (!map.has(dateKey)) {
              map.set(dateKey, []);
            }
            map.get(dateKey)!.push({
              day,
              calendarName: calendar.name,
            });
          }
        }
      });
    });

    return map;
  }, [planCalendars, yearStart, yearEnd]);

  // Create a map of milestone references by phaseId and date for quick lookup
  const milestoneReferencesMap = useMemo(() => {
    const map = new Map<string, PlanReference>();
    milestoneReferences.forEach((ref) => {
      if (ref.type === "milestone" && ref.date) {
        const key = `${ref.phaseId || ""}-${ref.date}`;
        map.set(key, ref);
      }
    });
    return map;
  }, [milestoneReferences]);

  const handleDayClick = useCallback(
    (date: string) => {
      // Check if there's already a milestone for this date
      const existingMilestone = milestones.find((m) => m.date === date);

      if (existingMilestone) {
        // If milestone exists, could open edit dialog or remove it
        // For now, we'll open edit dialog via a callback
        if (onMilestoneUpdate) {
          // This would typically open a dialog, but for simplicity
          // we'll just trigger the update callback
        }
      } else {
        // Create new milestone
        if (onMilestoneAdd) {
          const newMilestone: PlanMilestone = {
            id: `milestone-${Date.now()}`,
            date,
            name: `Milestone ${date}`,
          };
          onMilestoneAdd(newMilestone);
        }
      }
    },
    [milestones, onMilestoneAdd, onMilestoneUpdate]
  );

  // Function to scroll to a specific date
  const scrollToDate = useCallback(
    (dateStr: string) => {
      const el = containerRef.current;
      if (!el) return;

      // Validate date string
      if (!dateStr || typeof dateStr !== "string" || dateStr.trim() === "") {
        return; // Invalid date string, exit early
      }

      // Parse the date string (YYYY-MM-DD) and convert to Date object
      const dateParts = dateStr.split("-");
      if (dateParts.length !== 3) {
        return; // Invalid date format, exit early
      }

      const [year, month, day] = dateParts.map(Number);

      // Validate parsed numbers
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return; // Invalid date components, exit early
      }

      const targetDate = new Date(Date.UTC(year, month - 1, day));
      targetDate.setHours(0, 0, 0, 0);

      // Calculate day index
      let dayIndex = 0;
      if (targetDate < start) {
        dayIndex = 0;
      } else if (targetDate > end) {
        dayIndex = Math.max(0, days.length - 1);
      } else {
        dayIndex = Math.max(
          0,
          Math.min(
            days.length - 1,
            Math.floor(
              (targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            )
          )
        );
      }

      // Scroll to the calculated position
      const visibleWidth = Math.max(0, el.clientWidth);
      const target = dayIndex * pxPerDay - visibleWidth / 2;
      const left = Math.max(0, target);
      safeScrollToX(el, left, "smooth");
    },
    [start, end, days, pxPerDay]
  );

  // Expose scrollToDate function to parent via callback
  useEffect(() => {
    if (onScrollToDateReady) {
      onScrollToDateReady(scrollToDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToDate]); // Only depend on scrollToDate, not onScrollToDateReady

  const colors = getTimelineColors(theme);

  // App mode: show a single header (months/weeks/days) and phase-only timeline on the right,
  // with a static phases list on the left
  if (hideMainCalendar) {
    return (
      <div
        className="border rounded-md"
        style={{
          borderColor: colors.BORDER,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${labelWidth}px 1fr`,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Static phase list (left) */}
          <div
            className="border-r p-2 pt-0"
            style={{
              backgroundColor: colors.BACKGROUND,
              borderColor: colors.BORDER,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <PhasesList
              phases={phases}
              onAdd={onAddPhase ?? (() => {})}
              onEdit={onEditPhase ?? (() => {})}
              onAutoGenerate={onAutoGenerate}
              headerOffsetTopPx={TIMELINE_DIMENSIONS.TOTAL_HEIGHT + LANE_GAP + TOOLBAR_HEIGHT}
              calendarStart={start.toISOString().slice(0, 10)}
              calendarEnd={end.toISOString().slice(0, 10)}
            />
          </div>
          {/* Scrollable phase-only timeline (right) */}
          <div
            ref={containerRef}
            style={{
              overflowX: "auto",
              overflowY: "hidden", // Prevent vertical scroll to keep phases aligned
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: colors.TRACKS_BACKGROUND,
              position: "relative",
            }}
          >
            {/* Elegant floating toolbar - always visible above timeline */}
            <TimelineToolbar
              onJumpToToday={() => {
                const el = containerRef.current;
                if (!el) return;
                const index = typeof todayIndex === "number" ? todayIndex : 0;
                const visibleWidth = Math.max(0, el.clientWidth);
                const target = index * pxPerDay - visibleWidth / 2;
                const left = Math.max(0, target);
                safeScrollToX(el, left, "smooth");
              }}
              onSave={onSaveTimeline}
              hasChanges={hasTimelineChanges}
              isSaving={isSavingTimeline}
            />
            
            <div
              ref={contentRef}
              className="min-w-full"
              style={{
                width: width,
                minWidth: width,
                backgroundColor: colors.TRACKS_BACKGROUND,
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
            <GanttTimeline
              start={start}
              totalDays={totalDays}
              pxPerDay={pxPerDay}
              todayIndex={todayIndex}
              milestones={milestones}
              onJumpToToday={() => {
                const el = containerRef.current;
                if (!el) return;
                const index = typeof todayIndex === "number" ? todayIndex : 0;
                const visibleWidth = Math.max(0, el.clientWidth);
                const target = index * pxPerDay - visibleWidth / 2;
                const left = Math.max(0, target);
                safeScrollToX(el, left, "smooth");
              }}
              onDayClick={handleDayClick}
              cellData={cellData}
              onAddCellComment={(date) => {
                if (onAddCellComment) {
                  onAddCellComment("", date);
                }
              }}
              onAddCellFile={(date) => {
                if (onAddCellFile) {
                  onAddCellFile("", date);
                }
              }}
              onAddCellLink={(date) => {
                if (onAddCellLink) {
                  onAddCellLink("", date);
                }
              }}
              onToggleCellMilestone={(date) => {
                if (onToggleCellMilestone) {
                  onToggleCellMilestone("", date);
                }
              }}
            />
              {/* Tracks: phases only */}
              <div
                className="relative"
                style={{
                  height: phases.length * (trackHeight + 8) + 8,
                  backgroundColor: colors.TRACKS_BACKGROUND,
                }}
              >
                {/* Weekend shading across tracks */}
                {days.map((d, i) => {
                  const dow = d.getDay();
                  const dateKey = d.toISOString().slice(0, 10);
                  const calendarDays = calendarDaysMap.get(dateKey) || [];
                  const isWeekend = dow === 0 || dow === 6;
                  const isCalendarDay = calendarDays.length > 0;

                  // Weekend background
                  const weekendBg = isWeekend ? (
                    <div
                      key={`wk-${i}`}
                      className="absolute top-0 pointer-events-none z-0"
                      style={{
                        left: i * pxPerDay,
                        width: pxPerDay,
                        height: "100%",
                        backgroundColor: colors.WEEKEND_BG,
                      }}
                    />
                  ) : null;

                  // Calendar day marker (holiday/special day) - Green pastel with transparency
                  const calendarMarker = isCalendarDay ? (
                    <Tooltip
                      key={`cal-${i}`}
                      title={
                        <div style={{ fontSize: "0.8125rem", maxWidth: 300 }}>
                          <div style={{ fontWeight: 600, marginBottom: "6px", fontSize: "0.875rem" }}>
                            {calendarDays.length === 1
                              ? calendarDays[0].day.name
                              : `${calendarDays.length} día${calendarDays.length > 1 ? 's' : ''} especial${calendarDays.length > 1 ? 'es' : ''}`}
                          </div>
                          {calendarDays.map(({ day, calendarName }, idx) => (
                            <div 
                              key={idx} 
                              style={{ 
                                marginBottom: "6px",
                                paddingBottom: idx < calendarDays.length - 1 ? "6px" : 0,
                                borderBottom: idx < calendarDays.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                                <span style={{ fontWeight: 500, fontSize: "0.8125rem" }}>
                                  {day.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: day.type === "holiday" 
                                      ? "rgba(76, 175, 80, 0.2)" 
                                      : "rgba(33, 150, 243, 0.2)",
                                    color: day.type === "holiday" 
                                      ? "#4caf50" 
                                      : "#2196f3",
                                    fontWeight: 500,
                                  }}
                                >
                                  {day.type === "holiday" ? "Festivo" : "Especial"}
                                </span>
                              </div>
                              <div style={{ fontSize: "0.75rem", opacity: 0.85, marginBottom: "2px" }}>
                                📅 {calendarName}
                              </div>
                              {day.description && (
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    opacity: 0.9,
                                    marginTop: "4px",
                                    fontStyle: "italic",
                                    color: "rgba(255, 255, 255, 0.9)",
                                  }}
                                >
                                  {day.description}
                                </div>
                              )}
                              {day.recurring && (
                                <div
                                  style={{
                                    fontSize: "0.6875rem",
                                    opacity: 0.8,
                                    marginTop: "2px",
                                    color: "rgba(255, 255, 255, 0.7)",
                                  }}
                                >
                                  🔁 Recurrente
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      }
                      arrow
                      placement="top"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: 'rgba(0, 0, 0, 0.9)',
                            '& .MuiTooltip-arrow': {
                              color: 'rgba(0, 0, 0, 0.9)',
                            },
                          },
                        },
                      }}
                    >
                      <div
                        className="absolute top-0 pointer-events-auto z-5"
                        style={{
                          left: i * pxPerDay,
                          width: pxPerDay,
                          height: "100%",
                          backgroundColor: "rgba(129, 199, 132, 0.25)", // Green pastel with good transparency
                          borderLeft: `2px solid rgba(76, 175, 80, 0.4)`,
                          borderRight: `2px solid rgba(76, 175, 80, 0.4)`,
                          cursor: "help",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(129, 199, 132, 0.35)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(129, 199, 132, 0.25)";
                        }}
                      />
                    </Tooltip>
                  ) : null;

                  return (
                    <div key={`day-container-${i}`}>
                      {weekendBg}
                      {calendarMarker}
                    </div>
                  );
                })}
                {/* Phase lanes */}
                {phases.map((_, idx) => (
                  <GanttLane
                    key={`lane-${idx}`}
                    top={laneTop(idx)}
                    height={trackHeight}
                    index={idx}
                  />
                ))}
                {/* grid lines */}
                {days.map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0"
                    style={{
                      left: i * pxPerDay,
                      width: 0,
                      height: "100%",
                      borderLeft: `1px solid ${colors.BORDER_LIGHT}`,
                    }}
                  />
                ))}
                {/* Today marker across tracks */}
                {typeof todayIndex === "number" && (
                  <div
                    className="absolute top-0 z-10"
                    style={{
                      left: todayIndex * pxPerDay,
                      width: 0,
                      height: "100%",
                    }}
                  >
                    <TodayMarker className="h-full" />
                  </div>
                )}
                {/* Individual cells for each phase-day intersection */}
                {phases.map((ph, phaseIdx) => {
                  return days.map((day, dayIdx) => {
                    const dateKey = day.toISOString().slice(0, 10);
                    const cellDataForCell = cellData.find(
                      (cd) => cd.phaseId === ph.id && cd.date === dateKey
                    );
                    const milestoneKey = `${ph.id}-${dateKey}`;
                    const milestoneRef = milestoneReferencesMap.get(milestoneKey);
                    const top = laneTop(phaseIdx);
                    const left = dayIdx * pxPerDay;

                    return (
                      <GanttCell
                        key={`cell-${ph.id}-${dateKey}`}
                        phaseId={ph.id}
                        date={dateKey}
                        left={left}
                        top={top}
                        width={pxPerDay}
                        height={trackHeight}
                        cellData={cellDataForCell}
                        milestoneReference={milestoneRef}
                        onCellDataChange={onCellDataChange}
                        onAddComment={onAddCellComment}
                        onAddFile={onAddCellFile}
                        onAddLink={onAddCellLink}
                        onToggleMilestone={onToggleCellMilestone}
                      />
                    );
                  });
                })}
                {/* phase bars */}
                {phases.map((ph, idx) => {
                  if (!ph.startDate || !ph.endDate) return null;
                  const ts = new Date(ph.startDate);
                  const te = new Date(ph.endDate);
                  const offset = Math.max(0, daysBetween(start, ts));
                  const len = Math.max(1, daysBetween(ts, te));
                  const top = laneTop(idx);
                  const color = ph.color ?? theme.palette.secondary.main;
                  const tooltip = (
                    <div className="text-[11px] leading-3.5">
                      <div>
                        <strong>{ph.name}</strong>
                      </div>
                      <div>
                        {ts.toISOString().slice(0, 10)} →{" "}
                        {te.toISOString().slice(0, 10)}
                      </div>
                      <div>Duration: {len} days</div>
                      {ph.color ? <div>Color: {ph.color}</div> : null}
                    </div>
                  );
                  // Build weekday-only segments so weekends keep non-working color
                  const segments: { startIdx: number; length: number }[] = [];
                  let segStart: number | null = null;
                  for (let di = 0; di < len; di++) {
                    const dayIdx = offset + di;
                    const d = days[dayIdx];
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                    if (isWeekend) {
                      if (segStart !== null) {
                        segments.push({
                          startIdx: segStart,
                          length: dayIdx - segStart,
                        });
                        segStart = null;
                      }
                    } else {
                      if (segStart === null) segStart = dayIdx;
                    }
                  }
                  if (segStart !== null) {
                    segments.push({
                      startIdx: segStart,
                      length: offset + len - segStart,
                    });
                  }
                  if (segments.length === 0) return null;
                  return segments.map((seg, sIdx) => {
                    const left = seg.startIdx * pxPerDay;
                    const width = seg.length * pxPerDay;
                    return (
                      <PhaseBar
                        key={`${ph.id}-seg-${sIdx}`}
                        left={left}
                        top={top}
                        width={width}
                        height={trackHeight}
                        color={color}
                        label={sIdx === 0 ? ph.name : undefined}
                        title={`${ph.name} (${ph.startDate} → ${ph.endDate})`}
                        ariaLabel={`${ph.name} from ${ph.startDate} to ${ph.endDate}`}
                        tooltipContent={tooltip}
                        testIdSuffix={ph.id}
                        onDoubleClick={() => {
                          if (onEditPhase) onEditPhase(ph.id);
                        }}
                        onStartMove={(e) => {
                          const anchorIdx = clientXToDayIndex(e.clientX);
                          setEditDrag({
                            phaseId: ph.id,
                            phaseIdx: idx,
                            mode: "move",
                            anchorIdx,
                            currentIdx: anchorIdx,
                            originalStartIdx: offset,
                            originalLen: len,
                          });
                        }}
                        onStartResizeLeft={(e) => {
                          const anchorIdx = clientXToDayIndex(e.clientX);
                          setEditDrag({
                            phaseId: ph.id,
                            phaseIdx: idx,
                            mode: "resize-left",
                            anchorIdx,
                            currentIdx: anchorIdx,
                            originalStartIdx: offset,
                            originalLen: len,
                          });
                        }}
                        onStartResizeRight={(e) => {
                          const anchorIdx = clientXToDayIndex(e.clientX);
                          setEditDrag({
                            phaseId: ph.id,
                            phaseIdx: idx,
                            mode: "resize-right",
                            anchorIdx,
                            currentIdx: anchorIdx,
                            originalStartIdx: offset,
                            originalLen: len,
                          });
                        }}
                      />
                    );
                  });
                })}
              </div>
              {/* Empty space below tracks - seamless background */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  backgroundColor: colors.TRACKS_BACKGROUND,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border rounded-md"
      style={{
        borderColor: colors.BORDER,
      }}
    >
      <div
        className="grid items-start"
        style={{ gridTemplateColumns: `${labelWidth}px 1fr` }}
      >
        {/* Static phase list (left) */}
        <div
          className="border-r p-2"
          style={{
            backgroundColor: colors.BACKGROUND,
            borderColor: colors.BORDER,
          }}
        >
          <PhasesList
            phases={phases}
            onAdd={onAddPhase ?? (() => {})}
            onEdit={onEditPhase ?? (() => {})}
            onAutoGenerate={onAutoGenerate}
            calendarStart={startDate}
            calendarEnd={_endDate}
            onPhaseRangeChange={onPhaseRangeChange}
          />
        </div>
        {/* Scrollable calendar (right) */}
        <div
          ref={containerRef}
          className="overflow-auto"
          style={{
            backgroundColor: colors.TRACKS_BACKGROUND,
            overflowX: "auto",
            overflowY: "hidden", // Prevent vertical scroll to keep phases aligned
          }}
        >
          <div
            ref={contentRef}
            className="min-w-full"
            style={{
              width: width,
              minWidth: width,
              backgroundColor: colors.TRACKS_BACKGROUND,
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <GanttTimeline
              start={start}
              totalDays={totalDays}
              pxPerDay={pxPerDay}
              todayIndex={todayIndex}
              milestones={milestones}
              onJumpToToday={() => {
                const el = containerRef.current;
                if (!el) return;
                const index = typeof todayIndex === "number" ? todayIndex : 0;
                const visibleWidth = Math.max(0, el.clientWidth);
                const target = index * pxPerDay - visibleWidth / 2;
                const left = Math.max(0, target);
                safeScrollToX(el, left, "smooth");
              }}
              onDayClick={handleDayClick}
              cellData={cellData}
              onAddCellComment={(date) => {
                if (onAddCellComment) {
                  onAddCellComment("", date);
                }
              }}
              onAddCellFile={(date) => {
                if (onAddCellFile) {
                  onAddCellFile("", date);
                }
              }}
              onAddCellLink={(date) => {
                if (onAddCellLink) {
                  onAddCellLink("", date);
                }
              }}
              onToggleCellMilestone={(date) => {
                if (onToggleCellMilestone) {
                  onToggleCellMilestone("", date);
                }
              }}
              onSave={onSaveTimeline}
              hasTimelineChanges={hasTimelineChanges}
              isSaving={isSavingTimeline}
            />
            {/* Tracks */}
            <div
              className="relative"
              style={{
                height: (phases.length + tasks.length) * (trackHeight + 8) + 8,
                backgroundColor: colors.TRACKS_BACKGROUND,
              }}
            >
              {/* Phase lanes: ensure each phase has an exclusive row aligned to the calendar */}
              {phases.map((_, idx) => (
                <GanttLane
                  key={`lane-${idx}`}
                  top={laneTop(idx)}
                  height={trackHeight}
                  index={idx}
                />
              ))}
              {/* Task lanes to keep uniform row rhythm across the calendar */}
              {tasks.map((_, tIdx) => (
                <GanttLane
                  key={`lane-task-${tIdx}`}
                  top={laneTop(phases.length + tIdx)}
                  height={trackHeight}
                  index={phases.length + tIdx}
                />
              ))}
              {/* grid lines */}
              {days.map((_, i) => {
                return (
                  <div
                    key={i}
                    className="absolute top-0"
                    style={{
                      left: i * pxPerDay,
                      width: 0,
                      height: "100%",
                      borderLeft: `1px solid ${colors.BORDER_LIGHT}`,
                    }}
                  />
                );
              })}
              {/* Today marker across tracks */}
              {typeof todayIndex === "number" && (
                <div
                  className="absolute top-0"
                  style={{
                    left: todayIndex * pxPerDay,
                    width: 0,
                    height: "100%",
                    zIndex: 4,
                  }}
                >
                  <TodayMarker className="h-full" />
                </div>
              )}
              {/* phase bars (aligned within their dedicated lane) */}
              {phases.map((ph, idx) => {
                if (!ph.startDate || !ph.endDate) return null;
                const ts = new Date(ph.startDate);
                const te = new Date(ph.endDate);
                const offset = Math.max(0, daysBetween(start, ts));
                const len = Math.max(1, daysBetween(ts, te));
                const left = offset * pxPerDay;
                const barWidth = len * pxPerDay;
                const top = laneTop(idx);
                const color = ph.color ?? theme.palette.secondary.main;
                const tooltip = (
                  <div className="text-[11px] leading-3.5">
                    <div>
                      <strong>{ph.name}</strong>
                    </div>
                    <div>
                      {ts.toISOString().slice(0, 10)} →{" "}
                      {te.toISOString().slice(0, 10)}
                    </div>
                    <div>Duration: {len} days</div>
                    {ph.color ? <div>Color: {ph.color}</div> : null}
                  </div>
                );
                return (
                  <PhaseBar
                    key={ph.id}
                    left={left}
                    top={top}
                    width={barWidth}
                    height={trackHeight}
                    color={color}
                    label={ph.name}
                    title={`${ph.name} (${ph.startDate} → ${ph.endDate})`}
                    ariaLabel={`${ph.name} from ${ph.startDate} to ${ph.endDate}`}
                    tooltipContent={tooltip}
                    testIdSuffix={ph.id}
                    onStartMove={(e) => {
                      const anchorIdx = clientXToDayIndex(e.clientX);
                      setEditDrag({
                        phaseId: ph.id,
                        phaseIdx: idx,
                        mode: "move",
                        anchorIdx,
                        currentIdx: anchorIdx,
                        originalStartIdx: offset,
                        originalLen: len,
                      });
                    }}
                    onStartResizeLeft={(e) => {
                      const anchorIdx = clientXToDayIndex(e.clientX);
                      setEditDrag({
                        phaseId: ph.id,
                        phaseIdx: idx,
                        mode: "resize-left",
                        anchorIdx,
                        currentIdx: anchorIdx,
                        originalStartIdx: offset,
                        originalLen: len,
                      });
                    }}
                    onStartResizeRight={(e) => {
                      const anchorIdx = clientXToDayIndex(e.clientX);
                      setEditDrag({
                        phaseId: ph.id,
                        phaseIdx: idx,
                        mode: "resize-right",
                        anchorIdx,
                        currentIdx: anchorIdx,
                        originalStartIdx: offset,
                        originalLen: len,
                      });
                    }}
                  />
                );
              })}
              {/* selection preview */}
              {drag
                ? (() => {
                    const a = Math.min(drag.startIdx, drag.currentIdx);
                    const b = Math.max(drag.startIdx, drag.currentIdx);
                    const left = a * pxPerDay;
                    const widthSel = (b - a + 1) * pxPerDay;
                    const top = laneTop(drag.phaseIdx);
                    return (
                      <PreviewContainer
                        left={left}
                        top={top}
                        width={widthSel}
                        height={trackHeight}
                        zIndex={5}
                      >
                        <Preview />
                      </PreviewContainer>
                    );
                  })()
                : null}
              {editDrag
                ? (() => {
                    const {
                      mode,
                      currentIdx,
                      originalStartIdx,
                      originalLen,
                      phaseIdx,
                      anchorIdx,
                    } = editDrag;
                    let newStartIdx = originalStartIdx;
                    let newLen = originalLen;
                    if (mode === "move") {
                      const delta = currentIdx - anchorIdx;
                      newStartIdx = Math.max(
                        0,
                        Math.min(
                          days.length - originalLen,
                          originalStartIdx + delta
                        )
                      );
                      newLen = originalLen;
                    } else if (mode === "resize-left") {
                      newStartIdx = Math.max(
                        0,
                        Math.min(originalStartIdx + originalLen - 1, currentIdx)
                      );
                      newLen = Math.max(
                        1,
                        originalStartIdx + originalLen - newStartIdx
                      );
                    } else if (mode === "resize-right") {
                      const proposedEnd = Math.max(
                        originalStartIdx + 1,
                        currentIdx
                      );
                      newLen = Math.max(
                        1,
                        Math.min(
                          days.length - originalStartIdx,
                          proposedEnd - originalStartIdx
                        )
                      );
                    }
                    const left = newStartIdx * pxPerDay;
                    const widthSel = newLen * pxPerDay;
                    const top = laneTop(phaseIdx);
                    return (
                      <PreviewContainer
                        left={left}
                        top={top}
                        width={widthSel}
                        height={trackHeight}
                        zIndex={6}
                      >
                        <Preview />
                      </PreviewContainer>
                    );
                  })()
                : null}
              {/* Individual cells for each phase-day intersection */}
              {phases.map((ph, phaseIdx) => {
                return days.map((day, dayIdx) => {
                  const dateKey = day.toISOString().slice(0, 10);
                  const cellDataForCell = cellData.find(
                    (cd) => cd.phaseId === ph.id && cd.date === dateKey
                  );
                  const top = laneTop(phaseIdx);
                  const left = dayIdx * pxPerDay;

                  return (
                    <GanttCell
                      key={`cell-${ph.id}-${dateKey}`}
                      phaseId={ph.id}
                      date={dateKey}
                      left={left}
                      top={top}
                      width={pxPerDay}
                      height={trackHeight}
                      cellData={cellDataForCell}
                      onCellDataChange={onCellDataChange}
                      onAddComment={onAddCellComment}
                      onAddFile={onAddCellFile}
                      onAddLink={onAddCellLink}
                      onToggleMilestone={onToggleCellMilestone}
                    />
                  );
                });
              })}
              {/* interactive overlays for phases (span entire lane) - for drag selection */}
              {phases.map((ph, idx) => {
                const top = laneTop(idx);
                return (
                  <div
                    key={`ol-${ph.id}`}
                    className="absolute z-10"
                    style={{
                      left: 0,
                      top,
                      width: width,
                      height: trackHeight,
                      cursor: "crosshair",
                      pointerEvents: "auto",
                    }}
                    onMouseDown={(e) => {
                      // Only handle if not right-clicking (context menu)
                      if (e.button === 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        const dayIdx = clientXToDayIndex(e.clientX);
                        setDrag({
                          phaseId: ph.id,
                          phaseIdx: idx,
                          startIdx: dayIdx,
                          currentIdx: dayIdx,
                        });
                      }
                    }}
                    onClick={(e) => {
                      // Only handle left click
                      if (e.button === 0) {
                        const dayIdx = clientXToDayIndex(e.clientX);
                        const s = days[dayIdx].toISOString().slice(0, 10);
                        showSelectedDayAlert(s);
                      }
                    }}
                    onDoubleClick={() => {
                      if (onEditPhase) onEditPhase(ph.id);
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
                const top = laneTop(phases.length + idx);
                const color = t.color ?? theme.palette.primary.main;
                return (
                  <TaskBar
                    key={t.id}
                    left={left}
                    top={top}
                    width={barWidth}
                    height={trackHeight}
                    color={color}
                    label={t.title}
                    title={`${t.title} (${t.startDate} → ${t.endDate})`}
                  />
                );
              })}
            </div>
            {/* Empty space below tracks - seamless background */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                backgroundColor: colors.TRACKS_BACKGROUND,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Force Vite cache refresh - updated to use API instead of Redux
