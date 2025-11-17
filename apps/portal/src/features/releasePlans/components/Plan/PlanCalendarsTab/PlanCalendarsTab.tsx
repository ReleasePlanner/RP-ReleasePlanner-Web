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
      }}
    >
      <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
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
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: theme.palette.text.primary,
            }}
          >
            Calendarios ({planCalendars.length})
          </Typography>
          <Tooltip title="Agregar calendarios del mantenimiento" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                minHeight: 28,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Agregar
            </Button>
          </Tooltip>
        </Box>

        {/* Calendars List */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {isLoading ? (
            <Box
              sx={{
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                Cargando calendarios...
              </Typography>
            </Box>
          ) : hasError ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                Error al cargar algunos calendarios. Por favor intente nuevamente.
              </Alert>
            </Box>
          ) : planCalendars.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.8125rem" }}
              >
                No hay calendarios agregados a este plan. Haz clic en "Agregar" para
                seleccionar calendarios del mantenimiento.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {planCalendars.map((calendar: Calendar) => (
                <Box
                  key={calendar.id}
                  sx={{
                    p: { xs: 1.25, sm: 1.5 },
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    bgcolor: theme.palette.background.paper,
                    transition: theme.transitions.create(
                      ["border-color", "box-shadow"],
                      {
                        duration: theme.transitions.duration.shorter,
                      }
                    ),
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      boxShadow: `0 1px 3px ${alpha(
                        theme.palette.common.black,
                        0.06
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
                        {calendar.country && (
                          <Chip
                            label={calendar.country.name}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.info.main, 0.08),
                              color: theme.palette.info.main,
                              "& .MuiChip-label": {
                                px: 1,
                              },
                            }}
                          />
                        )}
                        <Chip
                          label={`${calendar.days.length} día${
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
                    <Tooltip title="Eliminar calendario" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCalendar(calendar.id)}
                        sx={{
                          color: alpha(theme.palette.error.main, 0.7),
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

// Force Vite cache refresh - updated to use API instead of Redux
