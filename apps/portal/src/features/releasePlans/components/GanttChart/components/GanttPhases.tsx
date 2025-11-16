import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { daysBetween } from "../../../lib/date";
import { laneTop } from "../../Gantt/utils";
import PhaseBar from "../../Gantt/PhaseBar/PhaseBar";
import type { PlanPhase } from "../../../types";

export type GanttPhasesProps = {
  phases: PlanPhase[];
  start: Date;
  days: Date[];
  pxPerDay: number;
  trackHeight: number;
  onEditPhase?: (id: string) => void;
  clientXToDayIndex: (clientX: number) => number;
  setEditDrag: (drag: {
    phaseId: string;
    phaseIdx: number;
    mode: "move" | "resize-left" | "resize-right";
    anchorIdx: number;
    currentIdx: number;
    originalStartIdx: number;
    originalLen: number;
  }) => void;
};

/**
 * Renders all phase bars in the Gantt chart
 * Follows SRP - only handles phase visualization and interactions
 */
export function GanttPhases({
  phases,
  start,
  days,
  pxPerDay,
  trackHeight,
  onEditPhase,
  clientXToDayIndex,
  setEditDrag,
}: GanttPhasesProps) {
  const theme = useTheme();

  // Create segments for phases (excluding weekends)
  const phaseSegments = useMemo(() => {
    return phases
      .map((phase, idx) => {
        if (!phase.startDate || !phase.endDate) return null;

        const ts = new Date(phase.startDate);
        const te = new Date(phase.endDate);
        const offset = Math.max(0, daysBetween(start, ts));
        const len = Math.max(1, daysBetween(ts, te));
        const top = laneTop(idx);
        const color = phase.color ?? theme.palette.secondary.main;

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

        return {
          phase,
          idx,
          top,
          color,
          offset,
          len,
          segments,
        };
      })
      .filter(Boolean);
  }, [phases, start, days, theme.palette.secondary.main]);

  const tooltip = (phase: PlanPhase, len: number) => (
    <div className="text-[11px] leading-3.5">
      <div>
        <strong>{phase.name}</strong>
      </div>
      <div>
        {phase.startDate} → {phase.endDate}
      </div>
      <div>Duration: {len} days</div>
      {phase.color && <div>Color: {phase.color}</div>}
    </div>
  );

  return (
    <>
      {phaseSegments.flatMap((phaseData) => {
        if (!phaseData) return [];

        const { phase, idx, top, color, offset, len, segments } = phaseData;

        if (segments.length === 0) return [];

        return segments.map((seg, sIdx) => {
          const left = seg.startIdx * pxPerDay;
          const width = seg.length * pxPerDay;

          return (
            <PhaseBar
              key={`${phase.id}-seg-${sIdx}`}
              left={left}
              top={top}
              width={width}
              height={trackHeight}
              color={color}
              label={sIdx === 0 ? phase.name : undefined}
              title={`${phase.name} (${phase.startDate} → ${phase.endDate})`}
              ariaLabel={`${phase.name} from ${phase.startDate} to ${phase.endDate}`}
              tooltipContent={tooltip(phase, len)}
              testIdSuffix={phase.id}
              onDoubleClick={() => {
                if (onEditPhase) onEditPhase(phase.id);
              }}
              onStartMove={(e) => {
                const anchorIdx = clientXToDayIndex(e.clientX);
                setEditDrag({
                  phaseId: phase.id,
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
                  phaseId: phase.id,
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
                  phaseId: phase.id,
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
    </>
  );
}
