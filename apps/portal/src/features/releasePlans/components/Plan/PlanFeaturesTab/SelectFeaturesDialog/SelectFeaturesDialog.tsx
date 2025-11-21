import { useState, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, useTheme, alpha } from "@mui/material";
import { useSelectFeaturesData, useSelectFeaturesFilters } from "./hooks";
import {
  DialogHeader,
  ProductDisplay,
  InfoAlert,
  FeaturesToolbar,
  FeaturesContent,
  DialogActions as CustomDialogActions,
} from "./components";

export type SelectFeaturesDialogProps = {
  readonly open: boolean;
  readonly productId?: string;
  readonly selectedFeatureIds: string[];
  readonly currentPlanId?: string; // ID of the plan being edited (to exclude it from checks)
  readonly onClose: () => void;
  readonly onAddFeatures: (featureIds: string[]) => void;
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Data hooks
  const {
    selectedProduct,
    allAvailableFeatures,
    featureToActivePlansMap,
    isLoadingProducts,
    isLoadingFeatures,
  } = useSelectFeaturesData(productId, selectedFeatureIds, currentPlanId);

  // Filter hooks
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    processedFeatures,
    selectableFeatures,
    statusCounts,
  } = useSelectFeaturesFilters(allAvailableFeatures, featureToActivePlansMap);

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
      slotProps={{
        paper: {
          sx: {
            height: "85vh",
            maxHeight: 900,
            borderRadius: 2,
          },
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
        <DialogHeader selectedCount={selectedIds.length} />
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* Product Display */}
        {productId && (
          <ProductDisplay productName={selectedProduct?.name} />
        )}

        {/* Info Alert */}
        <InfoAlert hasProduct={!!productId} />

        {/* Toolbar */}
        <FeaturesToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusCounts={statusCounts}
          selectableFeaturesCount={selectableFeatures.length}
          isAllSelected={isAllSelected}
          isSomeSelected={isSomeSelected}
          onSelectAll={handleSelectAll}
        />

        {/* Features Content */}
        <FeaturesContent
          productId={productId}
          isLoadingProducts={isLoadingProducts}
          isLoadingFeatures={isLoadingFeatures}
          processedFeatures={processedFeatures}
          selectedIds={selectedIds}
          featureToActivePlansMap={featureToActivePlansMap}
          isAllSelected={isAllSelected}
          isSomeSelected={isSomeSelected}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onToggleFeature={handleToggleFeature}
          onSelectAll={handleSelectAll}
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: 1.5,
          px: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          gap: 1,
        }}
      >
        <CustomDialogActions
          selectedCount={selectedIds.length}
          onClose={handleClose}
          onAdd={handleAdd}
        />
      </DialogActions>
    </Dialog>
  );
}

