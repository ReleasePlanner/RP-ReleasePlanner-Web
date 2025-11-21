import { memo } from "react";
import { Box } from "@mui/material";
import { PhaseEditButton } from "./PhaseEditButton";
import { PhaseColorIndicator } from "./PhaseColorIndicator";
import type { PhaseListItemStyles } from "../hooks/usePhaseListItemStyles";

export type PhaseHeaderProps = {
  readonly phaseId: string;
  readonly color: string;
  readonly onEdit: (id: string) => void;
  readonly styles: PhaseListItemStyles;
  readonly isDark: boolean;
};

export const PhaseHeader = memo(function PhaseHeader({
  phaseId,
  color,
  onEdit,
  styles,
  isDark,
}: PhaseHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <PhaseEditButton
        phaseId={phaseId}
        onEdit={onEdit}
        styles={styles}
        isDark={isDark}
      />
      <PhaseColorIndicator color={color} />
    </Box>
  );
});

