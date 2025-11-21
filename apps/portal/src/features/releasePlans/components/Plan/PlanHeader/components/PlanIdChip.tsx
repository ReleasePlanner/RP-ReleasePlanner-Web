import { Chip, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export type PlanIdChipProps = {
  readonly id: string;
  readonly sx?: SxProps<Theme>;
};

export function PlanIdChip({ id, sx }: PlanIdChipProps) {
  return (
    <Tooltip title="Plan ID" arrow placement="top">
      <Chip
        label={id}
        size="small"
        variant="outlined"
        id={`plan-header-id-${id}`}
        data-testid={`plan-header-id-${id}`}
        aria-label={`Plan ID: ${id}`}
        sx={sx}
      />
    </Tooltip>
  );
}

