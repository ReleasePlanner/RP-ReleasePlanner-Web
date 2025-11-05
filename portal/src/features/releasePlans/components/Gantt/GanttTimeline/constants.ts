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

// Timeline colors - should eventually use theme
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
