import { useState } from "react";
import { Box, Stack } from "@mui/material";
import { SelectFeaturesDialog } from "./SelectFeaturesDialog";
import { usePlanFeatures, useFeatureOperations } from "./hooks";
import { FeaturesHeader, FeaturesContent, NoProductState } from "./components";
import type { Plan } from "../../../types";

export type PlanFeaturesTabProps = {
  readonly productId?: string;
  readonly featureIds?: string[];
  readonly planId?: string; // ID of the current plan being edited
  readonly planUpdatedAt?: string | Date; // Plan updatedAt for optimistic locking
  readonly plan?: Plan; // Full plan object for optimistic locking
  readonly onFeatureIdsChange?: (featureIds: string[]) => void;
};

export function PlanFeaturesTab({
  productId,
  featureIds = [],
  planId,
  planUpdatedAt,
  plan,
  onFeatureIdsChange,
}: PlanFeaturesTabProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);

  // Data hooks
  const { allProductFeatures, planFeatures, isLoadingFeatures } =
    usePlanFeatures(productId, featureIds);

  // Operations hooks
  const { isRemoving, isAdding, handleDeleteFeature, handleAddFeatures } =
    useFeatureOperations(
      planId,
      plan,
      planUpdatedAt,
      featureIds,
      allProductFeatures,
      onFeatureIdsChange
    );

  const handleAddFeaturesWithDialog = async (newFeatureIds: string[]) => {
    await handleAddFeatures(newFeatureIds);
    setSelectDialogOpen(false);
  };

  if (!productId) {
    return <NoProductState />;
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <FeaturesHeader
          featureCount={planFeatures.length}
          isAdding={isAdding}
          productId={productId}
          onAddClick={() => setSelectDialogOpen(true)}
        />

        <FeaturesContent
          isLoadingFeatures={isLoadingFeatures}
          allProductFeatures={allProductFeatures}
          planFeatures={planFeatures}
          isRemoving={isRemoving}
          onDeleteFeature={handleDeleteFeature}
        />
      </Stack>

      <SelectFeaturesDialog
        open={selectDialogOpen}
        productId={productId}
        selectedFeatureIds={featureIds}
        currentPlanId={planId}
        onClose={() => setSelectDialogOpen(false)}
        onAddFeatures={handleAddFeaturesWithDialog}
      />
    </Box>
  );
}
