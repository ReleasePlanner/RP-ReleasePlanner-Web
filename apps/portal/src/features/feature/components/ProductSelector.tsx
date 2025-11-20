/**
 * Product Selector Component
 *
 * Elegant Material UI selector for choosing a product to manage features
 */

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
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
 * Displays product count and feature count with elegant Material UI design.
 */
export function ProductSelector({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductSelectorProps) {
  const theme = useTheme();
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Header */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                mb: 0.5,
                color: theme.palette.text.primary,
              }}
            >
              Select Product
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
              }}
            >
              {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          {/* Product Dropdown */}
          <FormControl fullWidth size="small">
            <InputLabel
              shrink
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                transform: "translate(14px, -9px) scale(0.875)",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.875)",
                  backgroundColor: theme.palette.background.paper,
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  zIndex: 1,
                },
              }}
            >
              Producto
            </InputLabel>
            <Select
              value={selectedProductId || ""}
              label="Producto"
              onChange={(e) => onSelectProduct(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.75rem",
                  "& .MuiSelect-select": {
                    py: 0.75,
                    fontSize: "0.75rem",
                  },
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              }}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id} sx={{ fontSize: "0.75rem" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>{product.name}</Typography>
                    <Chip
                      label={`${product.features.length} feature${product.features.length !== 1 ? "s" : ""}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        ml: 1,
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Product Info */}
          {selectedProduct && (
            <Box
              sx={{
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                {selectedProduct.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6875rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {selectedProduct.features.length} feature{selectedProduct.features.length !== 1 ? "s" : ""} configurada{selectedProduct.features.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
