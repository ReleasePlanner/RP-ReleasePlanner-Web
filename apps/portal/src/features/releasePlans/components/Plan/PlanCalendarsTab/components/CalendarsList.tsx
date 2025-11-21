import { memo } from "react";
import { Box, Paper, useTheme, alpha } from "@mui/material";
import type { Calendar } from "@/features/calendar/types";
import { CalendarItem } from "./CalendarItem";
import type { PlanCalendarsStyles } from "../hooks/usePlanCalendarsStyles";

export type CalendarsListProps = {
  readonly calendars: Calendar[];
  readonly onDelete: (id: string) => void;
  readonly styles: PlanCalendarsStyles;
};

export const CalendarsList = memo(function CalendarsList({
  calendars,
  onDelete,
  styles,
}: CalendarsListProps) {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {calendars.map((calendar, index) => (
          <CalendarItem
            key={calendar.id}
            calendar={calendar}
            isLast={index === calendars.length - 1}
            onDelete={onDelete}
            styles={styles}
          />
        ))}
      </Paper>
    </Box>
  );
});

