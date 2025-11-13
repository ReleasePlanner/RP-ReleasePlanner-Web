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
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import { useAppSelector } from "@/store/hooks";
import { STATUS_LABELS } from "@/features/feature/constants";
import type { SortBy } from "@/features/feature/components/FeatureToolbar";
import { processFeatures } from "@/features/feature/utils/featureUtils";

export type SelectFeaturesDialogProps = {
  open: boolean;
  productId?: string;
  selectedFeatureIds: string[];
  onClose: () => void;
  onAddFeatures: (featureIds: string[]) => void;
};

export function SelectFeaturesDialog({
  open,
  productId,
  selectedFeatureIds,
  onClose,
  onAddFeatures,
}: SelectFeaturesDialogProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Get all features for the product from Redux store
  const allProductFeatures = useAppSelector((state) => {
    if (!productId) return [];
    return (
      state.features.productFeatures.find((p) => p.id === productId)
        ?.features || []
    );
  });

  // Filter out features already in the plan
  const availableFeatures = useMemo(() => {
    return allProductFeatures.filter((f) => !selectedFeatureIds.includes(f.id));
  }, [allProductFeatures, selectedFeatureIds]);

  // Process features: filter and sort
  const processedFeatures = useMemo(() => {
    return processFeatures(availableFeatures, searchQuery, sortBy);
  }, [availableFeatures, searchQuery, sortBy]);

  const handleToggleFeature = (featureId: string) => {
    setSelectedIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === processedFeatures.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedFeatures.map((f) => f.id));
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
    onClose();
  };

  const isAllSelected =
    processedFeatures.length > 0 &&
    selectedIds.length === processedFeatures.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < processedFeatures.length;

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
            Select Features to Add
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
            placeholder="Search features..."
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

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              displayEmpty
            >
              <MenuItem value="name">Sort: Name</MenuItem>
              <MenuItem value="status">Sort: Status</MenuItem>
              <MenuItem value="date">Sort: Date</MenuItem>
            </Select>
          </FormControl>

          {/* Select All */}
          {processedFeatures.length > 0 && (
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

        {/* Features Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {processedFeatures.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                {searchQuery
                  ? "No features match your search."
                  : "No available features to add."}
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
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedFeatures.map((feature) => {
                    const isSelected = selectedIds.includes(feature.id);
                    return (
                      <TableRow
                        key={feature.id}
                        hover
                        onClick={() => handleToggleFeature(feature.id)}
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
                            onChange={() => handleToggleFeature(feature.id)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={feature.name} arrow>
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
                              {feature.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {feature.category.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {STATUS_LABELS[feature.status]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={feature.description} arrow>
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
