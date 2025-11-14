/**
 * Calendar Maintenance Page - Elegant, Material UI compliant page
 *
 * Main page for managing calendars, holidays, and special days
 */

import { useState, useMemo, useEffect } from "react";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  generateCalendarDayId,
} from "@/features/calendar";
import {
  useCalendars,
  useCreateCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
} from "../api/hooks";
import type { Calendar, CalendarDay as APICalendarDay, CreateCalendarDto } from "../api/services/calendars.service";

interface EditingState {
  calendarId: string;
  day: CalendarDay;
}

export function CalendarMaintenancePage() {
  // API hooks
  const { data: apiCalendars = [], isLoading, error } = useCalendars();
  const createMutation = useCreateCalendar();
  const updateMutation = useUpdateCalendar();
  const deleteMutation = useDeleteCalendar();

  const [selectedCalendarId, setSelectedCalendarId] = useState<string>(
    apiCalendars[0]?.id || ""
  );

  // Convert API calendar to local format
  const convertAPICalendarToLocal = (apiCalendar: Calendar): any => {
    return {
      id: apiCalendar.id,
      name: apiCalendar.name,
      description: apiCalendar.description,
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

  const calendars = useMemo(() => apiCalendars.map(convertAPICalendarToLocal), [apiCalendars]);
  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);

  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<{ name: string; description: string } | null>(null);
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [searchQuery, setSearchQuery] = useState("");

  // Calendar CRUD handlers
  const handleAddCalendar = () => {
    setEditingCalendarId(null);
    setEditingCalendar({ name: "", description: "" });
    setOpenCalendarDialog(true);
  };

  const handleEditCalendar = (calendar: any) => {
    setEditingCalendarId(calendar.id);
    setEditingCalendar({ name: calendar.name, description: calendar.description || "" });
    setOpenCalendarDialog(true);
  };

  const handleDeleteCalendar = async (calendarId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este calendario? Esta acción no se puede deshacer.")) {
      try {
        await deleteMutation.mutateAsync(calendarId);
        // If deleted calendar was selected, select first available calendar
        if (selectedCalendarId === calendarId && apiCalendars.length > 1) {
          const remainingCalendars = apiCalendars.filter(c => c.id !== calendarId);
          if (remainingCalendars.length > 0) {
            setSelectedCalendarId(remainingCalendars[0].id);
          } else {
            setSelectedCalendarId("");
          }
        }
      } catch (error) {
        console.error('Error deleting calendar:', error);
      }
    }
  };

  const handleSaveCalendar = async () => {
    if (!editingCalendar || !editingCalendar.name.trim()) return;

    try {
      if (editingCalendarId) {
        // Update existing calendar
        await updateMutation.mutateAsync({
          id: editingCalendarId,
          data: {
            name: editingCalendar.name.trim(),
            description: editingCalendar.description?.trim() || undefined,
          },
        });
      } else {
        // Create new calendar
        const calendarData: CreateCalendarDto = {
          name: editingCalendar.name.trim(),
          description: editingCalendar.description?.trim() || undefined,
        };

        const createdCalendar = await createMutation.mutateAsync(calendarData);
        // Select the newly created calendar
        if (createdCalendar) {
          setSelectedCalendarId(createdCalendar.id);
        }
      }
      setOpenCalendarDialog(false);
      setEditingCalendar(null);
      setEditingCalendarId(null);
    } catch (error) {
      console.error('Error saving calendar:', error);
    }
  };

  const handleCloseCalendarDialog = () => {
    setOpenCalendarDialog(false);
    setEditingCalendar(null);
    setEditingCalendarId(null);
  };

  // Day handlers
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

  const handleDeleteDay = async (dayId: string) => {
    if (!selectedCalendarId || !selectedCalendar) return;
    try {
      const updatedDays = selectedCalendar.days
        .filter((d: CalendarDay) => d.id !== dayId)
        .map((d: CalendarDay) => ({
          name: d.name,
          date: d.date,
          type: d.type,
          description: d.description,
          recurring: d.recurring,
        }));
      await updateMutation.mutateAsync({
        id: selectedCalendarId,
        data: {
          days: updatedDays,
        },
      });
    } catch (error) {
      console.error('Error deleting day:', error);
    }
  };

  const handleSaveDay = async () => {
    if (!editingState || !selectedCalendar) return;

    const day = editingState.day;
    const isNew = !selectedCalendar.days.some((d: CalendarDay) => d.id === day.id);

    try {
      const updatedDays = isNew
        ? [
            ...selectedCalendar.days.map((d: CalendarDay) => ({
              name: d.name,
              date: d.date,
              type: d.type,
              description: d.description,
              recurring: d.recurring,
            })),
            {
              name: day.name,
              date: day.date,
              type: day.type,
              description: day.description,
              recurring: day.recurring,
            },
          ]
        : selectedCalendar.days.map((d: CalendarDay) =>
            d.id === day.id
              ? {
                  name: day.name,
                  date: day.date,
                  type: day.type,
                  description: day.description,
                  recurring: day.recurring,
                }
              : {
                  name: d.name,
                  date: d.date,
                  type: d.type,
                  description: d.description,
                  recurring: d.recurring,
                }
          );

      await updateMutation.mutateAsync({
        id: editingState.calendarId,
        data: {
          days: updatedDays,
        },
      });

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving day:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  // Update selectedCalendarId when calendars load
  useEffect(() => {
    if (apiCalendars.length > 0 && !selectedCalendarId) {
      setSelectedCalendarId(apiCalendars[0].id);
    }
  }, [apiCalendars, selectedCalendarId]);

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Calendar Management" description="Manage holidays and special days across multiple calendars">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Calendar Management" description="Manage holidays and special days across multiple calendars">
        <Box p={3}>
          <Alert severity="error">
            Error al cargar los calendarios: {error instanceof Error ? error.message : 'Error desconocido'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Calendar Management"
      description="Manage holidays and special days across multiple calendars"
      actions={
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddCalendar}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            New Calendar
          </Button>
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
        </Box>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            <CalendarSelector
              calendars={calendars}
              selectedCalendarId={selectedCalendarId}
              onSelectCalendar={setSelectedCalendarId}
            />
            {selectedCalendar && (
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Tooltip title="Edit Calendar">
                  <IconButton
                    size="small"
                    onClick={() => handleEditCalendar(selectedCalendar)}
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Calendar">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCalendar(selectedCalendar.id)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>

        {/* Main: Days List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Mobile Calendar Selector */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
              <CalendarSelector
                calendars={calendars}
                selectedCalendarId={selectedCalendarId}
                onSelectCalendar={setSelectedCalendarId}
              />
              {selectedCalendar && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditCalendar(selectedCalendar)}
                    sx={{ textTransform: "none" }}
                  >
                    Edit Calendar
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteCalendar(selectedCalendar.id)}
                    color="error"
                    sx={{ textTransform: "none" }}
                  >
                    Delete Calendar
                  </Button>
                </Box>
              )}
            </Box>
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

      {/* Calendar Edit Dialog */}
      <Dialog open={openCalendarDialog} onClose={handleCloseCalendarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCalendarId ? "Edit Calendar" : "New Calendar"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Calendar Name"
              value={editingCalendar?.name || ""}
              onChange={(e) =>
                setEditingCalendar({ ...editingCalendar!, name: e.target.value })
              }
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Description"
              value={editingCalendar?.description || ""}
              onChange={(e) =>
                setEditingCalendar({ ...editingCalendar!, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCalendarDialog} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveCalendar}
            variant="contained"
            disabled={!editingCalendar?.name?.trim()}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Day Edit Dialog */}
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
export default CalendarMaintenancePage;
