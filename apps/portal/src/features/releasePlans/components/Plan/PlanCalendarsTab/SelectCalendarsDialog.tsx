/**
 * SelectCalendarsDialog Component
 * Dialog for selecting calendars from maintenance to add to a release plan
 */
import { useState, useMemo } from "react";
import {
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
  Stack,
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
import { BaseEditDialog } from "@/components/BaseEditDialog";

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

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAddCalendars(selectedIds);
      setSelectedIds([]);
      setSearchQuery("");
    }
  };

  return (
    <BaseEditDialog
      open={open}
      onClose={handleClose}
      editing={false}
      title="Select Calendars"
      subtitle={selectedCountryId ? undefined : "Select a country to view calendars"}
      subtitleChip={selectedIds.length > 0 ? `${selectedIds.length} selected` : undefined}
      maxWidth="lg"
      fullWidth={true}
      onSave={handleAdd}
      saveButtonText={`Add ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`}
      saveButtonDisabled={selectedIds.length === 0}
      isFormValid={selectedIds.length > 0}
      showDefaultActions={true}
      cancelButtonText="Cancel"
    >
      {/* Main Content */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}>
        {/* Toolbar */}
        <Stack
          spacing={1}
          sx={{
            pb: 1.5,
            mb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            flexShrink: 0,
          }}
        >
          {/* Country Filter and Search Row */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Country Filter */}
            <FormControl
              size="small"
              sx={{
                minWidth: 160,
                flex: { xs: "1 1 100%", sm: "0 1 200px" },
              }}
            >
              <InputLabel 
                id="country-filter-label"
                sx={{ fontSize: "0.625rem" }}
              >
                Country
              </InputLabel>
              <Select
                labelId="country-filter-label"
                id="country-filter-select"
                value={selectedCountryId}
                label="Country"
                onChange={(e) => handleCountryChange(e.target.value)}
                disabled={countriesLoading}
                required
                sx={{
                  fontSize: "0.6875rem",
                  "& .MuiSelect-select": {
                    py: 0.75,
                    fontSize: "0.6875rem",
                  },
                }}
              >
                {countries.map((country) => (
                  <MenuItem 
                    key={country.id} 
                    value={country.id}
                    sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
                  >
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
              placeholder="Search calendars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flex: { xs: "1 1 100%", sm: "0 1 240px" },
                minWidth: 180,
                fontSize: "0.6875rem",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  fontSize: "0.6875rem",
                },
                "& input": {
                  py: 0.75,
                  fontSize: "0.6875rem",
                },
              }}
            />

            {/* Select All */}
            {filteredCalendars.length > 0 && (
              <Button
                size="small"
                onClick={handleSelectAll}
                startIcon={
                  isAllSelected ? <CheckBox sx={{ fontSize: 16 }} /> : <CheckBoxOutlineBlank sx={{ fontSize: 16 }} />
                }
                sx={{ 
                  textTransform: "none",
                  fontSize: "0.6875rem",
                  px: 1.25,
                  py: 0.5,
                  ml: "auto",
                }}
              >
                {isAllSelected ? "Deselect all" : "Select all"}
              </Button>
            )}
          </Box>
        </Stack>

        {/* Calendars Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, width: "100%" }}>
          {!selectedCountryId ? (
            <Box
              sx={{
                p: 4,
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
                Please select a country to view available calendars.
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
                gap: 1,
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
          ) : calendarsError ? (
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
                Error loading calendars. Please try again.
              </Alert>
            </Box>
          ) : filteredCalendars.length === 0 ? (
            <Box
              sx={{
                p: 4,
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
                {searchQuery
                  ? "No calendars found matching search."
                  : "No calendars available for this country."}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ width: "100%", maxHeight: "100%" }}>
              <Table 
                size="small" 
                stickyHeader 
                sx={{ 
                  width: "100%",
                  tableLayout: "auto",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell 
                      padding="checkbox" 
                      sx={{ 
                        width: 48,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      <Checkbox
                        id="select-all-calendars-checkbox"
                        name="selectAllCalendars"
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Calendar
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Country
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: "0.625rem",
                        py: 1,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      Days
                    </TableCell>
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
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={calendar.name} arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 600 : 400,
                                fontSize: "0.6875rem",
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
                        <TableCell sx={{ py: 1 }}>
                          {calendar.country ? (
                            <Chip
                              label={calendar.country.name}
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
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.disabled"
                              sx={{ fontSize: "0.6875rem" }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={calendar.description || ""} arrow>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.6875rem",
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
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={`${calendar.days.length} ${
                              calendar.days.length !== 1 ? "days" : "day"
                            }`}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.625rem",
                              fontWeight: 500,
                              "& .MuiChip-label": {
                                px: 0.75,
                              },
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
      </Box>
    </BaseEditDialog>
  );
}

// Force Vite cache refresh - updated to use API instead of Redux
