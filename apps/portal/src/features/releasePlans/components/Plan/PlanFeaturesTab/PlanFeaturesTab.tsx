import { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { Feature } from "@/features/feature/types";
import { FeaturesTable } from "@/features/feature/components/FeaturesTable";
import { FeatureEditDialog } from "@/features/feature/components/FeatureEditDialog";
import { SelectFeaturesDialog } from "./SelectFeaturesDialog.tsx";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateFeature } from "@/state/featuresSlice";

export type PlanFeaturesTabProps = {
  productId?: string;
  featureIds?: string[];
  onFeatureIdsChange?: (featureIds: string[]) => void;
};

export function PlanFeaturesTab({
  productId,
  featureIds = [],
  onFeatureIdsChange,
}: PlanFeaturesTabProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get features from Redux store
  const productFeatures = useAppSelector(
    (state) =>
      state.features.productFeatures.find((p) => p.id === productId)
        ?.features || []
  );

  // Get product name
  const products = useAppSelector((state) => state.products.products);
  const product = products.find((p) => p.id === productId);
  const productName = product?.name || "";

  // Get features that are in the plan (filtered by featureIds)
  const planFeatures = useMemo(() => {
    if (!productId || featureIds.length === 0) return [];
    return productFeatures.filter((f) => featureIds.includes(f.id));
  }, [productFeatures, featureIds, productId]);

  const handleAddFeatures = (newFeatureIds: string[]) => {
    if (onFeatureIdsChange) {
      // Filter out duplicates - only add features that aren't already in the plan
      const uniqueNewIds = newFeatureIds.filter(
        (id) => !featureIds.includes(id)
      );
      if (uniqueNewIds.length > 0) {
        onFeatureIdsChange([...featureIds, ...uniqueNewIds]);
      }
    }
    setSelectDialogOpen(false);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleDeleteFeature = (featureId: string) => {
    if (!productId) return;
    // Remove from plan's featureIds
    if (onFeatureIdsChange) {
      onFeatureIdsChange(featureIds.filter((id) => id !== featureId));
    }
    // Optionally delete from Redux store if needed
    // dispatch(deleteFeature({ productId, featureId }));
  };

  const handleSaveFeature = () => {
    if (!editingFeature) return;
    dispatch(updateFeature(editingFeature));
    setEditDialogOpen(false);
    setEditingFeature(null);
    setIsCreating(false);
  };

  const handleFeatureChange = (feature: Feature) => {
    setEditingFeature(feature);
  };

  if (!productId) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          Please select a product in the Common Data tab to manage features.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Features for {productName} ({planFeatures.length})
          </Typography>
          <Tooltip title="Add features from product" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setSelectDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontSize: "0.8125rem",
                fontWeight: 500,
                px: 1.75,
                py: 0.625,
                borderRadius: 1,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Add Features
            </Button>
          </Tooltip>
        </Box>

        {/* Features Table */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {planFeatures.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                No features added to this plan yet. Click "Add Features" to
                select features from the product.
              </Typography>
            </Box>
          ) : (
            <FeaturesTable
              features={planFeatures}
              onEditFeature={handleEditFeature}
              onDeleteFeature={handleDeleteFeature}
            />
          )}
        </Box>
      </Stack>

      {/* Select Features Dialog */}
      <SelectFeaturesDialog
        open={selectDialogOpen}
        productId={productId}
        selectedFeatureIds={featureIds}
        onClose={() => setSelectDialogOpen(false)}
        onAddFeatures={handleAddFeatures}
      />

      {/* Edit Dialog */}
      <FeatureEditDialog
        open={editDialogOpen}
        editing={!isCreating}
        feature={editingFeature}
        selectedProductName={productName}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingFeature(null);
          setIsCreating(false);
        }}
        onSave={handleSaveFeature}
        onFeatureChange={handleFeatureChange}
      />
    </Box>
  );
}
