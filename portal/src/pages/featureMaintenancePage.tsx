/**
 * Feature Maintenance Page
 *
 * Main page for managing features across products
 */

import { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type {
  Feature,
  ProductWithFeatures,
  FeatureStatus,
} from "@/features/feature/types";
import {
  FeatureCard,
  FeatureEditDialog,
  FeatureToolbar,
  type ViewMode,
  type SortBy,
  FEATURE_CATEGORIES,
  PRODUCT_OWNERS,
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

interface EditingFeature {
  product: ProductWithFeatures;
  feature?: Feature;
}

export function FeatureMaintenancePage() {
  const [products, setProducts] =
    useState<ProductWithFeatures[]>(MOCK_PRODUCTS);
  const [editingFeature, setEditingFeature] = useState<EditingFeature | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithFeatures | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query (search in product name and feature names)
    if (searchQuery.trim()) {
      result = result.map((p) => ({
        ...p,
        features: p.features.filter((f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }));
    }

    // Sort
    if (sortBy === "name") {
      result.forEach((p) => {
        p.features.sort((a, b) => a.name.localeCompare(b.name));
      });
    } else if (sortBy === "status") {
      const statusOrder: Record<FeatureStatus, number> = {
        completed: 0,
        "in-progress": 1,
        planned: 2,
        "on-hold": 3,
      };
      result.forEach((p) => {
        p.features.sort(
          (a, b) => statusOrder[a.status] - statusOrder[b.status]
        );
      });
    } else if (sortBy === "date") {
      result.forEach((p) => {
        p.features.sort((a, b) => b.id.localeCompare(a.id));
      });
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const handleAddFeature = () => {
    // For simplicity, just show first product dialog
    if (products.length === 0) return;
    const product = products[0];
    setSelectedProduct(product);
    setEditingFeature({
      product,
      feature: {
        id: `feat-${Date.now()}`,
        name: "",
        description: "",
        category: FEATURE_CATEGORIES[0],
        status: "planned",
        createdBy: PRODUCT_OWNERS[0],
        technicalDescription: "",
        businessDescription: "",
        productId: product.id,
      },
    });
    setOpenDialog(true);
  };

  const handleEditFeature = (
    product: ProductWithFeatures,
    feature: Feature
  ) => {
    setSelectedProduct(product);
    setEditingFeature({ product, feature });
    setOpenDialog(true);
  };

  const handleDeleteFeature = (productId: string, featureId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              features: p.features.filter((f) => f.id !== featureId),
            }
          : p
      )
    );
  };

  const handleAddFeatureToProduct = (product: ProductWithFeatures) => {
    setSelectedProduct(product);
    setEditingFeature({
      product,
      feature: {
        id: `feat-${Date.now()}`,
        name: "",
        description: "",
        category: FEATURE_CATEGORIES[0],
        status: "planned",
        createdBy: PRODUCT_OWNERS[0],
        technicalDescription: "",
        businessDescription: "",
        productId: product.id,
      },
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!editingFeature || !editingFeature.feature) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct?.id
          ? {
              ...p,
              features: p.features.some(
                (f) => f.id === editingFeature.feature?.id
              )
                ? p.features.map((f) =>
                    f.id === editingFeature.feature?.id
                      ? editingFeature.feature!
                      : f
                  )
                : [...p.features, editingFeature.feature],
            }
          : p
      )
    );

    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFeature(null);
    setSelectedProduct(null);
  };

  const isEditing = editingFeature?.feature !== undefined;

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
      <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Features
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage product features and their details
        </Typography>
      </Box>

      {/* Toolbar with controls */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FeatureToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFeature}
          sx={{ ml: "auto" }}
        >
          Add Feature
        </Button>
      </Box>

      {/* Products Grid/List */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid" ? { xs: "1fr", md: "1fr 1fr" } : "1fr",
          gap: 3,
        }}
      >
        {filteredAndSortedProducts.map((product) => (
          <FeatureCard
            key={product.id}
            product={product}
            onEditFeature={handleEditFeature}
            onDeleteFeature={handleDeleteFeature}
            onAddFeature={handleAddFeatureToProduct}
          />
        ))}
      </Box>

      {/* Edit Dialog */}
      <FeatureEditDialog
        open={openDialog}
        editing={isEditing}
        feature={editingFeature?.feature || null}
        selectedProductName={selectedProduct?.name || null}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onFeatureChange={(feature: Feature) => {
          if (editingFeature) {
            setEditingFeature({
              ...editingFeature,
              feature,
            });
          }
        }}
      />
    </Box>
  );
}
