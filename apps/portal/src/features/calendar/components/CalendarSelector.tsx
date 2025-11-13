/**
 * CalendarSelector Component
 *
 * Dropdown for selecting which calendar to manage
 */

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { Calendar } from "../types";

interface CalendarSelectorProps {
  calendars: Calendar[];
  selectedCalendarId: string | undefined;
  onSelectCalendar: (calendarId: string) => void;
}

export function CalendarSelector({
  calendars,
  selectedCalendarId,
  onSelectCalendar,
}: CalendarSelectorProps) {
  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      {/* Header */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Select Calendar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {calendars.length} calendar{calendars.length !== 1 ? "s" : ""}{" "}
          available
        </Typography>
      </Box>

      {/* Calendar Dropdown */}
      <FormControl fullWidth sx={{ maxWidth: 300 }}>
        <InputLabel>Calendar</InputLabel>
        <Select
          value={selectedCalendarId || ""}
          label="Calendar"
          onChange={(e) => onSelectCalendar(e.target.value)}
        >
          {calendars.map((calendar) => (
            <MenuItem key={calendar.id} value={calendar.id}>
              {calendar.name} ({calendar.days.length} day
              {calendar.days.length !== 1 ? "s" : ""})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Calendar Info */}
      {selectedCalendar && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {selectedCalendar.name}
          </Typography>
          {selectedCalendar.description && (
            <Typography variant="caption" color="text.secondary">
              {selectedCalendar.description}
            </Typography>
          )}
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Total days: {selectedCalendar.days.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
