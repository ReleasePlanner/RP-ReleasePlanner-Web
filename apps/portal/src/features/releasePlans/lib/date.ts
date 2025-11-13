/**
 * Date Utilities for UTC Storage and Local Display
 * 
 * All dates are stored in UTC format (ISO 8601 strings: YYYY-MM-DD)
 * All dates are displayed in the user's local timezone based on browser locale
 */

/**
 * Get current date in UTC as ISO string (YYYY-MM-DD)
 * This should be used when creating new dates to store
 */
export function getCurrentDateUTC(): string {
  const now = new Date();
  // Get UTC date components
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Convert a local date string (from user input) to UTC ISO string (YYYY-MM-DD)
 * For date-only values (no time), we treat the user's selected date as the intended date
 * and store it directly as UTC (since date-only values don't have timezone meaning)
 * @param localDateStr - Date string in format YYYY-MM-DD (from date input)
 * @returns UTC ISO string (YYYY-MM-DD) - same value, stored as UTC
 */
export function localDateToUTC(localDateStr: string): string {
  if (!localDateStr) return localDateStr;
  
  // For date-only values, we store them directly as UTC
  // The date string YYYY-MM-DD represents the same calendar date regardless of timezone
  // So we can store it directly without conversion
  return localDateStr;
}

/**
 * Convert a UTC ISO string (YYYY-MM-DD) to local date string for display/input
 * For date-only values, UTC and local are the same (no time component)
 * @param utcDateStr - UTC ISO string (YYYY-MM-DD)
 * @returns Local date string (YYYY-MM-DD) - same value for date-only
 */
export function utcToLocalDate(utcDateStr: string): string {
  if (!utcDateStr) return utcDateStr;
  
  // For date-only values, UTC and local are the same
  // The date string YYYY-MM-DD represents the same calendar date
  return utcDateStr;
}

/**
 * Format a UTC ISO string (YYYY-MM-DD) for display using browser locale
 * This should be used when displaying dates to users
 * The date will be formatted according to the user's browser locale (country/language)
 * @param utcDateStr - UTC ISO string (YYYY-MM-DD)
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string in user's locale (e.g., "15 ene 2024" for es-ES, "Jan 15, 2024" for en-US)
 */
export function formatDateLocal(
  utcDateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!utcDateStr) return "";
  
  // Parse UTC date string (YYYY-MM-DD)
  const [year, month, day] = utcDateStr.split("-").map(Number);
  
  // Create a date object treating the input as UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  
  // Get browser locale (automatically detects country/language from browser settings)
  const locale = getBrowserLocale();
  
  // Format using browser locale (undefined uses browser's default locale)
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    utcDate
  );
}

/**
 * Format a UTC ISO string (YYYY-MM-DD) for compact display
 * @param utcDateStr - UTC ISO string (YYYY-MM-DD)
 * @returns Compact formatted date string
 */
export function formatCompactDate(utcDateStr: string): string {
  return formatDateLocal(utcDateStr, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get browser locale (language-country)
 * @returns Locale string (e.g., "en-US", "es-ES")
 */
export function getBrowserLocale(): string {
  return navigator.language || navigator.languages?.[0] || "en-US";
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfWeekMonday(d: Date): Date {
  const res = new Date(d);
  const day = res.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  res.setDate(res.getDate() + diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

export function buildDaysArray(start: Date, totalDays: number): Date[] {
  return Array.from({ length: totalDays }, (_, i) => addDays(start, i));
}

export type Segment = { label: string; startIndex: number; length: number };

export function buildMonthSegments(days: Date[]): Segment[] {
  if (days.length === 0) return [];
  const segments: Segment[] = [];
  let currentLabel = `${days[0].toLocaleString('en-US', { month: 'short' })} ${days[0].getFullYear()}`;
  let startIdx = 0;
  for (let i = 1; i < days.length; i++) {
    const d = days[i];
    const label = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
    if (label !== currentLabel) {
      segments.push({ label: currentLabel, startIndex: startIdx, length: i - startIdx });
      currentLabel = label;
      startIdx = i;
    }
  }
  segments.push({ label: currentLabel, startIndex: startIdx, length: days.length - startIdx });
  return segments;
}

export function buildWeekSegments(days: Date[]): Segment[] {
  if (days.length === 0) return [];
  const segments: Segment[] = [];
  let currentWeekStart = startOfWeekMonday(days[0]).toISOString().slice(0, 10);
  let startIdx = 0;
  for (let i = 1; i < days.length; i++) {
    const ws = startOfWeekMonday(days[i]).toISOString().slice(0, 10);
    if (ws !== currentWeekStart) {
      const labelDate = new Date(currentWeekStart);
      const label = labelDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
      segments.push({ label, startIndex: startIdx, length: i - startIdx });
      currentWeekStart = ws;
      startIdx = i;
    }
  }
  const lastLabelDate = new Date(currentWeekStart);
  const lastLabel = lastLabelDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  segments.push({ label: lastLabel, startIndex: startIdx, length: days.length - startIdx });
  return segments;
}
