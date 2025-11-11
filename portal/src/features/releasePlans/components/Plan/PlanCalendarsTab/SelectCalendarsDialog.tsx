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
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import { useAppSelector } from "@/store/hooks";
import type { Calendar } from "@/features/calendar/types";

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

  // Get all calendars from Redux store
  const allCalendars = useAppSelector((state) => state.calendars.calendars);

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
        (c.description && c.description.toLowerCase().includes(query))
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
    onClose();
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
            Select Calendars to Add
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
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search calendars..."
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
              {isAllSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
        </Box>

        {/* Calendars Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {filteredCalendars.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                {searchQuery
                  ? "No calendars match your search."
                  : "No available calendars to add."}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 50 }}>
                      <Checkbox
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Calendar</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Days</TableCell>
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
                            label={`${calendar.days.length} day${
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selectedIds.length === 0}
        >
          Add {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
