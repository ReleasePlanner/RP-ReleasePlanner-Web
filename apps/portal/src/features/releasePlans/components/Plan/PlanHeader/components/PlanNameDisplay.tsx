import { Box, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export type PlanNameDisplayProps = {
  readonly id: string;
  readonly name: string;
  readonly onClick: () => void;
  readonly sx?: SxProps<Theme>;
};

export function PlanNameDisplay({
  id,
  name,
  onClick,
  sx,
}: PlanNameDisplayProps) {
  return (
    <Tooltip title="Click to edit" arrow placement="top">
      <Box
        component="h2"
        id={`plan-header-name-${id}`}
        data-testid={`plan-header-name-${id}`}
        aria-label={`Plan Name: ${name}`}
        onClick={onClick}
        sx={sx}
      >
        {name}
      </Box>
    </Tooltip>
  );
}

