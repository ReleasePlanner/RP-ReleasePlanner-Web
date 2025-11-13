// Simplified phase track rendering without selection callbacks for now
import type { PlanPhase } from "../../../types";
import GanttLane from "../../Gantt/GanttLane/GanttLane";
import PhaseBar from "../../Gantt/PhaseBar/PhaseBar";
import { useLanePositions } from "../../../hooks";
import { GANTT_DIMENSIONS } from "../../../constants";
import { daysBetween } from "../../../lib/date";

export type PhaseTracksProps = {
  phases: PlanPhase[];
  start: Date;
  totalDays: number;
  pxPerDay: number;
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  onEditPhase?: (id: string) => void;
};

/**
 * Renders all phase tracks with lanes and phase bars
 * Encapsulates phase-specific rendering logic
 */
export function PhaseTracks({
  phases,
  start,
  pxPerDay,
  onEditPhase,
}: PhaseTracksProps) {
  const lanePositions = useLanePositions(phases);

  // PhaseTracks simplified: selection + range callbacks delegated to parent

  return (
    <>
      {/* Phase lanes (clickable areas) */}
      {phases.map((phase, idx) => {
        const top = lanePositions.get(phase.id) ?? 0;
        return (
          <GanttLane
            key={`lane-${phase.id}`}
            top={top}
            height={GANTT_DIMENSIONS.TRACK_HEIGHT}
            index={idx}
          />
        );
      })}

      {/* Phase bars (visual indicators) */}
      {phases.map((phase) => {
        if (!phase.startDate || !phase.endDate) return null;
        const top = lanePositions.get(phase.id) ?? 0;
        const ts = new Date(phase.startDate);
        const te = new Date(phase.endDate);
        const offset = Math.max(0, daysBetween(start, ts));
        const len = Math.max(1, daysBetween(ts, te));
        const left = offset * pxPerDay;
        const width = len * pxPerDay;
        return (
          <PhaseBar
            key={`bar-${phase.id}`}
            left={left}
            top={top}
            width={width}
            height={GANTT_DIMENSIONS.TRACK_HEIGHT}
            color={phase.color || "#217346"}
            label={phase.name}
            title={`${phase.name} (${phase.startDate} → ${phase.endDate})`}
            ariaLabel={`${phase.name} from ${phase.startDate} to ${phase.endDate}`}
            testIdSuffix={phase.id}
            onDoubleClick={() => onEditPhase?.(phase.id)}
          />
        );
      })}
    </>
  );
}
