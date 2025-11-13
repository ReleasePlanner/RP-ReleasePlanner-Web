import type { Feature, FeatureStatus } from "../types";
import type { SortBy } from "../components/FeatureToolbar";

/**
 * Filter features by search query (name and description)
 */
export function filterFeaturesBySearch(
  features: Feature[],
  query: string
): Feature[] {
  if (!query.trim()) return features;

  const lowerQuery = query.toLowerCase();
  return features.filter(
    (f) =>
      f.name.toLowerCase().includes(lowerQuery) ||
      f.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort features by the specified criteria
 */
export function sortFeatures(features: Feature[], sortBy: SortBy): Feature[] {
  const sorted = [...features];

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "status": {
      const statusOrder: Record<FeatureStatus, number> = {
        completed: 0,
        "in-progress": 1,
        planned: 2,
        "on-hold": 3,
      };
      sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      break;
    }
    case "date":
      sorted.sort((a, b) => b.id.localeCompare(a.id));
      break;
  }

  return sorted;
}

/**
 * Apply filtering and sorting to features
 */
export function processFeatures(
  features: Feature[],
  searchQuery: string,
  sortBy: SortBy
): Feature[] {
  let result = filterFeaturesBySearch(features, searchQuery);
  result = sortFeatures(result, sortBy);
  return result;
}

/**
 * Generate a new feature ID
 */
export function generateFeatureId(): string {
  return `feat-${Date.now()}`;
}
