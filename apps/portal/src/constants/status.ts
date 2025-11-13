/**
 * Status enums and constants for Plans, Phases, Features, and Components
 */

export const PlanStatus = {
  PLANNED: "planned",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  BLOCKED: "blocked",
  ON_HOLD: "on-hold",
} as const;

export type PlanStatusType = (typeof PlanStatus)[keyof typeof PlanStatus];

export const PhaseStatus = {
  BACKLOG: "backlog",
  PLANNED: "planned",
  IN_PROGRESS: "in-progress",
  TESTING: "testing",
  COMPLETED: "completed",
  BLOCKED: "blocked",
  CANCELLED: "cancelled",
} as const;

export type PhaseStatusType = (typeof PhaseStatus)[keyof typeof PhaseStatus];

export const FeatureStatus = {
  BACKLOG: "backlog",
  PLANNED: "planned",
  IN_PROGRESS: "in-progress",
  TESTING: "testing",
  COMPLETED: "completed",
  BLOCKED: "blocked",
} as const;

export type FeatureStatusType =
  (typeof FeatureStatus)[keyof typeof FeatureStatus];

export const ComponentStatus = {
  DEVELOPMENT: "development",
  TESTING: "testing",
  PRODUCTION: "production",
  DEPRECATED: "deprecated",
} as const;

export type ComponentStatusType =
  (typeof ComponentStatus)[keyof typeof ComponentStatus];

// Status display labels organized by entity type
export const PLAN_STATUS_LABELS: Record<PlanStatusType, string> = {
  [PlanStatus.PLANNED]: "Planned",
  [PlanStatus.IN_PROGRESS]: "In Progress",
  [PlanStatus.COMPLETED]: "Completed",
  [PlanStatus.BLOCKED]: "Blocked",
  [PlanStatus.ON_HOLD]: "On Hold",
};

export const PHASE_STATUS_LABELS: Record<PhaseStatusType, string> = {
  [PhaseStatus.BACKLOG]: "Backlog",
  [PhaseStatus.PLANNED]: "Planned",
  [PhaseStatus.IN_PROGRESS]: "In Progress",
  [PhaseStatus.TESTING]: "Testing",
  [PhaseStatus.COMPLETED]: "Completed",
  [PhaseStatus.BLOCKED]: "Blocked",
  [PhaseStatus.CANCELLED]: "Cancelled",
};

export const FEATURE_STATUS_LABELS: Record<FeatureStatusType, string> = {
  [FeatureStatus.BACKLOG]: "Backlog",
  [FeatureStatus.PLANNED]: "Planned",
  [FeatureStatus.IN_PROGRESS]: "In Progress",
  [FeatureStatus.TESTING]: "Testing",
  [FeatureStatus.COMPLETED]: "Completed",
  [FeatureStatus.BLOCKED]: "Blocked",
};

export const COMPONENT_STATUS_LABELS: Record<ComponentStatusType, string> = {
  [ComponentStatus.DEVELOPMENT]: "Development",
  [ComponentStatus.TESTING]: "Testing",
  [ComponentStatus.PRODUCTION]: "Production",
  [ComponentStatus.DEPRECATED]: "Deprecated",
};

// Unified status labels map for convenience (use specific ones above when possible)
export const STATUS_LABELS: Record<string, string> = {
  ...PLAN_STATUS_LABELS,
  ...PHASE_STATUS_LABELS,
  ...FEATURE_STATUS_LABELS,
  ...COMPONENT_STATUS_LABELS,
};
