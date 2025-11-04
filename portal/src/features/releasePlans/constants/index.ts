// Global constants for all Gantt-related components
export const GANTT_DIMENSIONS = {
  PX_PER_DAY: 24,
  TRACK_HEIGHT: 28,
  LANE_GAP: 8,
  LABEL_WIDTH: 200,
  TIMELINE_HEIGHT: 76, // 28 + 24 + 24
} as const;

// Color system - should integrate with MUI theme
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

// Z-index hierarchy
export const Z_INDEX = {
  TIMELINE: 10,
  OVERLAY: 20,
  MODAL: 30,
  TOOLTIP: 40,
  DROPDOWN: 50,
} as const;

// Animation durations (ms)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Theme system
export * from "./theme";
