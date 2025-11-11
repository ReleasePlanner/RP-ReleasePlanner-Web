/**
 * Feature Maintenance Page
 *
 * Elegant, Material UI compliant page for managing features across products
 */

import { useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout } from "@/components";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import {
  ProductSelector,
  ProductFeaturesList,
  FeatureEditDialog,
  type ViewMode,
  type SortBy,
  FEATURE_CATEGORIES,
  PRODUCT_OWNERS,
  generateFeatureId,
} from "@/features/feature";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addFeature,
  updateFeature,
  deleteFeature,
} from "@/state/featuresSlice";

interface EditingState {
  productId: string;
  feature?: Feature;
}

/**
 * FeatureMaintenancePage Component
 *
 * Main page for managing features across products.
 * Features are stored in Redux store and loaded from there.
 */
export function FeatureMaintenancePage() {
  const dispatch = useAppDispatch();

  // Load products from Redux store
  const products = useAppSelector((state) => state.products.products);

  // Load features from Redux store
  const productFeatures = useAppSelector(
    (state) => state.features.productFeatures
  );

  // Combine products with their features from Redux
  const productsWithFeatures: ProductWithFeatures[] = useMemo(() => {
    return products.map((product) => {
      const featuresData = productFeatures.find((pf) => pf.id === product.id);
      return {
        id: product.id,
        name: product.name,
        features: featuresData?.features || [],
      };
    });
  }, [products, productFeatures]);

  const [selectedProductId, setSelectedProductId] = useState<string>(
    productsWithFeatures[0]?.id || ""
  );
  const selectedProduct = productsWithFeatures.find(
    (p) => p.id === selectedProductId
  );

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Handlers
  const handleAddFeature = () => {
    if (!selectedProductId) return;

    setEditingState({
      productId: selectedProductId,
      feature: {
        id: generateFeatureId(),
        name: "",
        description: "",
        category: FEATURE_CATEGORIES[0],
        status: "planned",
        createdBy: PRODUCT_OWNERS[0],
        technicalDescription: "",
        businessDescription: "",
        productId: selectedProductId,
      },
    });
    setOpenDialog(true);
  };

  const handleEditFeature = (feature: Feature) => {
    if (!selectedProductId) return;

    setEditingState({
      productId: selectedProductId,
      feature,
    });
    setOpenDialog(true);
  };

  const handleDeleteFeature = (featureId: string) => {
    if (!selectedProductId) return;
    dispatch(deleteFeature({ productId: selectedProductId, featureId }));
  };

  const handleSaveFeature = () => {
    if (!editingState || !editingState.feature) return;

    const feature = editingState.feature;
    const isNew = !selectedProduct?.features.some((f) => f.id === feature.id);

    if (isNew) {
      dispatch(addFeature({ productId: editingState.productId, feature }));
    } else {
      dispatch(updateFeature(feature));
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  return (
    <PageLayout
      title="Features Management"
      description="Manage product features with full CRUD operations and filtering"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          onClick={handleAddFeature}
          disabled={!selectedProductId}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Add Feature
        </Button>
      }
    >
      {/* Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          gap: 3,
          height: "100%",
        }}
      >
        {/* Sidebar: Product Selector */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <ProductSelector
            products={productsWithFeatures}
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
          />
        </Box>

        {/* Main: Features List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Mobile Product Selector */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <ProductSelector
              products={productsWithFeatures}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
            />
          </Box>

          {/* Features List */}
          <ProductFeaturesList
            product={selectedProduct}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEditFeature={handleEditFeature}
            onDeleteFeature={handleDeleteFeature}
          />
        </Box>
      </Box>

      {/* Edit Dialog */}
      <FeatureEditDialog
        open={openDialog}
        editing={editingState?.feature !== undefined}
        feature={editingState?.feature || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSaveFeature}
        onFeatureChange={(feature: Feature) => {
          if (editingState) {
            setEditingState({
              ...editingState,
              feature,
            });
          }
        }}
      />
    </PageLayout>
  );
}
