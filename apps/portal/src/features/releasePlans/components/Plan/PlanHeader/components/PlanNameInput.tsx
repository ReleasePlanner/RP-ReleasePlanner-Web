import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export type PlanNameInputProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
  readonly onKeyDown: (e: React.KeyboardEvent) => void;
  readonly sx?: SxProps<Theme>;
};

export function PlanNameInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
  sx,
}: PlanNameInputProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      variant="standard"
      size="small"
      autoFocus
      sx={sx}
    />
  );
}

