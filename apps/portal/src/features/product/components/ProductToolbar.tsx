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
export type SortBy = "name" | "date";

/**
 * Props for ProductToolbar component
 */
interface ProductToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * ProductToolbar Component
 *
 * Provides controls for filtering and viewing products:
 * - Toggle between grid and list views
 * - Sort by name or date
 * - Search/filter by product name
 *
 * @example
 * ```tsx
 * <ProductToolbar
 *   viewMode="grid"
 *   onViewModeChange={setViewMode}
 *   sortBy="name"
 *   onSortChange={setSortBy}
 *   searchQuery=""
 *   onSearchChange={setSearchQuery}
 * />
 * ```
 */
export function ProductToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}: ProductToolbarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {/* View Mode Toggle */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode !== null) onViewModeChange(newMode);
        }}
        aria-label="view mode"
        size="small"
        sx={{
          "& .MuiToggleButton-root": {
            px: 1.5,
            py: 0.75,
            border: `1px solid ${theme.palette.divider}`,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        }}
      >
        <Tooltip title="Grid view" arrow placement="top">
          <ToggleButton value="grid" aria-label="grid view">
            <GridIcon fontSize="small" />
          </ToggleButton>
        </Tooltip>
        <Tooltip title="List view" arrow placement="top">
          <ToggleButton value="list" aria-label="list view">
            <ListIcon fontSize="small" />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      {/* Sort Dropdown */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          displayEmpty
          aria-label="Sort by"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.divider,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <MenuItem value="name">Sort: Name</MenuItem>
          <MenuItem value="date">Sort: Date</MenuItem>
        </Select>
      </FormControl>

      {/* Search Field */}
      <TextField
        size="small"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: { xs: "1 1 100%", sm: "0 1 250px" },
          minWidth: 150,
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
    </Box>
  );
}
