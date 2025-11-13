/**
 * PageToolbar Component
 *
 * Reusable toolbar with common controls for maintenance pages
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
  alpha,
} from "@mui/material";
import {
  ViewAgenda as ListIcon,
  ViewComfy as GridIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export type ViewMode = "grid" | "list";
export type SortOption = { value: string; label: string };

interface PageToolbarProps {
  /**
   * Current view mode
   */
  viewMode?: ViewMode;
  /**
   * View mode change handler
   */
  onViewModeChange?: (mode: ViewMode) => void;
  /**
   * Current sort value
   */
  sortBy?: string;
  /**
   * Sort options
   */
  sortOptions?: SortOption[];
  /**
   * Sort change handler
   */
  onSortChange?: (value: string) => void;
  /**
   * Search query
   */
  searchQuery?: string;
  /**
   * Search placeholder
   */
  searchPlaceholder?: string;
  /**
   * Search change handler
   */
  onSearchChange?: (query: string) => void;
  /**
   * Show view toggle
   */
  showViewToggle?: boolean;
  /**
   * Show sort dropdown
   */
  showSort?: boolean;
  /**
   * Show search field
   */
  showSearch?: boolean;
}

/**
 * PageToolbar Component
 *
 * Elegant, consistent toolbar for all maintenance pages:
 * - View mode toggle (grid/list)
 * - Sort dropdown
 * - Search field
 * - Material UI compliant
 * - Responsive design
 *
 * @example
 * ```tsx
 * <PageToolbar
 *   viewMode="grid"
 *   onViewModeChange={setViewMode}
 *   sortBy="name"
 *   sortOptions={[{ value: "name", label: "Name" }]}
 *   onSortChange={setSortBy}
 *   searchQuery={query}
 *   onSearchChange={setQuery}
 * />
 * ```
 */
export function PageToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  sortOptions = [],
  onSortChange,
  searchQuery = "",
  searchPlaceholder = "Search...",
  onSearchChange,
  showViewToggle = true,
  showSort = true,
  showSearch = true,
}: PageToolbarProps) {
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
      {showViewToggle && viewMode && onViewModeChange && (
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
              color: theme.palette.text.secondary,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
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
      )}

      {/* Sort Dropdown */}
      {showSort && sortBy && sortOptions.length > 0 && onSortChange && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            displayEmpty
            aria-label="Sort by"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.divider,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Search Field */}
      {showSearch && onSearchChange && (
        <TextField
          size="small"
          placeholder={searchPlaceholder}
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
            flex: { xs: "1 1 100%", sm: "0 1 280px" },
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              "&:hover": {
                backgroundColor: theme.palette.background.paper,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                backgroundColor: theme.palette.background.paper,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          }}
        />
      )}
    </Box>
  );
}
