import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

export type TimelineTheme = {
  backgroundColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderLight: string;
  borderMedium: string;
};

export function useTimelineTheme(): TimelineTheme {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return useMemo(
    () => ({
      backgroundColor: isDark
        ? theme.palette.background.paper
        : "#ffffff",
      textPrimary: isDark ? "rgba(255, 255, 255, 0.95)" : "#374151",
      textSecondary: isDark ? "rgba(255, 255, 255, 0.75)" : "#6b7280",
      textMuted: isDark ? "rgba(255, 255, 255, 0.65)" : "#9ca3af",
      borderLight: isDark ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
      borderMedium: isDark ? "rgba(255, 255, 255, 0.15)" : "#d1d5db",
    }),
    [isDark, theme.palette.background.paper]
  );
}

