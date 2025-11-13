/**
 * Calendar Utilities
 *
 * Helper functions for calendar operations
 */

import type { CalendarDay } from "../types";

/**
 * Filter calendar days by type
 */
export function filterDaysByType(
  days: CalendarDay[],
  type: "all" | "holiday" | "special"
): CalendarDay[] {
  if (type === "all") return days;
  return days.filter((d) => d.type === type);
}

/**
 * Search calendar days by name or description
 */
export function searchDays(days: CalendarDay[], query: string): CalendarDay[] {
  if (!query.trim()) return days;
  const q = query.toLowerCase();
  return days.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
  );
}

/**
 * Sort calendar days
 */
export function sortDays(
  days: CalendarDay[],
  sortBy: "date" | "name" | "type"
): CalendarDay[] {
  const sorted = [...days];
  switch (sortBy) {
    case "date":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "type":
      return sorted.sort((a, b) => a.type.localeCompare(b.type));
    default:
      return sorted;
  }
}

/**
 * Process calendar days with filtering, searching, and sorting
 */
export function processDays(
  days: CalendarDay[],
  filterType: "all" | "holiday" | "special",
  searchQuery: string,
  sortBy: "date" | "name" | "type"
): CalendarDay[] {
  let result = filterDaysByType(days, filterType);
  result = searchDays(result, searchQuery);
  result = sortDays(result, sortBy);
  return result;
}

/**
 * Generate unique calendar day ID
 */
export function generateCalendarDayId(): string {
  return `day-${Date.now()}`;
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: string): boolean {
  return new Date(date) < new Date();
}

/**
 * Check if date is today
 */
export function isToday(date: string): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getDate() === checkDate.getDate()
  );
}
