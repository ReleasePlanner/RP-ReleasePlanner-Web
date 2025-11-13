import { useState, useCallback } from "react";
import type { Feature, ProductWithFeatures } from "../types";

/**
 * Hook for managing features within a product
 */
export function useProductFeatures(initialProduct: ProductWithFeatures) {
  const [product, setProduct] = useState(initialProduct);

  const addFeature = useCallback((feature: Feature) => {
    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, feature],
    }));
  }, []);

  const updateFeature = useCallback(
    (featureId: string, updatedFeature: Feature) => {
      setProduct((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.id === featureId ? updatedFeature : f
        ),
      }));
    },
    []
  );

  const deleteFeature = useCallback((featureId: string) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== featureId),
    }));
  }, []);

  return {
    product,
    setProduct,
    addFeature,
    updateFeature,
    deleteFeature,
  };
}

/**
 * Hook for managing all products and features
 */
export function useFeatures(initialProducts: ProductWithFeatures[]) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState(
    initialProducts[0]?.id
  );

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const addFeatureToProduct = useCallback(
    (productId: string, feature: Feature) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, features: [...p.features, feature] } : p
        )
      );
    },
    []
  );

  const updateFeatureInProduct = useCallback(
    (productId: string, featureId: string, updatedFeature: Feature) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                features: p.features.map((f) =>
                  f.id === featureId ? updatedFeature : f
                ),
              }
            : p
        )
      );
    },
    []
  );

  const deleteFeatureFromProduct = useCallback(
    (productId: string, featureId: string) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, features: p.features.filter((f) => f.id !== featureId) }
            : p
        )
      );
    },
    []
  );

  return {
    products,
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    addFeatureToProduct,
    updateFeatureInProduct,
    deleteFeatureFromProduct,
  };
}
