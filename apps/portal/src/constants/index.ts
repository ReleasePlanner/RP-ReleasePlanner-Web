/**
 * Centralized exports for all application constants
 */

// Status enums and labels
export {
  PlanStatus,
  PhaseStatus,
  FeatureStatus,
  ComponentStatus,
  PLAN_STATUS_LABELS,
  PHASE_STATUS_LABELS,
  FEATURE_STATUS_LABELS,
  COMPONENT_STATUS_LABELS,
  STATUS_LABELS,
  type PlanStatusType,
  type PhaseStatusType,
  type FeatureStatusType,
  type ComponentStatusType,
} from "./status";

// Priority constants and utilities
export {
  Priority,
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  sortByPriority,
  type PriorityType,
} from "./priority";

// Component types and categories
export {
  ComponentType,
  ComponentCategory,
  COMPONENT_TYPE_LABELS,
  COMPONENT_CATEGORY_LABELS,
  type ComponentTypeValue,
  type ComponentCategoryValue,
} from "./component";

// UI constants (dimensions, animations, spacing, etc.)
export {
  GANTT_DIMENSIONS,
  TIMELINE_DIMENSIONS,
  Z_INDEX,
  ANIMATIONS,
  BREAKPOINTS,
  SPACING,
  UI_LABELS,
  EMPTY_MESSAGES,
} from "./ui";

// Default values and templates
export {
  DefaultPhaseTemplates,
  DEFAULT_PHASE_TEMPLATE,
  DEFAULT_PLAN_VALUES,
  DEFAULT_COMPONENT_VALUES,
  DEFAULT_FEATURE_VALUES,
} from "./defaults";

// Common UI labels and icons
export {
  COMMON_DATA_LABELS,
  COMMON_DATA_ICONS,
  PROJECT_DETAILS,
  EMPTY_STATE_LABELS,
  DURATION_UNITS,
} from "./labels";

// Product data status mappings
export {
  COMPONENT_STATUS_VALUES,
  FEATURE_STATUS_VALUES,
  FEATURE_PRIORITY_VALUES,
  type FeaturePriorityValue,
} from "./productStatuses";

// Local plan status constants (for releasePlans feature)
export {
  LocalPlanStatus,
  LOCAL_PLAN_STATUS_LABELS,
  LOCAL_PLAN_STATUS_COLORS,
  type LocalPlanStatusType,
} from "./planStatus";
