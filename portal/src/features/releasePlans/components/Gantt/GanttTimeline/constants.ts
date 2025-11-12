import type { Theme } from "@mui/material/styles";

// GanttTimeline layout constants
export const TIMELINE_DIMENSIONS = {
  MONTHS_ROW_HEIGHT: 28,
  WEEKS_ROW_HEIGHT: 24,
  DAYS_ROW_HEIGHT: 24,
  get TOTAL_HEIGHT() {
    return (
      this.MONTHS_ROW_HEIGHT + this.WEEKS_ROW_HEIGHT + this.DAYS_ROW_HEIGHT
    );
  },
} as const;

// Timeline colors - theme-aware
export const getTimelineColors = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  
  return {
    TODAY_MARKER: isDark 
      ? "rgba(144, 202, 249, 0.9)" // Brighter blue for better visibility
      : "rgba(24,90,189,0.6)",
    WEEKEND_BG: isDark 
      ? "rgba(255, 255, 255, 0.08)" // Increased opacity for better visibility
      : "#f3f4f6",
    WEEKEND_BORDER: isDark
      ? "rgba(255, 255, 255, 0.15)" // Increased opacity
      : "#e5e7eb",
    BORDER_LIGHT: isDark
      ? "rgba(255, 255, 255, 0.25)" // Increased opacity for better visibility of grid lines
      : "#d1d5db", // Slightly darker for better visibility
    TEXT_PRIMARY: isDark
      ? "rgba(255, 255, 255, 0.95)" // High contrast white
      : "#374151",
    TEXT_SECONDARY: isDark
      ? "rgba(255, 255, 255, 0.75)" // Better contrast
      : "#6b7280",
    TEXT_MUTED: isDark
      ? "rgba(255, 255, 255, 0.65)" // Increased from 0.5 for better readability
      : "#9ca3af",
    BACKGROUND: isDark
      ? theme.palette.background.paper
      : "#ffffff",
    HEADER_BACKGROUND: isDark
      ? "rgba(18, 18, 18, 0.98)"
      : "rgba(255, 255, 255, 0.98)",
    BACKGROUND_OVERLAY: isDark
      ? "rgba(30, 30, 30, 0.95)" // More opaque for better contrast
      : "rgba(255, 255, 255, 0.8)",
    BUTTON_BG: isDark
      ? "rgba(255, 255, 255, 0.12)" // Increased opacity
      : "#f3f4f6",
    BUTTON_BG_HOVER: isDark
      ? "rgba(255, 255, 255, 0.2)" // More visible hover state
      : "#e5e7eb",
    BUTTON_TEXT: isDark
      ? "rgba(255, 255, 255, 0.95)" // High contrast
      : "#374151",
    BORDER: isDark
      ? "rgba(255, 255, 255, 0.2)" // Increased opacity for better visibility
      : "#e5e7eb",
    TRACKS_BACKGROUND: isDark
      ? theme.palette.background.default // Use default background for tracks area
      : "#fafafa", // Very light gray for elegant minimal look
  };
};

// Legacy constant for backward compatibility (light mode only)
// Components should use getTimelineColors(theme) instead
export const TIMELINE_COLORS = {
  TODAY_MARKER: "rgba(24,90,189,0.6)",
  WEEKEND_BG: "#f3f4f6",
  WEEKEND_BORDER: "#e5e7eb",
  BORDER_LIGHT: "#e5e7eb",
  TEXT_PRIMARY: "#374151",
  TEXT_SECONDARY: "#6b7280",
  TEXT_MUTED: "#9ca3af",
} as const;

// Timeline positioning
export const TIMELINE_POSITIONS = {
  TODAY_BUTTON: { top: 4, right: 8 },
  LEGEND: { top: 26, right: 8 },
  TODAY_LABEL: { top: 0 },
} as const;
