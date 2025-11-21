import { Box } from "@mui/material";
import { FeaturesTable } from "@/features/feature/components";
import { FeaturesLoadingState } from "./FeaturesLoadingState";
import { FeaturesEmptyState } from "./FeaturesEmptyState";
import type { Feature } from "../../../../feature/types";

export type FeaturesContentProps = {
  readonly isLoadingFeatures: boolean;
  readonly allProductFeatures: Feature[];
  readonly planFeatures: Feature[];
  readonly isRemoving: string | null;
  readonly onDeleteFeature: (featureId: string) => void;
};

export function FeaturesContent({
  isLoadingFeatures,
  allProductFeatures,
  planFeatures,
  isRemoving,
  onDeleteFeature,
}: FeaturesContentProps) {
  if (isLoadingFeatures && allProductFeatures.length === 0) {
    return <FeaturesLoadingState />;
  }

  if (planFeatures.length === 0) {
    return <FeaturesEmptyState />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "hidden",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <FeaturesTable
        features={planFeatures}
        onDeleteFeature={onDeleteFeature}
        isRemoving={isRemoving}
      />
    </Box>
  );
}

