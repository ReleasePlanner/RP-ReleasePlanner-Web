import { useCallback } from "react";
import type { PlanPhase } from "../../../types";
import GanttLane from "../../Gantt/GanttLane/GanttLane";
import PhaseBar from "../../Gantt/PhaseBar/PhaseBar";
import { useLanePositions } from "../../../hooks";
import { GANTT_DIMENSIONS } from "../../../constants";

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
  totalDays,
  pxPerDay,
  onPhaseRangeChange,
  onEditPhase,
}: PhaseTracksProps) {
  const lanePositions = useLanePositions(phases);

  const showSelectedDayAlert = useCallback((isoDate: string) => {
    if (typeof window !== "undefined" && typeof window.alert === "function") {
      try {
        window.alert(`Selected day: ${isoDate}`);
      } catch {
        /* ignore alert errors in test environment (jsdom) */
      }
    }
  }, []);

  return (
    <>
      {/* Phase lanes (clickable areas) */}
      {phases.map((phase) => {
        const top = lanePositions.get(phase.id) ?? 0;
        return (
          <GanttLane
            key={`lane-${phase.id}`}
            phaseId={phase.id}
            phaseName={phase.name}
            top={top}
            width={totalDays * pxPerDay}
            height={GANTT_DIMENSIONS.TRACK_HEIGHT}
            start={start}
            totalDays={totalDays}
            pxPerDay={pxPerDay}
            onDateRangeSelected={(startDate, endDate) => {
              if (startDate === endDate) {
                showSelectedDayAlert(startDate);
              }
              onPhaseRangeChange?.(phase.id, startDate, endDate);
            }}
          />
        );
      })}

      {/* Phase bars (visual indicators) */}
      {phases.map((phase) => {
        if (!phase.startDate || !phase.endDate) return null;

        const top = lanePositions.get(phase.id) ?? 0;
        return (
          <PhaseBar
            key={`bar-${phase.id}`}
            phaseId={phase.id}
            phaseName={phase.name}
            startDate={phase.startDate}
            endDate={phase.endDate}
            color={phase.color || "#217346"}
            top={top}
            height={GANTT_DIMENSIONS.TRACK_HEIGHT}
            start={start}
            pxPerDay={pxPerDay}
            onEdit={() => onEditPhase?.(phase.id)}
            onRangeChange={onPhaseRangeChange}
          />
        );
      })}
    </>
  );
}
