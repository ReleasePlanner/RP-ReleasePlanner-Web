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
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Calendar } from "@/features/calendar/types";
import { SelectCalendarsDialog } from "./SelectCalendarsDialog";
import { useQueries } from "@tanstack/react-query";
import type { Calendar as APICalendar, CalendarDay as APICalendarDay } from "@/api/services/calendars.service";
import { calendarsService } from "@/api/services/calendars.service";

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

  // Load calendars from API using the calendar IDs
  const calendarQueries = useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ['calendars', 'detail', id],
      queryFn: () => calendarsService.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Convert API calendar to local Calendar type
  const convertAPICalendarToLocal = (apiCalendar: APICalendar): Calendar => {
    return {
      id: apiCalendar.id,
      name: apiCalendar.name,
      description: apiCalendar.description,
      country: apiCalendar.country ? {
        id: apiCalendar.country.id,
        name: apiCalendar.country.name,
        code: apiCalendar.country.code,
      } : undefined,
      days: apiCalendar.days?.map((day: APICalendarDay) => ({
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
  };

  // Get calendars that are in the plan
  const planCalendars = useMemo(() => {
    return calendarQueries
      .filter((query) => query.isSuccess && query.data)
      .map((query) => convertAPICalendarToLocal(query.data!));
  }, [calendarQueries]);

  const isLoading = calendarQueries.some((query) => query.isLoading);
  const hasError = calendarQueries.some((query) => query.isError);

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
        p: { xs: 1.5, sm: 2 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack spacing={1} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            flexShrink: 0,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
              color: theme.palette.text.primary,
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          >
            Calendars ({planCalendars.length})
          </Typography>
          <Tooltip title="Add calendars from maintenance" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                fontWeight: 500,
                px: { xs: 1, sm: 1.25 },
                py: 0.5,
                borderRadius: 1,
                minHeight: 26,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                flexShrink: 0,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Add
            </Button>
          </Tooltip>
        </Box>

        {/* Calendars List */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: "hidden", 
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 1,
                height: "100%",
              }}
            >
              <CircularProgress size={24} />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: "0.6875rem" }}
              >
                Loading calendars...
              </Typography>
            </Box>
          ) : hasError ? (
            <Box sx={{ p: 1.5 }}>
              <Alert 
                severity="error"
                sx={{
                  "& .MuiAlert-message": {
                    fontSize: "0.6875rem",
                  },
                  "& .MuiAlert-icon": {
                    fontSize: "1rem",
                  },
                }}
              >
                Error loading some calendars. Please try again.
              </Alert>
            </Box>
          ) : planCalendars.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                No calendars added to this plan. Click "Add" to
                select calendars from maintenance.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {planCalendars.map((calendar: Calendar, index) => (
                  <Box key={calendar.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.75, sm: 1 },
                        px: { xs: 1, sm: 1.25 },
                        py: { xs: 0.75, sm: 1 },
                        transition: theme.transitions.create(["background-color", "border-color"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      {/* Actions */}
                      <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
                        <Tooltip title="Delete calendar" arrow placement="top">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCalendar(calendar.id)}
                            sx={{
                              fontSize: { xs: 14, sm: 16 },
                              p: { xs: 0.375, sm: 0.5 },
                              color: theme.palette.text.secondary,
                              transition: theme.transitions.create(["color", "background-color"], {
                                duration: theme.transitions.duration.shorter,
                              }),
                              "&:hover": {
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {/* Calendar Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.6875rem", sm: "0.75rem" },
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            mb: 0.125,
                            lineHeight: 1.4,
                          }}
                        >
                          {calendar.name}
                        </Typography>
                        {calendar.description && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                              color: theme.palette.text.secondary,
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {calendar.description}
                          </Typography>
                        )}
                        <Stack 
                          direction="row" 
                          spacing={{ xs: 0.5, sm: 0.75 }} 
                          sx={{ mt: 0.25 }}
                          flexWrap="wrap"
                        >
                          {calendar.country && (
                            <Chip
                              label={calendar.country.name}
                              size="small"
                              sx={{
                                height: { xs: 16, sm: 18 },
                                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                                fontWeight: 500,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                "& .MuiChip-label": {
                                  px: { xs: 0.5, sm: 0.625 },
                                },
                              }}
                            />
                          )}
                          <Chip
                            label={`${calendar.days.length} ${calendar.days.length !== 1 ? "days" : "day"}`}
                            size="small"
                            sx={{
                              height: { xs: 16, sm: 18 },
                              fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              "& .MuiChip-label": {
                                px: { xs: 0.5, sm: 0.625 },
                              },
                            }}
                          />
                        </Stack>
                      </Box>
                    </Box>
                    {index < planCalendars.length - 1 && (
                      <Box
                        sx={{
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Paper>
            </Box>
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

// Force Vite cache refresh - updated to use API instead of Redux
