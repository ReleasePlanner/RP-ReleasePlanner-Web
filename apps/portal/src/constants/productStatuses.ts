/**
 * Status mappings for product data compatibility
 * Maps product data status strings to constant values
 */

import { ComponentStatus, FeatureStatus } from "./status";

/**
 * Production data uses lowercase strings like "production", "testing", "development", "deprecated"
 * These match ComponentStatus enum values
 */
export const COMPONENT_STATUS_VALUES = {
  PRODUCTION: ComponentStatus.PRODUCTION,
  TESTING: ComponentStatus.TESTING,
  DEVELOPMENT: ComponentStatus.DEVELOPMENT,
  DEPRECATED: ComponentStatus.DEPRECATED,
} as const;

/**
 * Feature data uses lowercase strings like "completed", "in-progress", "backlog", "testing", "blocked"
 * These match FeatureStatus enum values
 */
export const FEATURE_STATUS_VALUES = {
  COMPLETED: FeatureStatus.COMPLETED,
  IN_PROGRESS: FeatureStatus.IN_PROGRESS,
  BACKLOG: FeatureStatus.BACKLOG,
  TESTING: FeatureStatus.TESTING,
  BLOCKED: FeatureStatus.BLOCKED,
  PLANNED: FeatureStatus.PLANNED,
} as const;

/**
 * Priority levels for features - maps to Priority enum
 */
export const FEATURE_PRIORITY_VALUES = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
  CRITICAL: "critical" as const,
} as const;

export type FeaturePriorityValue =
  (typeof FEATURE_PRIORITY_VALUES)[keyof typeof FEATURE_PRIORITY_VALUES];
