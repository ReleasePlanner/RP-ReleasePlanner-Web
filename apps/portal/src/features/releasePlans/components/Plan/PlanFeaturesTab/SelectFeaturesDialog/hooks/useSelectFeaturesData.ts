import { useMemo } from "react";
import { usePlans, useFeatures, useProducts } from "@/api/hooks";
import { convertAPIPlanToLocal } from "../../../../../lib/planConverters";
import type { PlanStatus } from "../../../../types";
import type { Feature } from "../../../../../../api/services/features.service";

export function useSelectFeaturesData(
  productId?: string,
  selectedFeatureIds: string[] = [],
  currentPlanId?: string
) {
  // Get all plans to check feature availability
  const { data: apiPlans = [] } = usePlans();
  const allPlans = useMemo(() => {
    return apiPlans.map(convertAPIPlanToLocal);
  }, [apiPlans]);

  // Get products from API
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  // Get product from API
  const selectedProduct = useMemo(() => {
    if (!productId) return null;
    return products.find((p: { id: string }) => p.id === productId) ?? null;
  }, [productId, products]);

  // Get all features for the product from API
  const { data: allProductFeatures = [], isLoading: isLoadingFeatures } =
    useFeatures(productId);

  // Create a map of featureId -> array of plans (excluding current plan) that contain this feature
  // Only include plans that are NOT in "done" status
  const featureToActivePlansMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{ id: string; name: string; status: PlanStatus }>
    >();

    for (const plan of allPlans) {
      // Skip the current plan being edited
      if (plan.id === currentPlanId) continue;

      // Only check plans that are NOT in "done" status
      if (plan.metadata.status === "done") continue;

      const featureIds = plan.metadata.featureIds || [];
      for (const featureId of featureIds) {
        if (!map.has(featureId)) {
          map.set(featureId, []);
        }
        map.get(featureId)!.push({
          id: plan.id,
          name: plan.metadata.name,
          status: plan.metadata.status,
        });
      }
    }

    return map;
  }, [allPlans, currentPlanId]);

  // Get all features (excluding those already in the plan AND those in active plans)
  const allAvailableFeatures = useMemo(() => {
    return allProductFeatures.filter((f: Feature) => {
      // Exclude features already in the current plan
      if (selectedFeatureIds.includes(f.id)) return false;

      // Exclude features that are in active plans (not "done")
      const activePlans = featureToActivePlansMap.get(f.id);
      if (activePlans && activePlans.length > 0) return false;

      return true;
    });
  }, [allProductFeatures, selectedFeatureIds, featureToActivePlansMap]);

  return {
    allPlans,
    selectedProduct,
    allProductFeatures,
    allAvailableFeatures,
    featureToActivePlansMap,
    isLoadingProducts,
    isLoadingFeatures,
  };
}

