/**
 * Feature Management Constants
 *
 * Defines constants for categories, statuses, and product owners
 */

import type { FeatureCategory, ProductOwner, FeatureStatus } from "./types";

/**
 * Available feature categories
 */
export const FEATURE_CATEGORIES: FeatureCategory[] = [
  { id: "cat-1", name: "Authentication" },
  { id: "cat-2", name: "Performance" },
  { id: "cat-3", name: "Security" },
  { id: "cat-4", name: "UI/UX" },
  { id: "cat-5", name: "Infrastructure" },
  { id: "cat-6", name: "Documentation" },
  { id: "cat-7", name: "Testing" },
  { id: "cat-8", name: "Integration" },
];

/**
 * Category labels for display
 */
export const CATEGORY_LABELS: Record<string, string> = {
  "cat-1": "🔐 Authentication",
  "cat-2": "⚡ Performance",
  "cat-3": "🛡️ Security",
  "cat-4": "🎨 UI/UX",
  "cat-5": "🏗️ Infrastructure",
  "cat-6": "📚 Documentation",
  "cat-7": "✅ Testing",
  "cat-8": "🔗 Integration",
};

/**
 * Available product owners
 */
export const PRODUCT_OWNERS: ProductOwner[] = [
  { id: "owner-1", name: "Alice Johnson" },
  { id: "owner-2", name: "Bob Smith" },
  { id: "owner-3", name: "Carol Davis" },
  { id: "owner-4", name: "David Wilson" },
  { id: "owner-5", name: "Emma Brown" },
];

/**
 * Feature status labels for display
 */
export const STATUS_LABELS: Record<FeatureStatus, string> = {
  planned: "📋 Planned",
  "in-progress": "🚀 In Progress",
  completed: "✅ Completed",
  "on-hold": "⏸️ On Hold",
  assigned: "📌 Assigned",
};

/**
 * Feature status colors for UI
 */
export const STATUS_COLORS: Record<
  FeatureStatus,
  "default" | "info" | "warning" | "success" | "error"
> = {
  planned: "default",
  "in-progress": "info",
  completed: "success",
  "on-hold": "warning",
  assigned: "info",
};
