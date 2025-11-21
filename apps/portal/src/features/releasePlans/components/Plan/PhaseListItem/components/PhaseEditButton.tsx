import { memo } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { PhaseActionButton } from "./PhaseActionButton";
import type { PhaseListItemStyles } from "../hooks/usePhaseListItemStyles";

export type PhaseEditButtonProps = {
  readonly phaseId: string;
  readonly onEdit: (id: string) => void;
  readonly styles: PhaseListItemStyles;
  readonly isDark: boolean;
};

export const PhaseEditButton = memo(function PhaseEditButton({
  phaseId,
  onEdit,
  styles,
  isDark,
}: PhaseEditButtonProps) {
  return (
    <PhaseActionButton
      ariaLabel="Edit phase"
      tooltip="Edit phase"
      icon={<BorderColorOutlinedIcon sx={styles.iconBase} />}
      onClick={onEdit}
      phaseId={phaseId}
      iconButtonBaseStyles={styles.iconButtonBase}
      iconBaseStyles={styles.iconBase}
      buttonStyles={{
        ...styles.getEditButtonStyles(isDark),
        mr: 0.125,
      }}
    />
  );
});

