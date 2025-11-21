import { useState, useEffect, useMemo, useCallback } from "react";
import { useQueries } from "@tanstack/react-query";
import { calendarsService } from "../../../../../../../api/services/calendars.service";
import type { APICalendarDay } from "../../../../../../../api/services/calendars.service";
import type { PlanReferenceType } from "../../../../../types";

// Check if a date is a weekend
const isWeekend = (dateString: string): boolean => {
  if (!dateString || dateString.length !== 10) return false;

  const [year, month, day] = dateString.split("-").map(Number);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = date.getUTCDay();

  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
};

export function useReferenceValidation(
  open: boolean,
  type: PlanReferenceType,
  milestoneDate: string,
  url: string,
  calendarIds: string[],
  startDate?: string,
  endDate?: string
) {
  const [urlError, setUrlError] = useState("");
  const [dateError, setDateError] = useState("");

  // Load calendars for validation
  const calendarQueries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ["calendars", "detail", id],
      queryFn: () => calendarsService.getById(id),
      enabled: !!id && open && type === "milestone",
      staleTime: 5 * 60 * 1000,
      retry: 1,
    })),
  });

  // Get all calendar days (holidays and special days) from ALL calendars
  const calendarDays = useMemo(() => {
    const days: Array<{ date: string; name: string; type: string; calendarName: string }> = [];
    calendarQueries.forEach((query, index) => {
      if (query.isSuccess && query.data?.days) {
        const calendarName = query.data.name || `Calendario ${index + 1}`;
        for (const day of query.data.days as APICalendarDay[]) {
          days.push({
            date: day.date,
            name: day.name,
            type: day.type,
            calendarName: calendarName,
          });
        }
      }
    });
    return days;
  }, [calendarQueries]);

  // Check if a date is a holiday or special day in ANY calendar
  const isHolidayOrSpecialDay = useCallback(
    (dateString: string): { isHoliday: boolean; dayName?: string; calendarName?: string } => {
      const matchingDays = calendarDays.filter((d) => d.date === dateString);
      if (matchingDays.length > 0) {
        const dayNames = matchingDays.map((d) => d.name).join(", ");
        const calendarNames = [...new Set(matchingDays.map((d) => d.calendarName))].join(", ");
        return {
          isHoliday: true,
          dayName: dayNames,
          calendarName: calendarNames,
        };
      }
      return { isHoliday: false };
    },
    [calendarDays]
  );

  // Validate milestone date
  const validateMilestoneDate = useCallback(
    (dateString: string): string => {
      if (!dateString) return "";

      if (startDate && dateString < startDate) {
        return `La fecha debe ser posterior o igual a la fecha de inicio del plan (${startDate})`;
      }
      if (endDate && dateString > endDate) {
        return `La fecha debe ser anterior o igual a la fecha de fin del plan (${endDate})`;
      }

      if (isWeekend(dateString)) {
        return "La fecha no puede ser un fin de semana (sábado o domingo)";
      }

      const holidayCheck = isHolidayOrSpecialDay(dateString);
      if (holidayCheck.isHoliday) {
        const calendarInfo = holidayCheck.calendarName
          ? ` (en ${holidayCheck.calendarName})`
          : "";
        return `La fecha no puede ser un día festivo o especial: ${holidayCheck.dayName}${calendarInfo}`;
      }

      return "";
    },
    [startDate, endDate, isHolidayOrSpecialDay]
  );

  // Validate URL format
  const validateUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return true; // Empty is valid (optional field)
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Track if calendars are loading
  const isLoadingCalendars = useMemo(() => {
    return calendarIds.length > 0 && calendarQueries.some((q) => q.isLoading);
  }, [calendarIds.length, calendarQueries]);

  // Validate date when it changes or when calendars finish loading
  useEffect(() => {
    if (type === "milestone" && milestoneDate) {
      if (!isLoadingCalendars) {
        const error = validateMilestoneDate(milestoneDate);
        setDateError(error);
      }
    } else {
      setDateError("");
    }
  }, [milestoneDate, type, isLoadingCalendars, validateMilestoneDate]);

  // Validate URL when it changes (only for link type)
  useEffect(() => {
    if (type === "link" && url.trim() && !validateUrl(url)) {
      setUrlError("URL inválida. Debe comenzar con http:// o https://");
    } else {
      setUrlError("");
    }
  }, [url, type]);

  return {
    urlError,
    dateError,
    validateUrl,
    validateMilestoneDate,
  };
}

