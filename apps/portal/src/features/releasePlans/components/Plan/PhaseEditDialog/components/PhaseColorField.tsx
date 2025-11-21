import {
  TextField,
  Box,
  Alert,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ErrorOutline as ErrorIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useCallback } from "react";
import type { PhaseFormData, PhaseFormErrors } from "../hooks/usePhaseForm";

export type PhaseColorFieldProps = {
  isBasePhase: boolean;
  phaseColor?: string;
  formData: PhaseFormData;
  errors: PhaseFormErrors;
  onColorChange: (value: string) => void;
};

export function PhaseColorField({
  isBasePhase,
  phaseColor,
  formData,
  errors,
  onColorChange,
}: PhaseColorFieldProps) {
  const theme = useTheme();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    },
    [onColorChange]
  );

  if (isBasePhase) {
    // Read-only display for base phases
    return (
      <TextField
        fullWidth
        size="small"
        label="Phase Color"
        value={phaseColor || "#185ABD"}
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
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: phaseColor || "#185ABD",
                    border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                    flexShrink: 0,
                    boxShadow: theme.shadows[1],
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
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
    <Box>
      <TextField
        label="Phase Color"
        type="color"
        fullWidth
        size="small"
        value={formData.color}
        onChange={handleChange}
        error={!!errors.color}
        helperText={
          errors.color ||
          "Color must be unique and different from base phases and other plan phases"
        }
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
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: formData.color,
                    border: `2px solid ${
                      errors.color
                        ? theme.palette.error.main
                        : alpha(theme.palette.divider, 0.2)
                    }`,
                    flexShrink: 0,
                    boxShadow: theme.shadows[1],
                  }}
                />
              </InputAdornment>
            ),
          },
          htmlInput: {
            style: { padding: 0, height: 40, borderRadius: 4 },
          },
        }}
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
      {errors.color && (
        <Alert
          severity="error"
          icon={<ErrorIcon sx={{ fontSize: 14 }} />}
          sx={{
            mt: 1,
            borderRadius: 1.5,
            "& .MuiAlert-message": {
              fontSize: "0.6875rem",
            },
            py: 0.75,
          }}
        >
          {errors.color}
        </Alert>
      )}
    </Box>
  );
}

