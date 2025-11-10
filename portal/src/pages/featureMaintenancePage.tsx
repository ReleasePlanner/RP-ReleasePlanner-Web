/**
 * Feature Maintenance Page - Refactored
 *
 * Simplified page using extracted components and custom hooks
 * Better separation of concerns and reusability
 */

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import {
  ProductSelector,
  ProductFeaturesList,
  FeatureEditDialog,
  type ViewMode,
  type SortBy,
  FEATURE_CATEGORIES,
  PRODUCT_OWNERS,
  useFeatures,
  generateFeatureId,
} from "@/features/feature";

/**
 * Mock data for products with features
 */
const MOCK_PRODUCTS: ProductWithFeatures[] = [
  {
    id: "prod-1",
    name: "Release Planner",
    features: [
      {
        id: "feat-1",
        name: "User Authentication",
        description: "Implement OAuth 2.0 authentication",
        category: FEATURE_CATEGORIES[0],
        status: "completed",
        createdBy: PRODUCT_OWNERS[0],
        technicalDescription: "Implement OAuth 2.0 with JWT tokens",
        businessDescription: "Allow users to securely log in",
        productId: "prod-1",
      },
      {
        id: "feat-2",
        name: "Performance Optimization",
        description: "Optimize database queries",
        category: FEATURE_CATEGORIES[1],
        status: "in-progress",
        createdBy: PRODUCT_OWNERS[1],
        technicalDescription: "Add database indexing and caching",
        businessDescription: "Improve app response time",
        productId: "prod-1",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Analytics Platform",
    features: [
      {
        id: "feat-3",
        name: "Real-time Dashboard",
        description: "Display live analytics data",
        category: FEATURE_CATEGORIES[3],
        status: "planned",
        createdBy: PRODUCT_OWNERS[2],
        technicalDescription: "WebSocket integration for real-time updates",
        businessDescription: "Monitor metrics in real-time",
        productId: "prod-2",
      },
    ],
  },
];

interface EditingState {
  productId: string;
  feature?: Feature;
}

/**
 * FeatureMaintenancePage Component
 *
 * Main page for managing features across products.
 * Uses custom hooks and extracted components for clean architecture.
 *
 * Features:
 * - Product selection
 * - Feature filtering and sorting
 * - Create, edit, delete operations
 * - View mode toggle (grid/list)
 *
 * @example
 * ```tsx
 * <FeatureMaintenancePage />
 * ```
 */
export function FeatureMaintenancePage() {
  // State management
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    addFeatureToProduct,
    updateFeatureInProduct,
    deleteFeatureFromProduct,
  } = useFeatures(MOCK_PRODUCTS);

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
    deleteFeatureFromProduct(selectedProductId, featureId);
  };

  const handleSaveFeature = () => {
    if (!editingState || !editingState.feature) return;

    const feature = editingState.feature;
    const isNew = !selectedProduct?.features.some((f) => f.id === feature.id);

    if (isNew) {
      addFeatureToProduct(editingState.productId, feature);
    } else {
      updateFeatureInProduct(editingState.productId, feature.id, feature);
    }

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        py: 0,
        px: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Features Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage product features with full CRUD operations and filtering
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "280px 1fr" }, gap: 3, flex: 1 }}>
        {/* Sidebar: Product Selector */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <ProductSelector
            products={products}
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
          />
        </Box>

        {/* Main: Features List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Mobile Product Selector */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <ProductSelector
              products={products}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
            />
          </Box>

          {/* Toolbar with Add Button */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddFeature}
              disabled={!selectedProductId}
            >
              Add Feature
            </Button>
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
    </Box>
  );
}
