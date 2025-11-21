import { useMemo, useEffect } from "react";

export function useFieldValidation(
  localProductId: string | undefined,
  localItOwner: string | undefined,
  products: Array<{ id: string }>,
  itOwners: Array<{ id: string }>,
  isLoadingProducts: boolean,
  isLoadingITOwners: boolean,
  onProductChange?: (productId: string) => void,
  onITOwnerChange?: (itOwnerId: string) => void
) {
  // Validate that the current values exist in the available options
  const validProductId = useMemo(() => {
    if (!localProductId) return "";
    if (isLoadingProducts || products.length === 0) return "";
    const exists = products.some((p) => p.id === localProductId);
    return exists ? localProductId : "";
  }, [localProductId, products, isLoadingProducts]);

  const validItOwner = useMemo(() => {
    if (!localItOwner) return "";
    if (isLoadingITOwners) return "";
    const exists = itOwners.some((o) => o.id === localItOwner);
    return exists ? localItOwner : "";
  }, [localItOwner, itOwners, isLoadingITOwners]);

  // Sync local state when validation detects invalid values
  useEffect(() => {
    if (
      !isLoadingProducts &&
      products.length > 0 &&
      localProductId &&
      validProductId !== localProductId
    ) {
      if (onProductChange) {
        onProductChange("");
      }
    }
  }, [
    localProductId,
    validProductId,
    products.length,
    isLoadingProducts,
    onProductChange,
  ]);

  useEffect(() => {
    if (
      !isLoadingITOwners &&
      localItOwner &&
      validItOwner !== localItOwner
    ) {
      if (onITOwnerChange) {
        onITOwnerChange("");
      }
    }
  }, [localItOwner, validItOwner, isLoadingITOwners, onITOwnerChange]);

  return {
    validProductId,
    validItOwner,
  };
}

