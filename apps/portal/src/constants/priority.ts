/**
 * Priority levels for features, phases, and components
 */

export const Priority = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export type PriorityType = (typeof Priority)[keyof typeof Priority];

export const PRIORITY_LABELS: Record<PriorityType, string> = {
  [Priority.CRITICAL]: "Critical",
  [Priority.HIGH]: "High",
  [Priority.MEDIUM]: "Medium",
  [Priority.LOW]: "Low",
};

export const PRIORITY_ORDER: Record<PriorityType, number> = {
  [Priority.CRITICAL]: 1,
  [Priority.HIGH]: 2,
  [Priority.MEDIUM]: 3,
  [Priority.LOW]: 4,
};

// Sort function by priority
export function sortByPriority<T extends { priority: PriorityType }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}
