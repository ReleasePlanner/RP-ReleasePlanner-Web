/**
 * Calendar Maintenance Page
 *
 * Main page for managing calendars, holidays, and special days
 */

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { CalendarDay, ViewMode, FilterType, SortBy } from "@/features/calendar/types";
import {
  CalendarSelector,
  CalendarDaysList,
  CalendarDayEditDialog,
  useCalendars,
  generateCalendarDayId,
} from "@/features/calendar";
import { MOCK_CALENDARS } from "@/features/calendar/constants";

interface EditingState {
  calendarId: string;
  day: CalendarDay;
}

export function CalendarMaintenancePage() {
  const {
    calendars,
    selectedCalendarId,
    setSelectedCalendarId,
    selectedCalendar,
    addDayToCalendar,
    updateDayInCalendar,
    deleteDayFromCalendar,
  } = useCalendars(MOCK_CALENDARS);

  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [searchQuery, setSearchQuery] = useState("");

  // Handlers
  const handleAddDay = () => {
    if (!selectedCalendarId) return;

    setEditingState({
      calendarId: selectedCalendarId,
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
    if (!selectedCalendarId) return;

    setEditingState({
      calendarId: selectedCalendarId,
      day,
    });
    setOpenDialog(true);
  };

  const handleDeleteDay = (dayId: string) => {
    if (!selectedCalendarId) return;
    deleteDayFromCalendar(selectedCalendarId, dayId);
  };

  const handleSaveDay = () => {
    if (!editingState) return;

    const day = editingState.day;
    const isNew = !selectedCalendar?.days.some((d) => d.id === day.id);

    if (isNew) {
      addDayToCalendar(editingState.calendarId, day);
    } else {
      updateDayInCalendar(editingState.calendarId, day.id, day);
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        py: 0,
        px: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Calendar Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage holidays and special days across multiple calendars
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "280px 1fr" },
          gap: 3,
          flex: 1,
        }}
      >
        {/* Sidebar: Calendar Selector */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <CalendarSelector
            calendars={calendars}
            selectedCalendarId={selectedCalendarId}
            onSelectCalendar={setSelectedCalendarId}
          />
        </Box>

        {/* Main: Days List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Mobile Calendar Selector */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <CalendarSelector
              calendars={calendars}
              selectedCalendarId={selectedCalendarId}
              onSelectCalendar={setSelectedCalendarId}
            />
          </Box>

          {/* Calendar Days List */}
          <CalendarDaysList
            calendar={selectedCalendar}
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
        </Box>
      </Box>

      {/* Edit Dialog */}
      <CalendarDayEditDialog
        open={openDialog}
        editing={editingState?.day !== undefined}
        day={editingState?.day || null}
        calendarName={selectedCalendar?.name || null}
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
    </Box>
  );
}
