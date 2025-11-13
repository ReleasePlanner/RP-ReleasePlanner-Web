// Color constants - Isolated to prevent circular dependencies
export const GANTT_COLORS = {
  // Primary colors
  PRIMARY: "#217346",
  SECONDARY: "#185ABD",

  // Status colors
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",

  // Background colors
  WEEKEND_BG: "#f3f4f6",
  HOVER_BG: "#f9fafb",
  SELECTED_BG: "#e5f3ff",

  // Border colors
  BORDER_LIGHT: "#e5e7eb",
  BORDER_MEDIUM: "#d1d5db",
  BORDER_DARK: "#9ca3af",

  // Text colors
  TEXT_PRIMARY: "#111827",
  TEXT_SECONDARY: "#6b7280",
  TEXT_MUTED: "#9ca3af",
  TEXT_INVERSE: "#ffffff",
} as const;

export type GanttColors = typeof GANTT_COLORS;
