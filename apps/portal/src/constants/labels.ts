/**
 * Common UI labels used throughout the application
 */

export const COMMON_DATA_LABELS = {
  OWNER: "Owner",
  DURATION: "Duration",
  START_DATE: "Start Date",
  END_DATE: "End Date",
  PLAN_ID: "Plan ID",
} as const;

export const COMMON_DATA_ICONS = {
  OWNER: "👤",
  START_DATE: "📅",
  END_DATE: "🏁",
  ID: "🆔",
} as const;

export const PROJECT_DETAILS = {
  TITLE: "Project Details",
} as const;

export const EMPTY_STATE_LABELS = {
  NO_DATA: "—",
  NO_PLANS: "No plans yet",
  NO_PHASES: "No phases assigned",
  NO_FEATURES: "No features available",
  NO_COMPONENTS: "No components available",
} as const;

export const DURATION_UNITS = {
  SINGULAR: {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
  },
  PLURAL: {
    DAYS: "days",
    WEEKS: "weeks",
    MONTHS: "months",
    YEARS: "years",
  },
} as const;
