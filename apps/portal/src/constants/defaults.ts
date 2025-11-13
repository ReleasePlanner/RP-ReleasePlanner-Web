/**
 * Phase templates and default configurations
 */

export const DefaultPhaseTemplates = {
  STANDARD: [
    { name: "Discovery" },
    { name: "Planning" },
    { name: "Development" },
    { name: "Testing" },
    { name: "UAT" },
    { name: "Release" },
  ],
  AGILE: [
    { name: "Sprint Planning" },
    { name: "Development" },
    { name: "Testing" },
    { name: "Sprint Review" },
  ],
  WATERFALL: [
    { name: "Requirements" },
    { name: "Design" },
    { name: "Implementation" },
    { name: "Verification" },
    { name: "Maintenance" },
  ],
  SIMPLE: [
    { name: "Development" },
    { name: "Testing" },
    { name: "Deployment" },
  ],
} as const;

export const DEFAULT_PHASE_TEMPLATE = DefaultPhaseTemplates.STANDARD;

// Default plan values
export const DEFAULT_PLAN_VALUES = {
  NAME: "New Release Plan",
  OWNER: "Unassigned",
  DESCRIPTION: "",
  STATUS: "planned" as const,
  YEAR_START_DATE: () => {
    const year = new Date().getFullYear();
    return `${year}-01-01`;
  },
  YEAR_END_DATE: () => {
    const year = new Date().getFullYear();
    return `${year}-12-31`;
  },
} as const;

// Default component values
export const DEFAULT_COMPONENT_VALUES = {
  TYPE: "web" as const,
  STATUS: "development" as const,
  VERSION: "1.0.0",
} as const;

// Default feature values
export const DEFAULT_FEATURE_VALUES = {
  PRIORITY: "medium" as const,
  STATUS: "backlog" as const,
  ESTIMATED_HOURS: 40,
  CATEGORY: "ui" as const,
} as const;
