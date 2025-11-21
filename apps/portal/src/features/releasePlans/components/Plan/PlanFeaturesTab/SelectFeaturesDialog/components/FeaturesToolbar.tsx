import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button, Typography, Stack, Chip, useTheme } from "@mui/material";
import { Search as SearchIcon, CheckBox, CheckBoxOutlineBlank, FilterList as FilterIcon } from "@mui/icons-material";
import { STATUS_LABELS, STATUS_COLORS } from "../../../../../../feature/constants";
import type { SortBy } from "../../../../../../feature/components/FeatureToolbar";
import type { FeatureStatus } from "../../../../../../feature/types";
import { alpha } from "@mui/material";

export type FeaturesToolbarProps = {
  readonly searchQuery: string;
  readonly onSearchChange: (value: string) => void;
  readonly sortBy: SortBy;
  readonly onSortChange: (value: SortBy) => void;
  readonly statusFilter: FeatureStatus | "all";
  readonly onStatusFilterChange: (value: FeatureStatus | "all") => void;
  readonly statusCounts: Record<FeatureStatus | "all", number>;
  readonly selectableFeaturesCount: number;
  readonly isAllSelected: boolean;
  readonly isSomeSelected: boolean;
  readonly onSelectAll: () => void;
};

export function FeaturesToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  selectableFeaturesCount,
  isAllSelected,
  isSomeSelected,
  onSelectAll,
}: FeaturesToolbarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 2,
        pb: 1.5,
        pt: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Search and Sort Row */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <TextField
          id="select-features-search-input"
          name="featuresSearch"
          size="small"
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                  />
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

        {/* Sort */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="features-sort-label" sx={{ fontSize: "0.625rem" }}>
            Sort by
          </InputLabel>
          <Select
            id="select-features-sort-select"
            name="featuresSort"
            labelId="features-sort-label"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            label="Sort by"
            sx={{
              borderRadius: 1.5,
              fontSize: "0.6875rem",
              "& .MuiSelect-select": {
                py: 0.75,
                fontSize: "0.6875rem",
              },
            }}
          >
            <MenuItem
              value="name"
              sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
            >
              Name
            </MenuItem>
            <MenuItem
              value="status"
              sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
            >
              Status
            </MenuItem>
            <MenuItem
              value="date"
              sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}
            >
              Date
            </MenuItem>
          </Select>
        </FormControl>

        {/* Select All */}
        {selectableFeaturesCount > 0 && (
          <Button
            size="small"
            onClick={onSelectAll}
            startIcon={
              isAllSelected ? (
                <CheckBox sx={{ fontSize: 16 }} />
              ) : (
                <CheckBoxOutlineBlank sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              ml: "auto",
              fontSize: "0.6875rem",
              px: 1.25,
              py: 0.5,
            }}
          >
            {isAllSelected ? "Deselect all" : "Select all"}
          </Button>
        )}
      </Box>

      {/* Status Filter Chips */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          flexWrap: "wrap",
        }}
      >
        <FilterIcon
          fontSize="small"
          sx={{ fontSize: 14, color: theme.palette.text.secondary }}
        />
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.625rem",
            fontWeight: 500,
          }}
        >
          Filter by status:
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          <Chip
            label={`All (${statusCounts.all})`}
            size="small"
            onClick={() => onStatusFilterChange("all")}
            color={statusFilter === "all" ? "primary" : "default"}
            variant={statusFilter === "all" ? "filled" : "outlined"}
            sx={{
              fontWeight: statusFilter === "all" ? 600 : 400,
              cursor: "pointer",
              height: 20,
              fontSize: "0.625rem",
              "& .MuiChip-label": {
                px: 0.75,
              },
            }}
          />
          {(Object.keys(STATUS_LABELS) as FeatureStatus[]).map((status) => (
            <Chip
              key={status}
              label={`${STATUS_LABELS[status]} (${statusCounts[status]})`}
              size="small"
              onClick={() => onStatusFilterChange(status)}
              color={
                statusFilter === status ? STATUS_COLORS[status] : "default"
              }
              variant={statusFilter === status ? "filled" : "outlined"}
              sx={{
                fontWeight: statusFilter === status ? 600 : 400,
                cursor: "pointer",
                opacity: statusCounts[status] === 0 ? 0.5 : 1,
                height: 20,
                fontSize: "0.625rem",
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

