/**
 * Feature Maintenance Page
 *
 * Elegant, Material UI compliant page for managing features across products
 */

import { useState, useMemo } from "react";
import { Box, Button, CircularProgress, Alert, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout } from "@/components";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import {
  ProductSelector,
  ProductFeaturesList,
  FeatureEditDialog,
  type ViewMode,
  type SortBy,
  generateFeatureId,
} from "@/features/feature";
import {
  useProducts,
  useFeatures,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
} from "../api/hooks";
import { useITOwners } from "../api/hooks/useITOwners";
import { useFeatureCategories } from "../api/hooks/useFeatureCategories";
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
  const theme = useTheme();
  
  // API hooks
  const { data: apiProducts = [], isLoading: productsLoading, error: productsError } = useProducts();
  const { data: allFeatures = [], isLoading: featuresLoading, error: featuresError } = useFeatures();
  const { data: itOwners = [] } = useITOwners();
  const { data: featureCategories = [] } = useFeatureCategories();
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  // Convert API features to local Feature format
  const convertAPIFeatureToLocal = (apiFeature: APIFeature): Feature => {
    return {
      id: apiFeature.id,
      name: apiFeature.name,
      description: apiFeature.description,
      category: typeof apiFeature.category === 'string' 
        ? { id: '', name: apiFeature.category }
        : { id: apiFeature.category.id, name: apiFeature.category.name },
      status: apiFeature.status === 'in-progress' ? 'in-progress' : apiFeature.status as any,
      createdBy: typeof apiFeature.createdBy === 'string'
        ? { id: '', name: apiFeature.createdBy }
        : { id: apiFeature.createdBy.id, name: apiFeature.createdBy.name },
      technicalDescription: apiFeature.technicalDescription,
      businessDescription: apiFeature.businessDescription,
      productId: apiFeature.productId,
      country: apiFeature.country ? {
        id: apiFeature.country.id,
        name: apiFeature.country.name,
        code: apiFeature.country.code,
      } : undefined,
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

    // Use first IT Owner if available, otherwise create a placeholder
    const defaultOwner = itOwners.length > 0 
      ? { id: itOwners[0].id, name: itOwners[0].name }
      : { id: "", name: "" };

    // Use first Feature Category if available, otherwise create a placeholder
    const defaultCategory = featureCategories.length > 0
      ? { id: featureCategories[0].id, name: featureCategories[0].name }
      : { id: "", name: "" };

    setEditingState({
      productId: selectedProductId,
      feature: {
        id: generateFeatureId(),
        name: "",
        description: "",
        category: defaultCategory,
        status: "planned",
        createdBy: defaultOwner,
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

  const handleSaveFeature = async (feature: Feature) => {
    if (!editingState) return;

    const isNew = !selectedProduct?.features.some((f) => f.id === feature.id);

    // Validate required fields
    const name = feature.name?.trim();
    const description = feature.description?.trim();
    const technicalDescription = feature.technicalDescription?.trim();
    const businessDescription = feature.businessDescription?.trim();

    if (!name) {
      console.error('Feature name is required');
      return;
    }

    if (!description) {
      console.error('Feature description is required');
      return;
    }

    if (!technicalDescription) {
      console.error('Technical description is required');
      return;
    }

    if (!businessDescription) {
      console.error('Business description is required');
      return;
    }

    // Ensure createdBy has a name (from IT Owner)
    if (!feature.createdBy?.name) {
      console.error('IT Owner is required');
      return;
    }

    try {
      // Prepare payload - prioritize categoryId if available
      const payload: any = {
        name,
        description,
        status: feature.status as any,
        createdBy: { name: feature.createdBy.name },
        technicalDescription,
        businessDescription,
      };

      // Handle category - prefer categoryId, fallback to category.name
      if (feature.category?.id && !feature.category.id.startsWith('cat-')) {
        // Valid UUID category ID
        payload.categoryId = feature.category.id;
      } else if (feature.category?.name) {
        // Fallback to category name
        payload.category = { name: feature.category.name };
      } else if (typeof feature.category === 'string') {
        // Legacy string category
        payload.category = { name: feature.category };
      }

      // Handle country - prefer countryId
      if (feature.country?.id && !feature.country.id.startsWith('country-')) {
        // Valid UUID country ID
        payload.countryId = feature.country.id;
      }

      if (isNew) {
        payload.productId = editingState.productId;
        console.log('Creating feature with payload:', payload);
        await createMutation.mutateAsync(payload);
      } else {
        console.log('Updating feature with payload:', payload);
        await updateMutation.mutateAsync({
          id: feature.id,
          data: payload,
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
          startIcon={<AddIcon />}
          onClick={handleAddFeature}
          disabled={!selectedProductId}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&:hover": {
              boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            "&:disabled": {
              boxShadow: "none",
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
