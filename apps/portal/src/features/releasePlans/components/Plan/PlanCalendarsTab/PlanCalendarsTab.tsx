import { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Calendar } from "@/features/calendar/types";
import { SelectCalendarsDialog } from "./SelectCalendarsDialog";
import { useAppSelector } from "@/store/hooks";

export type PlanCalendarsTabProps = {
  calendarIds?: string[];
  onCalendarIdsChange?: (calendarIds: string[]) => void;
};

export function PlanCalendarsTab({
  calendarIds = [],
  onCalendarIdsChange,
}: PlanCalendarsTabProps) {
  const theme = useTheme();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);

  // Get calendars from Redux store
  const allCalendars = useAppSelector((state) => state.calendars.calendars);

  // Get calendars that are in the plan
  const planCalendars = useMemo(() => {
    if (calendarIds.length === 0) return [];
    return allCalendars.filter((c: Calendar) => calendarIds.includes(c.id));
  }, [allCalendars, calendarIds]);

  const handleAddCalendars = (newCalendarIds: string[]) => {
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
  };

  const handleDeleteCalendar = (calendarId: string) => {
    if (onCalendarIdsChange) {
      onCalendarIdsChange(calendarIds.filter((id) => id !== calendarId));
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Calendars ({planCalendars.length})
          </Typography>
          <Tooltip title="Add calendars from maintenance" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 500,
                px: 1.75,
                py: 0.625,
                borderRadius: 1,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Add Calendars
            </Button>
          </Tooltip>
        </Box>

        {/* Calendars List */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {planCalendars.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                No calendars added to this plan yet. Click "Add Calendars" to
                select calendars from maintenance.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {planCalendars.map((calendar: Calendar) => (
                <Box
                  key={calendar.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    bgcolor: theme.palette.background.paper,
                    transition: theme.transitions.create(
                      ["border-color", "box-shadow"],
                      {
                        duration: theme.transitions.duration.shorter,
                      }
                    ),
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      boxShadow: `0 2px 4px ${alpha(
                        theme.palette.common.black,
                        0.08
                      )}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {calendar.name}
                      </Typography>
                      {calendar.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: "0.8125rem",
                            mb: 1,
                          }}
                        >
                          {calendar.description}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label={`${calendar.days.length} day${
                            calendar.days.length !== 1 ? "s" : ""
                          }`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.6875rem",
                            fontWeight: 500,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.disabled,
                            fontFamily: "monospace",
                            fontSize: "0.6875rem",
                          }}
                        >
                          {calendar.id}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="Remove calendar" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCalendar(calendar.id)}
                        sx={{
                          color: alpha(theme.palette.text.secondary, 0.7),
                          "&:hover": {
                            color: theme.palette.error.main,
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                          },
                          "&:focus-visible": {
                            outline: `2px solid ${alpha(theme.palette.error.main, 0.5)}`,
                            outlineOffset: 2,
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* Select Calendars Dialog */}
      <SelectCalendarsDialog
        open={selectDialogOpen}
        selectedCalendarIds={calendarIds}
        onClose={() => setSelectDialogOpen(false)}
        onAddCalendars={handleAddCalendars}
      />
    </Box>
  );
}
