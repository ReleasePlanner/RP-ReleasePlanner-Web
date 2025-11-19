/**
 * Feature Maintenance Page
 *
 * Minimalist and elegant Material UI page for managing features across products
 */

import { useState, useMemo } from "react";
import { Box, Button, CircularProgress, Alert, useTheme, alpha, Typography, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
import type { Feature, ProductWithFeatures } from "@/features/feature/types";
import {
  ProductSelector,
  ProductFeaturesList,
  FeatureEditDialog,
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
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingState, setEditingState] = useState<EditingState | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter and sort features
  const filteredAndSortedFeatures = useMemo(() => {
    if (!selectedProduct) return [];
    
    let result = [...selectedProduct.features];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "status") {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [selectedProduct, searchQuery, sortBy]);

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
    if (!confirm("Are you sure you want to delete this feature?")) return;
    
    setIsDeleting(featureId);
    try {
      await deleteMutation.mutateAsync(featureId);
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert("Error deleting feature. Please try again.");
    } finally {
      setIsDeleting(null);
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
      alert('Feature name is required');
      return;
    }

    if (!description) {
      alert('Feature description is required');
      return;
    }

    if (!technicalDescription) {
      alert('Technical description is required');
      return;
    }

    if (!businessDescription) {
      alert('Business description is required');
      return;
    }

    // Ensure createdBy has a name (from IT Owner)
    if (!feature.createdBy?.name) {
      alert('IT Owner is required');
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
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({
          id: feature.id,
          data: payload,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving feature:', error);
      alert("Error saving feature. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingState(null);
  };

  const isLoading = productsLoading || featuresLoading;
  const error = productsError || featuresError;

  const sortOptions = [
    { value: "name", label: "Sort: Name" },
    { value: "status", label: "Sort: Status" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Feature Maintenance" description="Manage product features">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout title="Feature Maintenance" description="Manage product features">
        <Box p={3}>
          <Alert severity="error">
            Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Feature Maintenance"
      description="Manage product features with complete CRUD operations"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search features..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddFeature}
          disabled={!selectedProductId}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 2,
            py: 0.75,
            borderRadius: 2,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.32)}`,
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
          {filteredAndSortedFeatures.length === 0 ? (
            <Box
              component={Paper}
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  mb: 0.5,
                }}
              >
                {selectedProduct?.features.length === 0
                  ? "No features configured"
                  : "No features found"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.disabled,
                }}
              >
                {selectedProduct?.features.length === 0
                  ? "Start by adding your first feature"
                  : searchQuery
                  ? "Try adjusting your search criteria."
                  : "No features match your filters."}
              </Typography>
            </Box>
          ) : (
            <ProductFeaturesList
              product={selectedProduct}
              features={filteredAndSortedFeatures}
              onEditFeature={handleEditFeature}
              onDeleteFeature={handleDeleteFeature}
              isDeleting={isDeleting}
            />
          )}
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
