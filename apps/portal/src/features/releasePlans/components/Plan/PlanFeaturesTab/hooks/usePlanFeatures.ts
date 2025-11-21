import { useMemo } from "react";
import { useFeatures } from "../../../../../../api/hooks";
import type { Feature } from "../../../../feature/types";

export function usePlanFeatures(
  productId?: string,
  featureIds: string[] = []
) {
  const { data: allProductFeatures = [], isLoading: isLoadingFeatures } =
    useFeatures(productId);

  // Get features that are in the plan (filtered by featureIds)
  const planFeatures = useMemo(() => {
    if (!productId || featureIds.length === 0) return [];
    return allProductFeatures.filter((f: Feature) =>
      featureIds.includes(f.id)
    );
  }, [allProductFeatures, featureIds, productId]);

  return {
    allProductFeatures,
    planFeatures,
    isLoadingFeatures,
  };
}

