/**
 * SelectCalendarsDialog Component
 * Dialog for selecting calendars from maintenance to add to a release plan
 */
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import type { Calendar } from "@/features/calendar/types";
import { useCountries } from "@/api/hooks/useCountries";
import { useCalendars } from "@/api/hooks/useCalendars";
import type { Calendar as APICalendar, CalendarDay as APICalendarDay } from "@/api/services/calendars.service";

export type SelectCalendarsDialogProps = {
  open: boolean;
  selectedCalendarIds: string[];
  onClose: () => void;
  onAddCalendars: (calendarIds: string[]) => void;
};

export function SelectCalendarsDialog({
  open,
  selectedCalendarIds,
  onClose,
  onAddCalendars,
}: SelectCalendarsDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  // Load countries from maintenance
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  // Load calendars from API when a country is selected
  const { 
    data: apiCalendars = [], 
    isLoading: calendarsLoading, 
    error: calendarsError 
  } = useCalendars(selectedCountryId || undefined);

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
      createdAt: apiCalendar.createdAt,
      updatedAt: apiCalendar.updatedAt,
    };
  };

  // Convert API calendars to local format
  const allCalendars = useMemo(() => {
    return apiCalendars.map(convertAPICalendarToLocal);
  }, [apiCalendars]);

  // Filter out calendars already in the plan
  const availableCalendars = useMemo(() => {
    return allCalendars.filter(
      (c: Calendar) => !selectedCalendarIds.includes(c.id)
    );
  }, [allCalendars, selectedCalendarIds]);

  // Filter by search query
  const filteredCalendars = useMemo(() => {
    if (!searchQuery.trim()) return availableCalendars;
    const query = searchQuery.toLowerCase();
    return availableCalendars.filter(
      (c: Calendar) =>
        c.name.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query)) ||
        (c.country?.name && c.country.name.toLowerCase().includes(query))
    );
  }, [availableCalendars, searchQuery]);

  const handleToggleCalendar = (calendarId: string) => {
    setSelectedIds((prev) =>
      prev.includes(calendarId)
        ? prev.filter((id) => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCalendars.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCalendars.map((c: Calendar) => c.id));
    }
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAddCalendars(selectedIds);
      setSelectedIds([]);
      setSearchQuery("");
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery("");
    setSelectedCountryId("");
    onClose();
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    // Clear selected calendars when country changes
    setSelectedIds([]);
  };

  const isAllSelected =
    filteredCalendars.length > 0 &&
    selectedIds.length === filteredCalendars.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredCalendars.length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh",
          maxHeight: 800,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div">
            Seleccionar Calendarios para Agregar
          </Typography>
          {selectedIds.length > 0 && (
            <Typography variant="body2" color="primary">
              {selectedIds.length} selected
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ p: 0, display: "flex", flexDirection: "column" }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Country Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              flex: { xs: "1 1 100%", sm: "0 1 200px" },
            }}
          >
            <InputLabel id="country-filter-label">País</InputLabel>
            <Select
              labelId="country-filter-label"
              id="country-filter-select"
              value={selectedCountryId}
              label="País"
              onChange={(e) => handleCountryChange(e.target.value)}
              disabled={countriesLoading}
              required
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search */}
          <TextField
            id="select-calendars-search-input"
            name="calendarsSearch"
            size="small"
            placeholder="Buscar calendarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: { xs: "1 1 100%", sm: "0 1 250px" },
              minWidth: 200,
            }}
          />

          {/* Select All */}
          {filteredCalendars.length > 0 && (
            <Button
              size="small"
              onClick={handleSelectAll}
              startIcon={
                isAllSelected ? <CheckBox /> : <CheckBoxOutlineBlank />
              }
              sx={{ textTransform: "none" }}
            >
              {isAllSelected ? "Deseleccionar todo" : "Seleccionar todo"}
            </Button>
          )}
        </Box>

        {/* Calendars Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {!selectedCountryId ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                Por favor seleccione un país para ver los calendarios disponibles.
              </Typography>
            </Box>
          ) : calendarsLoading ? (
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
          ) : calendarsError ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">
                Error al cargar los calendarios. Por favor intente nuevamente.
              </Alert>
            </Box>
          ) : filteredCalendars.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                {searchQuery
                  ? "No hay calendarios que coincidan con la búsqueda."
                  : "No hay calendarios disponibles para este país."}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 50 }}>
                      <Checkbox
                        id="select-all-calendars-checkbox"
                        name="selectAllCalendars"
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Calendario</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>País</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Días</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCalendars.map((calendar: Calendar) => {
                    const isSelected = selectedIds.includes(calendar.id);
                    return (
                      <TableRow
                        key={calendar.id}
                        hover
                        onClick={() => handleToggleCalendar(calendar.id)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: isSelected
                            ? alpha(theme.palette.primary.main, 0.08)
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? alpha(theme.palette.primary.main, 0.12)
                              : alpha(theme.palette.action.hover, 0.04),
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            id={`calendar-checkbox-${calendar.id}`}
                            name={`calendar-${calendar.id}`}
                            checked={isSelected}
                            onChange={() => handleToggleCalendar(calendar.id)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={calendar.name} arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 600 : 400,
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {calendar.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {calendar.country ? (
                            <Chip
                              label={calendar.country.name}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                color: theme.palette.primary.main,
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.disabled"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={calendar.description || ""} arrow>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {calendar.description || "-"}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${calendar.days.length} día${
                              calendar.days.length !== 1 ? "s" : ""
                            }`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selectedIds.length === 0}
        >
          Agregar {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Force Vite cache refresh - updated to use API instead of Redux
