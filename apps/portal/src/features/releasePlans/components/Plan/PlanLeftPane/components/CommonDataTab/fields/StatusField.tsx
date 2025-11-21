import { Box, Select, MenuItem, Typography, useTheme, alpha } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { PlanStatus } from "../../../../../../types";

export type StatusFieldProps = {
  readonly value: PlanStatus;
  readonly onChange: (value: PlanStatus) => void;
};

export function StatusField({ value, onChange }: StatusFieldProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 0.5,
          display: "block",
        }}
      >
        Status <span style={{ color: theme.palette.error.main }}>*</span>
      </Typography>
      <Select
        id="plan-status-select"
        name="planStatus"
        value={value}
        onChange={(e: SelectChangeEvent) =>
          onChange(e.target.value as PlanStatus)
        }
        displayEmpty
        size="small"
        sx={{
          width: "100%",
          fontSize: "0.6875rem",
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.paper, 0.5)
              : "background.paper",
          "& .MuiSelect-select": {
            py: 0.625,
            fontSize: "0.6875rem",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.divider, 0.2),
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1.5,
          },
        }}
      >
        <MenuItem
          value="planned"
          sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
        >
          Planned
        </MenuItem>
        <MenuItem
          value="in_progress"
          sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
        >
          In Progress
        </MenuItem>
        <MenuItem
          value="done"
          sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
        >
          Done
        </MenuItem>
        <MenuItem
          value="paused"
          sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
        >
          Paused
        </MenuItem>
      </Select>
    </Box>
  );
}

