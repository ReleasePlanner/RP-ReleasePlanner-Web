/**
 * Calendar Feature Types
 *
 * Types for holidays and special days management
 */

/**
 * Represents a single calendar day (holiday or special day)
 */
export interface CalendarDay {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format
  type: "holiday" | "special";
  description?: string;
  recurring: boolean; // true if repeats every year
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a calendar (collection of holidays and special days)
 */
export interface Calendar {
  id: string;
  name: string;
  description?: string;
  days: CalendarDay[];
  createdAt: string;
  updatedAt: string;
}

/**
 * State interface for calendar management
 */
export interface CalendarState {
  calendars: Calendar[];
  selectedCalendarId?: string;
  loading: boolean;
  error?: string;
}

/**
 * Filter and view options
 */
export type ViewMode = "grid" | "list" | "calendar";
export type FilterType = "all" | "holiday" | "special";
export type SortBy = "date" | "name" | "type";
