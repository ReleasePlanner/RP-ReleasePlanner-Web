import { useMemo } from "react";
import type { ComponentVersion } from "@/api/services/products.service";
import type { PlanComponent } from "../../../../types";
import { useProducts } from "@/api/hooks";

export type ComponentWithDetails = ComponentVersion & {
  finalVersion: string;
  planComponentId: string;
};

export type PlanComponentsData = {
  product: { id: string; name: string; components: ComponentVersion[] } | null;
  planComponentsWithDetails: ComponentWithDetails[];
  isLoading: boolean;
};

export function usePlanComponents(
  productId?: string,
  components: PlanComponent[] = []
): PlanComponentsData {
  // Get products from API (Products maintenance)
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  // Get product from API
  const product = useMemo(() => {
    if (!productId) return null;
    return products.find((p) => p.id === productId) || null;
  }, [productId, products]);

  const productComponents = product?.components || [];

  // Get full component details for components in the plan
  // Use currentVersion from planComponent (stored in plan), not from product
  const planComponentsWithDetails = useMemo(() => {
    return components
      .map((planComp) => {
        const component = productComponents.find((c) => c.id === planComp.componentId);
        return component
          ? {
              ...component,
              currentVersion:
                planComp.currentVersion || component.currentVersion || "0.0.0.0", // Use currentVersion from plan
              finalVersion: planComp.finalVersion,
              planComponentId: planComp.componentId,
            }
          : null;
      })
      .filter(
        (c): c is ComponentWithDetails => c !== null
      );
  }, [components, productComponents]);

  return {
    product: product
      ? {
          id: product.id,
          name: product.name,
          components: product.components,
        }
      : null,
    planComponentsWithDetails,
    isLoading: isLoadingProducts,
  };
}

