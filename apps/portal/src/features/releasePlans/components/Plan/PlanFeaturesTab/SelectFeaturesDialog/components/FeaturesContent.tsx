import { Box } from "@mui/material";
import { FeaturesLoadingState } from "./FeaturesLoadingState";
import { NoProductState } from "./NoProductState";
import { FeaturesEmptyState } from "./FeaturesEmptyState";
import { FeaturesTable } from "./FeaturesTable";
import type { Feature } from "../../../../../../api/services/features.service";
import type { PlanStatus } from "../../../../types";
import type { FeatureStatus } from "../../../../../../feature/types";

export type FeaturesContentProps = {
  readonly productId?: string;
  readonly isLoadingProducts: boolean;
  readonly isLoadingFeatures: boolean;
  readonly processedFeatures: Feature[];
  readonly selectedIds: string[];
  readonly featureToActivePlansMap: Map<
    string,
    Array<{ id: string; name: string; status: PlanStatus }>
  >;
  readonly isAllSelected: boolean;
  readonly isSomeSelected: boolean;
  readonly searchQuery: string;
  readonly statusFilter: FeatureStatus | "all";
  readonly onToggleFeature: (featureId: string) => void;
  readonly onSelectAll: () => void;
};

export function FeaturesContent({
  productId,
  isLoadingProducts,
  isLoadingFeatures,
  processedFeatures,
  selectedIds,
  featureToActivePlansMap,
  isAllSelected,
  isSomeSelected,
  searchQuery,
  statusFilter,
  onToggleFeature,
  onSelectAll,
}: FeaturesContentProps) {
  if (isLoadingProducts || isLoadingFeatures) {
    return <FeaturesLoadingState />;
  }

  if (!productId) {
    return <NoProductState />;
  }

  if (processedFeatures.length === 0) {
    return (
      <FeaturesEmptyState searchQuery={searchQuery} statusFilter={statusFilter} />
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
      <FeaturesTable
        features={processedFeatures}
        selectedIds={selectedIds}
        featureToActivePlansMap={featureToActivePlansMap}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onToggleFeature={onToggleFeature}
        onSelectAll={onSelectAll}
      />
    </Box>
  );
}

