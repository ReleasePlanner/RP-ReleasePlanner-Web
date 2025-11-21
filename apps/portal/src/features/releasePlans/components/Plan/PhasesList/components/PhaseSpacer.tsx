import { memo } from "react";
import { Box } from "@mui/material";
import { TRACK_HEIGHT, LANE_GAP } from "../../../Gantt/constants";

export type PhaseSpacerProps = {
  readonly headerOffsetTopPx?: number;
};

export const PhaseSpacer = memo(function PhaseSpacer({
  headerOffsetTopPx,
}: PhaseSpacerProps) {
  const height = Math.max(
    0,
    (headerOffsetTopPx ?? 0) - (TRACK_HEIGHT + LANE_GAP)
  );

  return <Box sx={{ height }} />;
});

