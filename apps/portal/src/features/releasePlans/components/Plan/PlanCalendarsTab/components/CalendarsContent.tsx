import { memo } from "react";
import type { Calendar } from "@/features/calendar/types";
import { CalendarsLoadingState } from "./CalendarsLoadingState";
import { CalendarsErrorState } from "./CalendarsErrorState";
import { CalendarsEmptyState } from "./CalendarsEmptyState";
import { CalendarsList } from "./CalendarsList";
import type { PlanCalendarsStyles } from "../hooks/usePlanCalendarsStyles";

export type CalendarsContentProps = {
  readonly isLoading: boolean;
  readonly hasError: boolean;
  readonly calendars: Calendar[];
  readonly onDelete: (id: string) => void;
  readonly styles: PlanCalendarsStyles;
};

export const CalendarsContent = memo(function CalendarsContent({
  isLoading,
  hasError,
  calendars,
  onDelete,
  styles,
}: CalendarsContentProps) {
  if (isLoading) {
    return <CalendarsLoadingState />;
  }

  if (hasError) {
    return <CalendarsErrorState />;
  }

  if (calendars.length === 0) {
    return <CalendarsEmptyState />;
  }

  return <CalendarsList calendars={calendars} onDelete={onDelete} styles={styles} />;
});

