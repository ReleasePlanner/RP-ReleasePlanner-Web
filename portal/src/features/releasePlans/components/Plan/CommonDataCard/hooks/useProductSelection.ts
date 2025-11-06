import { useState } from "react";
import { getAllProducts, getProductById } from "../../../../lib/productData";

export function useProductSelection() {
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const products = getAllProducts();
  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId)
    : undefined;

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
  };

  return {
    products,
    selectedProduct,
    selectedProductId,
    handleProductChange,
  };
}
