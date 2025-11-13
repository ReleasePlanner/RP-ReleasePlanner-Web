/**
 * Plan-specific status and configuration constants
 * These are used by the local release plans feature
 */

// Plan status values used in releasePlans feature
export const LocalPlanStatus = {
  PLANNED: "planned" as const,
  IN_PROGRESS: "in_progress" as const,
  DONE: "done" as const,
  PAUSED: "paused" as const,
} as const;

export type LocalPlanStatusType =
  (typeof LocalPlanStatus)[keyof typeof LocalPlanStatus];

// Display labels for local plan statuses
export const LOCAL_PLAN_STATUS_LABELS: Record<LocalPlanStatusType, string> = {
  [LocalPlanStatus.PLANNED]: "Planned",
  [LocalPlanStatus.IN_PROGRESS]: "In Progress",
  [LocalPlanStatus.DONE]: "Completed",
  [LocalPlanStatus.PAUSED]: "Paused",
};

// Mapping of local status to status badge colors
export const LOCAL_PLAN_STATUS_COLORS: Record<
  LocalPlanStatusType,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  [LocalPlanStatus.PLANNED]: "default",
  [LocalPlanStatus.IN_PROGRESS]: "primary",
  [LocalPlanStatus.DONE]: "success",
  [LocalPlanStatus.PAUSED]: "warning",
};
