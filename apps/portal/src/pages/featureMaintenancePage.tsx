/**
 * Feature Maintenance Page
 *
 * Elegant, Material UI compliant page for managing features across products
 */

import { useState, useMemo } from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
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
import {
  useProducts,
  useFeatures,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
} from "../api/hooks";
import type { Feature as APIFeature } from "../api/services/features.service";

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
  // API hooks
  const { data: apiProducts = [], isLoading: productsLoading, error: productsError } = useProducts();
  const { data: allFeatures = [], isLoading: featuresLoading, error: featuresError } = useFeatures();
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  // Convert API features to local Feature format
  const convertAPIFeatureToLocal = (apiFeature: APIFeature): Feature => {
    return {
      id: apiFeature.id,
      name: apiFeature.name,
      description: apiFeature.description,
      category: apiFeature.category.name,
      status: apiFeature.status === 'in-progress' ? 'in-progress' : apiFeature.status as any,
      createdBy: apiFeature.createdBy.name,
      technicalDescription: apiFeature.technicalDescription,
      businessDescription: apiFeature.businessDescription,
      productId: apiFeature.productId,
    };
  };

  // Combine products with their features from API
  const productsWithFeatures: ProductWithFeatures[] = useMemo(() => {
    return apiProducts.map((product) => {
      const productFeatures = allFeatures.filter((f) => f.productId === product.id);
      return {
        id: product.id,
        name: product.name,
        features: productFeatures.map(convertAPIFeatureToLocal),
      };
    });
  }, [apiProducts, allFeatures]);

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

  const handleDeleteFeature = async (featureId: string) => {
    if (!selectedProductId) return;
    try {
      await deleteMutation.mutateAsync(featureId);
    } catch (error) {
      console.error('Error deleting feature:', error);
    }
  };

  const handleSaveFeature = async () => {
    if (!editingState || !editingState.feature) return;

    const feature = editingState.feature;
    const isNew = !selectedProduct?.features.some((f) => f.id === feature.id);

    try {
      if (isNew) {
        await createMutation.mutateAsync({
          name: feature.name,
          description: feature.description,
          category: { name: feature.category },
          status: feature.status as any,
          createdBy: { name: feature.createdBy },
          technicalDescription: feature.technicalDescription,
          businessDescription: feature.businessDescription,
          productId: editingState.productId,
        });
      } else {
        await updateMutation.mutateAsync({
          id: feature.id,
          data: {
            name: feature.name,
            description: feature.description,
            category: { name: feature.category },
            status: feature.status as any,
            createdBy: { name: feature.createdBy },
            technicalDescription: feature.technicalDescription,
            businessDescription: feature.businessDescription,
          },
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  const isLoading = productsLoading || featuresLoading;
  const error = productsError || featuresError;

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Features Management" description="Manage product features with full CRUD operations and filtering">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Features Management" description="Manage product features with full CRUD operations and filtering">
        <Box p={3}>
          <Alert severity="error">
            Error al cargar los datos: {error instanceof Error ? error.message : 'Error desconocido'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

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
export default FeatureMaintenancePage;
