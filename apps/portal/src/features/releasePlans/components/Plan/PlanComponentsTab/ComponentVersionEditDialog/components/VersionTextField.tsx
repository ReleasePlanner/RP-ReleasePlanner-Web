import { memo } from "react";
import { TextField } from "@mui/material";

export type VersionTextFieldProps = {
  readonly value: string;
  readonly error: string;
  readonly onChange: (value: string) => void;
};

export const VersionTextField = memo(function VersionTextField({
  value,
  error,
  onChange,
}: VersionTextFieldProps) {
  return (
    <TextField
      id="component-final-version-input"
      name="componentFinalVersion"
      label="New Version"
      fullWidth
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g., 1.0.0"
      error={!!error}
      helperText={error || "Enter the new version that will be used in this release plan"}
      variant="outlined"
      size="small"
      slotProps={{
        htmlInput: {
          pattern: String.raw`\d+(\.\d+)*`,
          inputMode: "numeric",
        },
      }}
    />
  );
});

