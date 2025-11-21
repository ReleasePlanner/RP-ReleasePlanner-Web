import { memo } from "react";
import { Box } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { PhaseActionButton } from "./PhaseActionButton";
import type { PhaseListItemStyles } from "../hooks/usePhaseListItemStyles";

export type PhaseActionsProps = {
  readonly phaseId: string;
  readonly onDelete?: (id: string) => void;
  readonly onView?: (id: string) => void;
  readonly styles: PhaseListItemStyles;
  readonly isDark: boolean;
};

export const PhaseActions = memo(function PhaseActions({
  phaseId,
  onDelete,
  onView,
  styles,
  isDark,
}: PhaseActionsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.125,
        flexShrink: 0,
        ml: 0.5,
        minWidth: "fit-content",
        overflow: "visible",
        position: "relative",
        zIndex: 10,
      }}
    >
      {onView && (
        <PhaseActionButton
          ariaLabel="View phase"
          tooltip="Ver detalles"
          icon={<RemoveRedEyeOutlinedIcon sx={styles.iconBase} />}
          onClick={onView}
          phaseId={phaseId}
          iconButtonBaseStyles={styles.iconButtonBase}
          iconBaseStyles={styles.iconBase}
          buttonStyles={styles.getViewButtonStyles(isDark)}
        />
      )}

      {onDelete && (
        <PhaseActionButton
          ariaLabel="Delete phase"
          tooltip="Delete phase"
          icon={<DeleteOutlineIcon sx={styles.iconBase} />}
          onClick={onDelete}
          phaseId={phaseId}
          iconButtonBaseStyles={styles.iconButtonBase}
          iconBaseStyles={styles.iconBase}
          buttonStyles={styles.getDeleteButtonStyles(isDark)}
        />
      )}
    </Box>
  );
});

