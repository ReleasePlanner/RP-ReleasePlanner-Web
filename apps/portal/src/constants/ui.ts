/**
 * UI/UX constants for Gantt, timelines, and general layout
 */

// Gantt chart dimensions (pixels)
export const GANTT_DIMENSIONS = {
  PX_PER_DAY: 24,
  TRACK_HEIGHT: 28,
  LANE_GAP: 8,
  LABEL_WIDTH: 200,
  TIMELINE_HEIGHT: 76, // 28 + 24 + 24
  PHASE_BAR_MIN_WIDTH: 10,
} as const;

// Timeline layout dimensions
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

// Z-index hierarchy for layering
export const Z_INDEX = {
  BASE: 0,
  OVERLAY: 10,
  TIMELINE: 15,
  TOOLTIP: 20,
  MODAL: 30,
  DROPDOWN: 40,
  NOTIFICATION: 50,
  DEBUG: 9999,
} as const;

// Animation durations (milliseconds)
export const ANIMATIONS = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  VERY_SLOW: 500,
} as const;

// Responsive breakpoints (pixels)
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// Spacing scale (multiples of 4px or 0.25rem)
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Common UI labels
export const UI_LABELS = {
  LOADING: "Loading...",
  ERROR: "Error",
  SUCCESS: "Success",
  WARNING: "Warning",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
  SAVE: "Save",
  DELETE: "Delete",
  EDIT: "Edit",
  ADD: "Add",
  CLOSE: "Close",
  BACK: "Back",
  NEXT: "Next",
  PREVIOUS: "Previous",
  NO_DATA: "No data available",
  EMPTY_STATE: "No items to display",
} as const;

// Placeholder/empty state messages
export const EMPTY_MESSAGES = {
  NO_PLANS: "No release plans yet. Create one to get started.",
  NO_PHASES: "No phases defined. Add phases to your plan.",
  NO_FEATURES: "No features in this phase.",
  NO_COMPONENTS: "No components available.",
  NO_TASKS: "No tasks assigned.",
  NO_SEARCH_RESULTS: "No results found. Try adjusting your search.",
} as const;
