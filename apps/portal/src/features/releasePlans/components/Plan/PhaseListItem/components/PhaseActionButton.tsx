import { memo, useCallback } from "react";
import { IconButton, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export type PhaseActionButtonProps = {
  readonly ariaLabel: string;
  readonly tooltip: string;
  readonly icon: React.ReactNode;
  readonly onClick: (id: string) => void;
  readonly phaseId: string;
  readonly iconButtonBaseStyles: React.CSSProperties;
  readonly iconBaseStyles: React.CSSProperties;
  readonly buttonStyles: SxProps<Theme>;
};

export const PhaseActionButton = memo(function PhaseActionButton({
  ariaLabel,
  tooltip,
  icon,
  onClick,
  phaseId,
  iconButtonBaseStyles,
  iconBaseStyles,
  buttonStyles,
}: PhaseActionButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(phaseId);
    },
    [onClick, phaseId]
  );

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <IconButton
        size="small"
        aria-label={ariaLabel}
        onClick={handleClick}
        sx={{
          ...iconButtonBaseStyles,
          ...buttonStyles,
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
});

