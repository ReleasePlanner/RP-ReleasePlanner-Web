/**
 * CalendarToolbar Component
 *
 * Provides controls for filtering and viewing calendar days
 */

import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  ViewAgenda as ListIcon,
  ViewComfy as GridIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import type { FilterType, SortBy, ViewMode } from "../types";

interface CalendarToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CalendarToolbar({
  viewMode,
  onViewModeChange,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: CalendarToolbarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        flexWrap: "wrap",
      }}
    >
      {/* View Mode Toggle */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode !== null && newMode !== "calendar") {
              onViewModeChange(newMode as ViewMode);
            }
          }}
          aria-label="view mode"
          size="small"
        >
          <Tooltip title="Grid view">
            <ToggleButton value="grid" aria-label="grid view">
              <GridIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="List view">
            <ToggleButton value="list" aria-label="list view">
              <ListIcon fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>

      {/* Filter by Type */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value as FilterType)}
          displayEmpty
          aria-label="Filter by type"
          sx={{
            fontSize: "0.6875rem",
            "& .MuiSelect-select": {
              py: 0.75,
              fontSize: "0.6875rem",
            },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: "0.6875rem" }}>
            All Days
          </MenuItem>
          <MenuItem value="holiday" sx={{ fontSize: "0.6875rem" }}>
            Holidays Only
          </MenuItem>
          <MenuItem value="special" sx={{ fontSize: "0.6875rem" }}>
            Special Days Only
          </MenuItem>
        </Select>
      </FormControl>

      {/* Sort Dropdown */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          displayEmpty
          aria-label="Sort by"
          sx={{
            fontSize: "0.6875rem",
            "& .MuiSelect-select": {
              py: 0.75,
              fontSize: "0.6875rem",
            },
          }}
        >
          <MenuItem value="date" sx={{ fontSize: "0.6875rem" }}>
            Sort: Date
          </MenuItem>
          <MenuItem value="name" sx={{ fontSize: "0.6875rem" }}>
            Sort: Name
          </MenuItem>
          <MenuItem value="type" sx={{ fontSize: "0.6875rem" }}>
            Sort: Type
          </MenuItem>
        </Select>
      </FormControl>

      {/* Search Field */}
      <TextField
        size="small"
        placeholder="Search days..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: { xs: "1 1 100%", sm: "0 1 240px" },
          minWidth: 180,
          fontSize: "0.6875rem",
          "& input": {
            py: 0.75,
            fontSize: "0.6875rem",
          },
        }}
      />
    </Box>
  );
}
