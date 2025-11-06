import { createTheme } from "@mui/material/styles";
import { GANTT_COLORS } from "./colors";
import { GANTT_DIMENSIONS } from "./index";

/**
 * Centralized theme system for Release Planner
 * Integrates with MUI theme and global constants
 */

// Custom theme extensions
declare module "@mui/material/styles" {
  interface Theme {
    gantt: {
      colors: typeof GANTT_COLORS;
      dimensions: typeof GANTT_DIMENSIONS;
    };
  }

  interface ThemeOptions {
    gantt?: {
      colors?: typeof GANTT_COLORS;
      dimensions?: typeof GANTT_DIMENSIONS;
    };
  }
}

/**
 * Release Planner theme configuration
 * Extends MUI theme with Gantt-specific values
 */
export const releasePlannerTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
    },
    error: {
      main: "#d32f2f",
      light: "#f44336",
      dark: "#c62828",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  gantt: {
    colors: GANTT_COLORS,
    dimensions: GANTT_DIMENSIONS,
  },
});

/**
 * Phase status color mapping
 */
export const PHASE_STATUS_COLORS = {
  planned: releasePlannerTheme.palette.grey[500],
  in_progress: releasePlannerTheme.palette.primary.main,
  done: releasePlannerTheme.palette.success.main,
  blocked: releasePlannerTheme.palette.error.main,
  paused: releasePlannerTheme.palette.warning.main,
} as const;

/**
 * Plan status color mapping
 */
export const PLAN_STATUS_COLORS = {
  planned: "default",
  in_progress: "primary",
  done: "success",
  blocked: "error",
  paused: "warning",
} as const;

/**
 * Common spacing values
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Shadow definitions
 */
export const SHADOWS = {
  card: "0 1px 3px rgba(0, 0, 0, 0.1)",
  modal: "0 4px 20px rgba(0, 0, 0, 0.15)",
  tooltip: "0 2px 8px rgba(0, 0, 0, 0.12)",
} as const;

export type ReleasePlannerTheme = typeof releasePlannerTheme;
