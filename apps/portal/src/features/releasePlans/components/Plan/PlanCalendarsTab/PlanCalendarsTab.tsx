import { useState, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { SelectCalendarsDialog } from "./SelectCalendarsDialog";
import { CalendarsHeader, CalendarsContent } from "./components";
import { usePlanCalendars, usePlanCalendarsStyles } from "./hooks";

export type PlanCalendarsTabProps = {
  readonly calendarIds?: string[];
  readonly onCalendarIdsChange?: (calendarIds: string[]) => void;
};

export function PlanCalendarsTab({
  calendarIds = [],
  onCalendarIdsChange,
}: PlanCalendarsTabProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const { planCalendars, isLoading, hasError } = usePlanCalendars(calendarIds);
  const styles = usePlanCalendarsStyles();

  const handleAddCalendars = useCallback(
    (newCalendarIds: string[]) => {
      if (onCalendarIdsChange) {
        // Filter out duplicates - only add calendars that aren't already in the plan
        const uniqueNewIds = newCalendarIds.filter(
          (id) => !calendarIds.includes(id)
        );
        if (uniqueNewIds.length > 0) {
          onCalendarIdsChange([...calendarIds, ...uniqueNewIds]);
        }
      }
      setSelectDialogOpen(false);
    },
    [calendarIds, onCalendarIdsChange]
  );

  const handleDeleteCalendar = useCallback(
    (calendarId: string) => {
      if (onCalendarIdsChange) {
        onCalendarIdsChange(calendarIds.filter((id) => id !== calendarId));
      }
    },
    [calendarIds, onCalendarIdsChange]
  );

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <CalendarsHeader
          calendarCount={planCalendars.length}
          onAddClick={() => setSelectDialogOpen(true)}
          styles={styles}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CalendarsContent
            isLoading={isLoading}
            hasError={hasError}
            calendars={planCalendars}
            onDelete={handleDeleteCalendar}
            styles={styles}
          />
        </Box>
      </Stack>

      <SelectCalendarsDialog
        open={selectDialogOpen}
        selectedCalendarIds={calendarIds}
        onClose={() => setSelectDialogOpen(false)}
        onAddCalendars={handleAddCalendars}
      />
    </Box>
  );
}
