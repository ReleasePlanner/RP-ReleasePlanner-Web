import { List, Box } from "@mui/material";
import type { PlanPhase } from "../../../types";
import { TRACK_HEIGHT } from "../../Gantt/constants";
import {
  PhaseSpacer,
  AddPhaseButton,
  AutoGenerateButton,
  PhaseRow,
} from "./components";
import { usePhasesListStyles } from "./hooks";

export type PhasesListProps = {
  readonly phases: PlanPhase[];
  readonly onAdd: () => void;
  readonly onEdit: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly onView?: (id: string) => void;
  readonly onAutoGenerate?: () => void;
  readonly calendarStart?: string;
  readonly calendarEnd?: string;
  readonly headerOffsetTopPx?: number;
  readonly onPhaseRangeChange?: (
    id: string,
    start: string,
    end: string
  ) => void;
};

export default function PhasesList({
  phases,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onAutoGenerate,
  calendarStart,
  calendarEnd,
  headerOffsetTopPx,
  onPhaseRangeChange,
}: PhasesListProps) {
  const styles = usePhasesListStyles();

  return (
    <Box sx={{ position: "relative" }}>
      <PhaseSpacer headerOffsetTopPx={headerOffsetTopPx} />

      <List
        dense
        disablePadding
        sx={{
          "& .MuiListItem-root": {
            minHeight: TRACK_HEIGHT,
            padding: 0,
          },
        }}
      >
        <AddPhaseButton onAdd={onAdd} styles={styles} />

        {phases.map((phase, index) => (
          <PhaseRow
            key={phase.id}
            phase={phase}
            isLast={index === phases.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            calendarStart={calendarStart}
            calendarEnd={calendarEnd}
            onPhaseRangeChange={onPhaseRangeChange}
            styles={styles}
          />
        ))}
      </List>

      {onAutoGenerate && (
        <AutoGenerateButton onAutoGenerate={onAutoGenerate} styles={styles} />
      )}
    </Box>
  );
}
