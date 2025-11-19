/**
 * Calendar Maintenance Page - Elegant, Material UI compliant page
 *
 * Main page for managing holidays and special days by country
 */

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { PageLayout } from "@/components";
import type {
  CalendarDay,
  ViewMode,
  FilterType,
  SortBy,
} from "@/features/calendar/types";
import {
  CalendarDaysList,
  CalendarDayEditDialog,
  generateCalendarDayId,
} from "@/features/calendar";
import {
  useCalendars,
  useCreateCalendar,
  useUpdateCalendar,
} from "../api/hooks";
import { useCountries } from "../api/hooks/useCountries";
import { useQueryClient } from "@tanstack/react-query";
import type {
  Calendar,
  CalendarDay as APICalendarDay,
  CreateCalendarDto,
} from "../api/services/calendars.service";

interface EditingState {
  calendarId: string;
  day: CalendarDay;
}

export function CalendarMaintenancePage() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  // State for country selection
  const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>(undefined);

  // API hooks - filter calendars by selected country
  const { data: apiCalendars = [], isLoading, error } = useCalendars(selectedCountryId);
  const createMutation = useCreateCalendar();
  const updateMutation = useUpdateCalendar();

  // Load countries
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  // Get selected country
  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  // Convert API calendar to local format
  const convertAPICalendarToLocal = (apiCalendar: Calendar): any => {
    return {
      id: apiCalendar.id,
      name: apiCalendar.name,
      description: apiCalendar.description,
      country: apiCalendar.country,
      days: apiCalendar.days.map((day: APICalendarDay) => ({
        id: day.id,
        name: day.name,
        date: day.date,
        type: day.type,
        description: day.description,
        recurring: day.recurring,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
      })),
    };
  };

  // Get the calendar for the selected country (or create one if it doesn't exist)
  const currentCalendar = useMemo(() => {
    if (!selectedCountryId) return null;
    const calendars = apiCalendars.map(convertAPICalendarToLocal);
    // Find calendar for the selected country
    let calendar = calendars.find((c) => c.country?.id === selectedCountryId);
    
    // If no calendar exists, create a default one
    if (!calendar && selectedCountry) {
      // Return a placeholder calendar object that will be created when first day is added
      return {
        id: "",
        name: `${selectedCountry.name} Calendar`,
        description: `Holidays and special days for ${selectedCountry.name}`,
        country: {
          id: selectedCountry.id,
          name: selectedCountry.name,
          code: selectedCountry.code,
        },
        days: [],
      };
    }
    
    return calendar || null;
  }, [apiCalendars, selectedCountryId, selectedCountry]);

  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [searchQuery, setSearchQuery] = useState("");

  // Ensure calendar exists when country is selected
  useEffect(() => {
    if (selectedCountryId && currentCalendar && !currentCalendar.id && selectedCountry) {
      // Calendar doesn't exist yet, but we'll create it when first day is added
      // No need to create it now
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryId, currentCalendar?.id, selectedCountry?.id]);

  // Day handlers
  const handleAddDay = async () => {
    if (!selectedCountryId || !selectedCountry) return;

    // If calendar doesn't exist, create it first
    let calendarId = currentCalendar?.id;
    if (!calendarId || calendarId === "") {
      try {
        const calendarData: CreateCalendarDto = {
          name: `${selectedCountry.name} Calendar`,
          description: `Holidays and special days for ${selectedCountry.name}`,
          countryId: selectedCountryId,
        };
        const createdCalendar = await createMutation.mutateAsync(calendarData);
        calendarId = createdCalendar.id;
        
        // Refresh calendars data to update currentCalendar
        await queryClient.refetchQueries({
          queryKey: ['calendars', 'list', selectedCountryId || 'all'],
        });
      } catch (error) {
        console.error("Error creating calendar:", error);
        return;
      }
    }

    setEditingState({
      calendarId: calendarId!,
      day: {
        id: generateCalendarDayId(),
        name: "",
        date: new Date().toISOString().split("T")[0],
        type: "holiday",
        description: "",
        recurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    setOpenDialog(true);
  };

  const handleEditDay = (day: CalendarDay) => {
    if (!currentCalendar?.id) return;

    setEditingState({
      calendarId: currentCalendar.id,
      day,
    });
    setOpenDialog(true);
  };

  const handleDeleteDay = async (dayId: string) => {
    if (!currentCalendar?.id) return;
    
    try {
      const updatedDays = (currentCalendar.days || [])
        .filter((d: CalendarDay) => d.id !== dayId)
        .map((d: CalendarDay) => ({
          name: d.name,
          date: d.date,
          type: d.type,
          description: d.description,
          recurring: d.recurring,
        }));
      await updateMutation.mutateAsync({
        id: currentCalendar.id,
        data: {
          days: updatedDays,
        },
      });
    } catch (error) {
      console.error("Error deleting day:", error);
    }
  };

  const handleSaveDay = async () => {
    if (!editingState || !selectedCountryId || !selectedCountry) return;

    // Ensure calendar exists before saving
    let calendarId = editingState.calendarId;
    let existingDays: CalendarDay[] = [];

    if (!calendarId || calendarId === "" || !currentCalendar?.id) {
      // Calendar doesn't exist, create it first
      try {
        const calendarData: CreateCalendarDto = {
          name: `${selectedCountry.name} Calendar`,
          description: `Holidays and special days for ${selectedCountry.name}`,
          countryId: selectedCountryId,
        };
        const createdCalendar = await createMutation.mutateAsync(calendarData);
        calendarId = createdCalendar.id;
        
        // Update editingState with the new calendarId
        setEditingState({
          ...editingState,
          calendarId: calendarId,
        });
        
        // Newly created calendar has no days yet, so existingDays is empty
        existingDays = [];
        
        // Refresh calendars data to update the UI
        await queryClient.refetchQueries({
          queryKey: ['calendars', 'list', selectedCountryId || 'all'],
        });
      } catch (error) {
        console.error("Error creating calendar:", error);
        return;
      }
    } else {
      // Calendar exists, use its current days
      existingDays = currentCalendar?.days || [];
    }

    const day = editingState.day;
    const isNew = !existingDays.some((d: CalendarDay) => d.id === day.id);

    try {
      const updatedDays = isNew
        ? [
            ...existingDays.map((d: CalendarDay) => ({
              id: d.id, // Include id for existing days
              name: d.name,
              date: d.date,
              type: d.type,
              description: d.description || undefined,
              recurring: d.recurring,
            })),
            {
              // New day without id - backend will create it
              name: day.name.trim(),
              date: day.date,
              type: day.type,
              description: day.description?.trim() || undefined,
              recurring: day.recurring,
            },
          ]
        : existingDays.map((d: CalendarDay) =>
            d.id === day.id
              ? {
                  id: d.id, // Include id for updated day
                  name: day.name.trim(),
                  date: day.date,
                  type: day.type,
                  description: day.description?.trim() || undefined,
                  recurring: day.recurring,
                }
              : {
                  id: d.id, // Include id for unchanged days
                  name: d.name,
                  date: d.date,
                  type: d.type,
                  description: d.description || undefined,
                  recurring: d.recurring,
                }
          );

      await updateMutation.mutateAsync({
        id: calendarId,
        data: {
          days: updatedDays,
        },
      });

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving day:", error);
      throw error; // Re-throw to let React Query handle it
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  // Loading state
  if (isLoading || countriesLoading) {
    return (
      <PageLayout
        title="Calendar Management"
        description="Manage holidays and special days by country"
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout
        title="Calendar Management"
        description="Manage holidays and special days by country"
      >
        <Box p={3}>
          <Alert severity="error">
            Error loading calendars:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Calendar Management"
      description="Manage holidays and special days by country"
    >
      {/* Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
        }}
      >
        {/* Sidebar: Country Selector */}
        <Box>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header */}
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 0.5, 
                      fontSize: "0.8125rem",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Select Country
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: "0.6875rem",
                      color: theme.palette.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    Choose a country to manage its holidays and special days. The calendar will be created automatically when you add the first day.
                  </Typography>
                </Box>

                {/* Country Selector */}
                <FormControl fullWidth size="small">
                  <InputLabel 
                    sx={{
                      fontSize: "0.75rem",
                    }}
                  >
                    Country
                  </InputLabel>
                  <Select
                    value={selectedCountryId || ""}
                    label="Country"
                    onChange={(e) => {
                      const countryId = e.target.value || undefined;
                      setSelectedCountryId(countryId);
                    }}
                    renderValue={(value) => {
                      if (!value) return "Select a country";
                      const country = countries.find((c) => c.id === value);
                      return country ? `${country.name} (${country.code})` : "";
                    }}
                    sx={{
                      fontSize: "0.75rem",
                      "& .MuiSelect-select": {
                        py: 0.75,
                        fontSize: "0.75rem",
                      },
                      borderRadius: 1.5,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.divider, 0.3),
                      },
                    }}
                  >
                    {countries.map((country) => (
                      <MenuItem 
                        key={country.id} 
                        value={country.id}
                        sx={{ fontSize: "0.75rem", py: 0.5, minHeight: 32 }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                          <Typography 
                            variant="body2"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {country.name}
                          </Typography>
                          <Chip
                            label={country.code}
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
                            }}
                          />
                          {country.region && (
                            <Typography
                              variant="caption"
                              sx={{ 
                                ml: "auto", 
                                fontSize: "0.6875rem",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {country.region}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Country Info */}
                {selectedCountry && (
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: 1.5,
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          fontSize: "0.8125rem",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {selectedCountry.name}
                      </Typography>
                      <Chip
                        label={selectedCountry.code}
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
                        }}
                      />
                    </Box>
                    {selectedCountry.region && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: "0.6875rem",
                          color: theme.palette.text.secondary,
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Region: {selectedCountry.region}
                      </Typography>
                    )}
                    {currentCalendar && (
                      <Typography
                        variant="caption"
                        sx={{ 
                          fontSize: "0.6875rem",
                          color: theme.palette.text.secondary,
                          display: "block",
                        }}
                      >
                        Total days: {currentCalendar.days?.length || 0}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Main: Days List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {!selectedCountryId ? (
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                borderRadius: 2,
                p: 6,
                textAlign: "center",
              }}
            >
              <CalendarIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.text.secondary,
                  mb: 1.5,
                  opacity: 0.5,
                }}
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 0.5, 
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: theme.palette.text.secondary,
                }}
              >
                Select a Country
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.disabled,
                }}
              >
                Choose a country from the sidebar to view and manage its holidays and special days
              </Typography>
            </Paper>
          ) : (
            <CalendarDaysList
              calendar={currentCalendar}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filterType={filterType}
              onFilterChange={setFilterType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddDay={handleAddDay}
              onEditDay={handleEditDay}
              onDeleteDay={handleDeleteDay}
            />
          )}
        </Box>
      </Box>

      {/* Day Edit Dialog */}
      <CalendarDayEditDialog
        open={openDialog}
        editing={editingState?.day !== undefined}
        day={editingState?.day || null}
        calendarName={currentCalendar?.name || selectedCountry?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSaveDay}
        onDayChange={(day: CalendarDay) => {
          if (editingState) {
            setEditingState({
              ...editingState,
              day,
            });
          }
        }}
      />
    </PageLayout>
  );
}
export default CalendarMaintenancePage;
