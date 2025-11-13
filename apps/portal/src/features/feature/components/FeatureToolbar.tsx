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

export type ViewMode = "grid" | "list";
export type SortBy = "name" | "date" | "status";

/**
 * Props for FeatureToolbar component
 */
interface FeatureToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * FeatureToolbar Component
 *
 * Provides controls for filtering and viewing features:
 * - Toggle between grid and list views
 * - Sort by name, date, or status
 * - Search/filter by feature name
 *
 * @example
 * ```tsx
 * <FeatureToolbar
 *   viewMode="grid"
 *   onViewModeChange={setViewMode}
 *   sortBy="name"
 *   onSortChange={setSortBy}
 *   searchQuery=""
 *   onSearchChange={setSearchQuery}
 * />
 * ```
 */
export function FeatureToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: FeatureToolbarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2, md: 3 },
        mb: 3,
        flexWrap: "wrap",
        py: 2,
        px: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* View Mode Toggle */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode !== null) onViewModeChange(newMode);
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

      {/* Sort Dropdown */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          displayEmpty
          aria-label="Sort by"
        >
          <MenuItem value="name">Sort: Name</MenuItem>
          <MenuItem value="status">Sort: Status</MenuItem>
          <MenuItem value="date">Sort: Date</MenuItem>
        </Select>
      </FormControl>

      {/* Search Field */}
      <TextField
        size="small"
        placeholder="Search features..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
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
          flex: { xs: "1 1 100%", sm: "0 1 200px" },
          minWidth: 150,
        }}
      />
    </Box>
  );
}
