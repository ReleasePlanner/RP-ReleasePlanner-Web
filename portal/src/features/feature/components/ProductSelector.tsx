import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import type { ProductWithFeatures } from "../types";

/**
 * Props for ProductSelector component
 */
interface ProductSelectorProps {
  products: ProductWithFeatures[];
  selectedProductId: string | undefined;
  onSelectProduct: (productId: string) => void;
}

/**
 * ProductSelector Component
 *
 * Allows user to select which product's features to manage.
 * Displays product count and feature count.
 *
 * @example
 * ```tsx
 * <ProductSelector
 *   products={products}
 *   selectedProductId={selectedId}
 *   onSelectProduct={setSelectedId}
 * />
 * ```
 */
export function ProductSelector({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductSelectorProps) {
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      {/* Header */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Select Product
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {products.length} product{products.length !== 1 ? "s" : ""} available
        </Typography>
      </Box>

      {/* Product Dropdown */}
      <FormControl fullWidth sx={{ maxWidth: 300 }}>
        <InputLabel>Product</InputLabel>
        <Select
          value={selectedProductId || ""}
          label="Product"
          onChange={(e) => onSelectProduct(e.target.value)}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name} ({product.features.length} feature
              {product.features.length !== 1 ? "s" : ""})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Product Info */}
      {selectedProduct && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {selectedProduct.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedProduct.features.length} feature
            {selectedProduct.features.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
