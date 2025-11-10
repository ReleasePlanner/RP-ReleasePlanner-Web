import { useMemo } from "react";
import { Box } from "@mui/material";
import type { Feature, ProductWithFeatures } from "../types";
import { FeatureToolbar, type ViewMode, type SortBy } from "./FeatureToolbar";
import { FeaturesTable } from "./FeaturesTable";
import { processFeatures } from "../utils/featureUtils";

/**
 * Props for ProductFeaturesList component
 */
interface ProductFeaturesListProps {
  product: ProductWithFeatures | undefined;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (featureId: string) => void;
}

/**
 * ProductFeaturesList Component
 *
 * Displays filtered and sorted features for a selected product.
 * Includes toolbar for view, sort, and search controls.
 *
 * @example
 * ```tsx
 * <ProductFeaturesList
 *   product={selectedProduct}
 *   viewMode="grid"
 *   onViewModeChange={setViewMode}
 *   sortBy="name"
 *   onSortChange={setSortBy}
 *   searchQuery=""
 *   onSearchChange={setSearchQuery}
 *   onEditFeature={handleEdit}
 *   onDeleteFeature={handleDelete}
 * />
 * ```
 */
export function ProductFeaturesList({
  product,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onEditFeature,
  onDeleteFeature,
}: ProductFeaturesListProps) {
  // Process features: filter and sort
  const processedFeatures = useMemo(() => {
    if (!product) return [];
    return processFeatures(product.features, searchQuery, sortBy);
  }, [product, searchQuery, sortBy]);

  if (!product) {
    return <Box sx={{ p: 3, textAlign: "center" }}>Select a product to view features</Box>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Toolbar */}
      <FeatureToolbar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* Features Table/List */}
      <Box
        sx={{
          display: viewMode === "list" ? "block" : "grid",
          gridTemplateColumns: "1fr",
          gap: 2,
        }}
      >
        <FeaturesTable
          features={processedFeatures}
          onEditFeature={onEditFeature}
          onDeleteFeature={onDeleteFeature}
        />
      </Box>
    </Box>
  );
}
