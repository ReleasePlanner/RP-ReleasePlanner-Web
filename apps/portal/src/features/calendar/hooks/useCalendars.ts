/**
 * useCalendars Hook
 *
 * Custom hook for managing calendars and calendar days
 */

import { useState, useCallback } from "react";
import type { Calendar, CalendarDay } from "../types";

/**
 * useCalendars - Manage multiple calendars with CRUD operations
 *
 * @param initialCalendars - Initial calendar data
 * @returns Calendar management state and callbacks
 */
export function useCalendars(initialCalendars: Calendar[]) {
  const [calendars, setCalendars] = useState<Calendar[]>(initialCalendars);
  const [selectedCalendarId, setSelectedCalendarId] = useState<
    string | undefined
  >(initialCalendars[0]?.id);

  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);

  // Add calendar
  const addCalendar = useCallback((calendar: Calendar) => {
    setCalendars((prev) => [...prev, calendar]);
  }, []);

  // Update calendar
  const updateCalendar = useCallback(
    (calendarId: string, updates: Partial<Calendar>) => {
      setCalendars((prev) =>
        prev.map((cal) =>
          cal.id === calendarId
            ? { ...cal, ...updates, updatedAt: new Date().toISOString() }
            : cal
        )
      );
    },
    []
  );

  // Delete calendar
  const deleteCalendar = useCallback(
    (calendarId: string) => {
      setCalendars((prev) => prev.filter((cal) => cal.id !== calendarId));
      if (selectedCalendarId === calendarId) {
        setSelectedCalendarId(calendars[0]?.id);
      }
    },
    [calendars, selectedCalendarId]
  );

  // Add day to calendar
  const addDayToCalendar = useCallback(
    (calendarId: string, day: CalendarDay) => {
      setCalendars((prev) =>
        prev.map((cal) =>
          cal.id === calendarId
            ? {
                ...cal,
                days: [...cal.days, day],
                updatedAt: new Date().toISOString(),
              }
            : cal
        )
      );
    },
    []
  );

  // Update day in calendar
  const updateDayInCalendar = useCallback(
    (calendarId: string, dayId: string, updates: Partial<CalendarDay>) => {
      setCalendars((prev) =>
        prev.map((cal) =>
          cal.id === calendarId
            ? {
                ...cal,
                days: cal.days.map((d) =>
                  d.id === dayId
                    ? { ...d, ...updates, updatedAt: new Date().toISOString() }
                    : d
                ),
                updatedAt: new Date().toISOString(),
              }
            : cal
        )
      );
    },
    []
  );

  // Delete day from calendar
  const deleteDayFromCalendar = useCallback(
    (calendarId: string, dayId: string) => {
      setCalendars((prev) =>
        prev.map((cal) =>
          cal.id === calendarId
            ? {
                ...cal,
                days: cal.days.filter((d) => d.id !== dayId),
                updatedAt: new Date().toISOString(),
              }
            : cal
        )
      );
    },
    []
  );

  return {
    calendars,
    selectedCalendarId,
    setSelectedCalendarId,
    selectedCalendar,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    addDayToCalendar,
    updateDayInCalendar,
    deleteDayFromCalendar,
  };
}
