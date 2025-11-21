import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { Calendar } from "@/features/calendar/types";
import type { Calendar as APICalendar, CalendarDay as APICalendarDay } from "@/api/services/calendars.service";
import { calendarsService } from "@/api/services/calendars.service";

export type PlanCalendarsData = {
  planCalendars: Calendar[];
  isLoading: boolean;
  hasError: boolean;
};

// Convert API calendar to local Calendar type
function convertAPICalendarToLocal(apiCalendar: APICalendar): Calendar {
  return {
    id: apiCalendar.id,
    name: apiCalendar.name,
    description: apiCalendar.description,
    country: apiCalendar.country
      ? {
          id: apiCalendar.country.id,
          name: apiCalendar.country.name,
          code: apiCalendar.country.code,
        }
      : undefined,
    days:
      apiCalendar.days?.map((day: APICalendarDay) => ({
        id: day.id,
        name: day.name,
        date: day.date,
        type: day.type,
        description: day.description,
        recurring: day.recurring,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
      })) || [],
    createdAt: apiCalendar.createdAt,
    updatedAt: apiCalendar.updatedAt,
  };
}

export function usePlanCalendars(calendarIds: string[]): PlanCalendarsData {
  // Load calendars from API using the calendar IDs
  const calendarQueries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ["calendars", "detail", id],
      queryFn: () => calendarsService.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Get calendars that are in the plan
  const planCalendars = useMemo(() => {
    return calendarQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => convertAPICalendarToLocal(query.data!));
  }, [calendarQueries]);

  const isLoading = calendarQueries.some((query) => query.isLoading);
  const hasError = calendarQueries.some((query) => query.isError);

  return {
    planCalendars,
    isLoading,
    hasError,
  };
}

