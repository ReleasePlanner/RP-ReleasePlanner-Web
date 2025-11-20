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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { STATUS_LABELS, STATUS_COLORS } from "@/features/feature/constants";
import type { SortBy } from "@/features/feature/components/FeatureToolbar";
import { processFeatures } from "@/features/feature/utils/featureUtils";
import type { FeatureStatus } from "@/features/feature/types";
import { usePlans, useFeatures, useProducts } from "@/api/hooks";
import { convertAPIPlanToLocal } from "@/features/releasePlans/lib/planConverters";
import type { PlanStatus } from "@/features/releasePlans/types";
import type { Feature } from "@/api/services/features.service";

export type SelectFeaturesDialogProps = {
  open: boolean;
  productId?: string;
  selectedFeatureIds: string[];
  currentPlanId?: string; // ID of the plan being edited (to exclude it from checks)
  onClose: () => void;
  onAddFeatures: (featureIds: string[]) => void;
};

export function SelectFeaturesDialog({
  open,
  productId,
  selectedFeatureIds,
  currentPlanId,
  onClose,
  onAddFeatures,
}: SelectFeaturesDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | "all">("all");

  // Get all plans to check feature availability
  const { data: apiPlans = [] } = usePlans();
  const allPlans = useMemo(() => {
    return apiPlans.map(convertAPIPlanToLocal);
  }, [apiPlans]);

  // Get products from API (Products maintenance) - same as SelectComponentsDialog
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  
  // Get product from API
  const selectedProduct = useMemo(() => {
    if (!productId) return null;
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  // Get all features for the product from API (Features maintenance)
  const { data: allProductFeatures = [], isLoading: isLoadingFeatures } = useFeatures(productId);

  // Create a map of featureId -> array of plans (excluding current plan) that contain this feature
  // Only include plans that are NOT in "done" status
  const featureToActivePlansMap = useMemo(() => {
    const map = new Map<string, Array<{ id: string; name: string; status: PlanStatus }>>();
    
    allPlans.forEach((plan) => {
      // Skip the current plan being edited
      if (plan.id === currentPlanId) return;
      
      // Only check plans that are NOT in "done" status
      if (plan.metadata.status === "done") return;
      
      const featureIds = plan.metadata.featureIds || [];
      featureIds.forEach((featureId) => {
        if (!map.has(featureId)) {
          map.set(featureId, []);
        }
        map.get(featureId)!.push({
          id: plan.id,
          name: plan.metadata.name,
          status: plan.metadata.status,
        });
      });
    });
    
    return map;
  }, [allPlans, currentPlanId]);

  // Get all features (excluding those already in the plan AND those in active plans)
  const allAvailableFeatures = useMemo(() => {
    return allProductFeatures.filter((f) => {
      // Exclude features already in the current plan
      if (selectedFeatureIds.includes(f.id)) return false;
      
      // Exclude features that are in active plans (not "done")
      const activePlans = featureToActivePlansMap.get(f.id);
      if (activePlans && activePlans.length > 0) return false;
      
      return true;
    });
  }, [allProductFeatures, selectedFeatureIds, featureToActivePlansMap]);

  // Filter by status - show all features when filtering, but only completed can be selected
  const filteredFeatures = useMemo(() => {
    if (statusFilter === "all") {
      // By default, show only completed features
      return allAvailableFeatures.filter((f) => f.status === "completed");
    }
    // When a specific status filter is selected, show those features (but they'll be disabled if not completed)
    return allAvailableFeatures.filter((f) => f.status === statusFilter);
  }, [allAvailableFeatures, statusFilter]);

  // Process features: filter and sort
  const processedFeatures = useMemo(() => {
    return processFeatures(filteredFeatures, searchQuery, sortBy);
  }, [filteredFeatures, searchQuery, sortBy]);

  // Only count completed features that are not in active plans for selection
  const selectableFeatures = useMemo(() => {
    return processedFeatures.filter((f) => {
      if (f.status !== "completed") return false;
      const activePlans = featureToActivePlansMap.get(f.id);
      return !activePlans || activePlans.length === 0;
    });
  }, [processedFeatures, featureToActivePlansMap]);

  // Count features by status for filter chips
  const statusCounts = useMemo(() => {
    const counts: Record<FeatureStatus | "all", number> = {
      all: selectableFeatures.length,
      planned: allAvailableFeatures.filter((f) => f.status === "planned").length,
      "in-progress": allAvailableFeatures.filter((f) => f.status === "in-progress").length,
      completed: selectableFeatures.length,
      "on-hold": allAvailableFeatures.filter((f) => f.status === "on-hold").length,
    };
    return counts;
  }, [selectableFeatures, allAvailableFeatures]);

  const handleToggleFeature = (featureId: string) => {
    const feature = processedFeatures.find((f) => f.id === featureId);
    // Only allow selecting completed features
    if (feature && feature.status !== "completed") {
      return;
    }
    // Check if feature is in an active plan
    const activePlans = featureToActivePlansMap.get(featureId);
    if (activePlans && activePlans.length > 0) {
      return; // Don't allow selecting features in active plans
    }
    setSelectedIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    // Only select completed features that are not in active plans
    if (selectedIds.length === selectableFeatures.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectableFeatures.map((f) => f.id));
    }
  };

  const handleAdd = () => {
    if (selectedIds.length > 0) {
      onAddFeatures(selectedIds);
      setSelectedIds([]);
      setSearchQuery("");
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setSearchQuery("");
    setStatusFilter("all");
    onClose();
  };

  const isAllSelected =
    selectableFeatures.length > 0 &&
    selectedIds.length === selectableFeatures.length &&
    selectableFeatures.every((f) => selectedIds.includes(f.id));
  const isSomeSelected =
    selectedIds.length > 0 && 
    selectedIds.length < selectableFeatures.length &&
    selectableFeatures.some((f) => selectedIds.includes(f.id));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "85vh",
          maxHeight: 900,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 1.5,
          pb: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: "0.8125rem",
              letterSpacing: "-0.01em",
            }}
          >
            Select Features
          </Typography>
          {selectedIds.length > 0 && (
            <Chip
              label={`${selectedIds.length} selected`}
              color="primary"
              size="small"
              sx={{ 
                fontWeight: 500,
                height: 18,
                fontSize: "0.625rem",
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* Product Display */}
        {productId && (
          <Box
            sx={{
              px: 2,
              pt: 1.5,
              pb: 1,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Product:
              </Typography>
              {selectedProduct?.name ? (
                <Chip
                  label={selectedProduct.name}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    backgroundColor: theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.6875rem",
                    fontStyle: "italic",
                  }}
                >
                  Product not found
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Info Alert */}
        <Alert 
          severity="info" 
          sx={{ 
            m: 1.5, 
            mb: 1,
            mt: selectedProduct ? 1 : 1.5,
            borderRadius: 1.5,
            "& .MuiAlert-message": {
              fontSize: "0.6875rem",
              lineHeight: 1.5,
            },
            "& .MuiAlert-icon": {
              fontSize: "1rem",
            },
          }}
        >
          Only features with <strong>Completed</strong> status can be added to the release plan.
          Features that are already in other active plans (not closed) are not available to add.
        </Alert>

        {/* Toolbar */}
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

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel 
                id="features-sort-label"
                sx={{ fontSize: "0.625rem" }}
              >
                Sort by
              </InputLabel>
              <Select
                id="select-features-sort-select"
                name="featuresSort"
                labelId="features-sort-label"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
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
                <MenuItem value="name" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                  Name
                </MenuItem>
                <MenuItem value="status" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                  Status
                </MenuItem>
                <MenuItem value="date" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                  Date
                </MenuItem>
              </Select>
            </FormControl>

            {/* Select All */}
            {selectableFeatures.length > 0 && (
              <Button
                size="small"
                onClick={handleSelectAll}
                startIcon={
                  isAllSelected ? <CheckBox sx={{ fontSize: 16 }} /> : <CheckBoxOutlineBlank sx={{ fontSize: 16 }} />
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
            <FilterIcon fontSize="small" sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
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
                onClick={() => setStatusFilter("all")}
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
                  onClick={() => setStatusFilter(status)}
                  color={statusFilter === status ? STATUS_COLORS[status] : "default"}
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

        {/* Features Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {isLoadingProducts || isLoadingFeatures ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <CircularProgress size={24} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: "0.6875rem",
                  mt: 1,
                }}
              >
                Loading features...
              </Typography>
            </Box>
          ) : !productId ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                Please select a product in the Common Data tab to view available features.
              </Typography>
            </Box>
          ) : processedFeatures.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                {searchQuery
                  ? "No features found matching the search."
                  : statusFilter === "all"
                  ? "No features available to add."
                  : `No features with status ${STATUS_LABELS[statusFilter as FeatureStatus]}.`}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      padding="checkbox" 
                      sx={{ 
                        width: 50,
                        backgroundColor: theme.palette.mode === "dark" 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : theme.palette.background.paper,
                      }}
                    >
                      <Checkbox
                        id="select-all-features-checkbox"
                        name="selectAllFeatures"
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        size="small"
                        disabled={selectableFeatures.length === 0}
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
                      Name
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
                      Category
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
                      Status
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedFeatures.map((feature) => {
                    const isSelected = selectedIds.includes(feature.id);
                    const isCompleted = feature.status === "completed";
                    const activePlans = featureToActivePlansMap.get(feature.id) || [];
                    const isInActivePlan = activePlans.length > 0;
                    const isDisabled = !isCompleted || isInActivePlan;
                    
                    // Create tooltip message for disabled features
                    let disabledReason = "";
                    if (!isCompleted) {
                      disabledReason = "Only features with Completed status can be added";
                    } else if (isInActivePlan) {
                      const planNames = activePlans.map((p) => p.name).join(", ");
                      disabledReason = `This feature is in the active plan: ${planNames}`;
                    }
                    
                    return (
                      <TableRow
                        key={feature.id}
                        hover={!isDisabled}
                        onClick={() => !isDisabled && handleToggleFeature(feature.id)}
                        sx={{
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          backgroundColor: isSelected
                            ? alpha(theme.palette.primary.main, 0.08)
                            : isDisabled
                            ? alpha(theme.palette.action.disabled, 0.03)
                            : "transparent",
                          opacity: isDisabled ? 0.5 : 1,
                          "&:hover": {
                            backgroundColor: !isDisabled
                              ? isSelected
                                ? alpha(theme.palette.primary.main, 0.12)
                                : alpha(theme.palette.action.hover, 0.04)
                              : "transparent",
                          },
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Tooltip title={disabledReason || ""} arrow disableHoverListener={!isDisabled}>
                            <span>
                              <Checkbox
                                id={`feature-checkbox-${feature.id}`}
                                name={`feature-${feature.id}`}
                                checked={isSelected}
                                onChange={() => handleToggleFeature(feature.id)}
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                                disabled={isDisabled}
                              />
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip 
                            title={
                              isDisabled && disabledReason 
                                ? `${feature.name} - ${disabledReason}`
                                : feature.name
                            } 
                            arrow
                          >
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
                              {feature.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: "0.6875rem" }}
                          >
                            {feature.category.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Chip
                            label={STATUS_LABELS[feature.status]}
                            size="small"
                            color={STATUS_COLORS[feature.status]}
                            variant="outlined"
                            sx={{
                              fontSize: "0.625rem",
                              height: 18,
                              "& .MuiChip-label": {
                                px: 0.75,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1 }}>
                          <Tooltip title={feature.description || "-"} arrow>
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
                              {feature.description || "-"}
                            </Typography>
                          </Tooltip>
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
          p: 1.5,
          px: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          gap: 1,
        }}
      >
        <Button 
          onClick={handleClose}
          size="small"
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            px: 2,
            fontSize: "0.6875rem",
            py: 0.625,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          size="small"
          disabled={selectedIds.length === 0}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            px: 2,
            fontSize: "0.6875rem",
            fontWeight: 500,
            py: 0.625,
          }}
        >
          Add {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
