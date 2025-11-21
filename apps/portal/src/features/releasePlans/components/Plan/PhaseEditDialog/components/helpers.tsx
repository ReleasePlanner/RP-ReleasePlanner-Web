import { Box } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import type { Theme } from "@mui/material/styles";
import type { PhaseFormErrors } from "../hooks/usePhaseForm";

export function getNameHelperText(
  nameError: string | undefined,
  isValidating: boolean,
  name: string,
  theme: Theme
): React.ReactNode {
  if (nameError) {
    return (
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.625rem",
        }}
      >
        <ErrorIcon sx={{ fontSize: 12 }} />
        {nameError}
      </Box>
    );
  }
  if (isValidating) {
    return "Validating...";
  }
  if (name.trim()) {
    return (
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.625rem",
          color: theme.palette.success.main,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 12 }} />
        Name available
      </Box>
    );
  }
  return "Enter a unique name for the phase";
}

