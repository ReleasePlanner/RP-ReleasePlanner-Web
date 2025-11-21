import { TextField, Box, InputAdornment, useTheme, alpha } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useCallback } from "react";
import type { PhaseFormData, PhaseFormErrors } from "../hooks/usePhaseForm";
import { getNameHelperText } from "./helpers";

export type PhaseNameFieldProps = {
  isBasePhase: boolean;
  phaseName?: string;
  formData: PhaseFormData;
  errors: PhaseFormErrors;
  isValidating: boolean;
  hasInteracted: boolean;
  onNameChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

export function PhaseNameField({
  isBasePhase,
  phaseName,
  formData,
  errors,
  isValidating,
  hasInteracted,
  onNameChange,
  onKeyDown,
}: PhaseNameFieldProps) {
  const theme = useTheme();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onNameChange(e.target.value);
    },
    [onNameChange]
  );

  if (isBasePhase) {
    // Read-only display for base phases
    return (
      <TextField
        fullWidth
        size="small"
        label="Phase Name"
        value={phaseName || ""}
        disabled
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
            },
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.text.disabled,
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "0.6875rem",
            backgroundColor: alpha(theme.palette.action.hover, 0.3),
          },
          "& input": {
            py: 0.625,
            fontSize: "0.6875rem",
          },
        }}
      />
    );
  }

  // Editable field for local phases
  return (
    <TextField
      autoFocus
      fullWidth
      size="small"
      label="Phase Name"
      placeholder="e.g., Planning, Development, Testing..."
      value={formData.name}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      error={!!errors.name}
      slotProps={{
        inputLabel: {
          sx: {
            fontSize: "0.625rem",
            fontWeight: 500,
          },
        },
      }}
      helperText={getNameHelperText(errors.name, isValidating, formData.name, theme)}
      sx={{
        "& .MuiOutlinedInput-root": {
          fontSize: "0.6875rem",
        },
        "& input": {
          py: 0.625,
          fontSize: "0.6875rem",
        },
        "& .MuiFormHelperText-root": {
          fontSize: "0.625rem",
          mt: 0.5,
        },
      }}
    />
  );
}

