/**
 * Calendar Maintenance Page - Elegant, Material UI compliant page
 *
 * Main page for managing calendars, holidays, and special days
 */

import { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageLayout } from "@/components";
import type {
  CalendarDay,
  ViewMode,
  FilterType,
  SortBy,
} from "@/features/calendar/types";
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
    <PageLayout
      title="Calendar Management"
      description="Manage holidays and special days across multiple calendars"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDay}
          disabled={!selectedCalendarId}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Add Holiday/Day
        </Button>
      }
    >
      {/* Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
          height: "100%",
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
    </PageLayout>
  );
}
