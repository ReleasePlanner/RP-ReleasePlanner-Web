import { memo, useCallback } from "react";
import { Paper, Box } from "@mui/material";
import type { PlanPhase } from "../../../../types";
import PhaseListItem from "../../PhaseListItem/PhaseListItem";
import MiniPhaseTimeline from "../../MiniPhaseTimeline/MiniPhaseTimeline";
import { TRACK_HEIGHT, LANE_GAP, LABEL_WIDTH } from "../../../Gantt/constants";
import type { PhasesListStyles } from "../hooks/usePhasesListStyles";

export type PhaseRowProps = {
  readonly phase: PlanPhase;
  readonly isLast: boolean;
  readonly onEdit: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onView?: (id: string) => void;
  readonly calendarStart?: string;
  readonly calendarEnd?: string;
  readonly onPhaseRangeChange?: (id: string, start: string, end: string) => void;
  readonly styles: PhasesListStyles;
};

export const PhaseRow = memo(function PhaseRow({
  phase,
  isLast,
  onEdit,
  onDelete,
  onView,
  calendarStart,
  calendarEnd,
  onPhaseRangeChange,
  styles,
}: PhaseRowProps) {
  const handleRangeChange = useCallback(
    (start: string, end: string) => {
      if (onPhaseRangeChange) {
        onPhaseRangeChange(phase.id, start, end);
      }
    },
    [phase.id, onPhaseRangeChange]
  );

  const paperStyles = styles.getPaperStyles(isLast);

  return (
    <Paper
      elevation={0}
      sx={{
        ...paperStyles,
        height: TRACK_HEIGHT,
        marginBottom: isLast ? 0 : `${LANE_GAP}px`,
      }}
    >
      <Box
        sx={{
          width: LABEL_WIDTH,
          pr: 1,
          pl: 0.5,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          overflow: "visible",
          minWidth: LABEL_WIDTH,
          position: "relative",
          zIndex: 1,
        }}
      >
        <PhaseListItem
          id={phase.id}
          name={phase.name}
          startDate={phase.startDate}
          endDate={phase.endDate}
          color={phase.color}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      </Box>
      {calendarStart && calendarEnd && (
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "stretch",
            minWidth: 0,
          }}
        >
          <MiniPhaseTimeline
            phase={phase}
            calendarStart={calendarStart}
            calendarEnd={calendarEnd}
            height={TRACK_HEIGHT}
            onRangeChange={handleRangeChange}
          />
        </Box>
      )}
    </Paper>
  );
});

