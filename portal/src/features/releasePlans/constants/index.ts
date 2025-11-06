// Global constants for all Gantt-related components
export const GANTT_DIMENSIONS = {
  PX_PER_DAY: 24,
  TRACK_HEIGHT: 28,
  LANE_GAP: 8,
  LABEL_WIDTH: 200,
  TIMELINE_HEIGHT: 76, // 28 + 24 + 24
} as const;

// Re-export colors to maintain API compatibility
export { GANTT_COLORS, type GanttColors } from "./colors";

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

// Note: Theme exports are available directly from "./theme" to avoid circular dependencies
