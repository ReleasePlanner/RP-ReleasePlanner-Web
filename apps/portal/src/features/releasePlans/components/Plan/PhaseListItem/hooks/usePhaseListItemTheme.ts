import { useMemo } from "react";
import { useTheme } from "@mui/material";

export type PhaseListItemTheme = {
  isDark: boolean;
  phaseColor: string;
  textPrimary: string;
  textSecondary: string;
};

export function usePhaseListItemTheme(
  color?: string
): PhaseListItemTheme {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return useMemo(
    () => ({
      isDark,
      phaseColor: color ?? theme.palette.secondary.main,
      textPrimary: theme.palette.text.primary,
      textSecondary: theme.palette.text.secondary,
    }),
    [isDark, color, theme.palette.secondary.main, theme.palette.text.primary, theme.palette.text.secondary]
  );
}

