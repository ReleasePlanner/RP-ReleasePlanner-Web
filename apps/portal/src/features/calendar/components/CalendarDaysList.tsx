/**
 * CalendarDaysList Component
 *
 * Displays calendar days with toolbar for filtering and sorting
 * Component for rendering calendar days in compact, minimalist list view
 */

import { useMemo } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
} from "@mui/icons-material";
import type {
  Calendar,
  CalendarDay,
  FilterType,
  SortBy,
  ViewMode,
} from "../types";
import { processDays } from "../utils";
import { formatDate } from "../utils/calendarUtils";
import { CalendarToolbar } from "./CalendarToolbar";

interface CalendarDaysListProps {
  calendar: Calendar | undefined;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddDay: () => void;
  onEditDay: (day: CalendarDay) => void;
  onDeleteDay: (dayId: string) => void;
}

export function CalendarDaysList({
  calendar,
  viewMode,
  onViewModeChange,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onAddDay,
  onEditDay,
  onDeleteDay,
}: CalendarDaysListProps) {
  const theme = useTheme();
  
  // Process days with filtering, searching, and sorting
  const processedDays = useMemo(() => {
    if (!calendar) return [];
    return processDays(calendar.days, filterType, searchQuery, sortBy);
  }, [calendar, filterType, searchQuery, sortBy]);

  if (!calendar) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            mb: 0.5,
          }}
        >
          Select a calendar to view and manage days
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Toolbar with controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <CalendarToolbar
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          filterType={filterType}
          onFilterChange={onFilterChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={onAddDay}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 2,
            py: 0.75,
            boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&:hover": {
              boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          Add Day
        </Button>
      </Box>

      {/* Days List - Compact and Minimalist */}
      {processedDays.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              mb: 0.5,
            }}
          >
            {calendar.days.length === 0 ? "No days configured" : "No days found"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {calendar.days.length === 0
              ? "Start by adding your first calendar day"
              : searchQuery
              ? "Try adjusting your search criteria."
              : "No days match your filters."}
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {processedDays.map((day, index) => (
            <Box key={day.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                {/* Day Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      mb: 0.25,
                    }}
                  >
                    {day.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6875rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {formatDate(day.date)}
                    </Typography>
                    <Chip
                      label={day.type === "holiday" ? "Holiday" : "Special Day"}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        bgcolor: day.type === "holiday" 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.info.main, 0.1),
                        color: day.type === "holiday"
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                        "& .MuiChip-label": {
                          px: 0.75,
                        },
                      }}
                    />
                    {day.recurring && (
                      <Chip
                        icon={<RepeatIcon sx={{ fontSize: 12 }} />}
                        label="Recurring"
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.625rem",
                          fontWeight: 500,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          "& .MuiChip-label": {
                            px: 0.75,
                          },
                          "& .MuiChip-icon": {
                            marginLeft: 0.5,
                            marginRight: -0.5,
                          },
                        }}
                      />
                    )}
                  </Stack>
                  {day.description && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.6875rem",
                        color: theme.palette.text.secondary,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {day.description}
                    </Typography>
                  )}
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
                  <Tooltip title="Edit day">
                    <IconButton
                      size="small"
                      onClick={() => onEditDay(day)}
                      sx={{
                        fontSize: 16,
                        p: 0.75,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete day">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteDay(day.id)}
                      sx={{
                        fontSize: 16,
                        p: 0.75,
                        color: theme.palette.text.secondary,
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
              </Box>
              {index < processedDays.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
