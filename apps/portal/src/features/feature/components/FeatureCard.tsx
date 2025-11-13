import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { ProductWithFeatures } from "../types";

/**
 * Props for FeatureCard component
 */
interface FeatureCardProps {
  product: ProductWithFeatures;
  onAddFeature: (product: ProductWithFeatures) => void;
}

/**
 * FeatureCard Component (Legacy)
 *
 * Displays a product card with features.
 * Kept for backward compatibility. Use ProductFeaturesList for new code.
 *
 * @deprecated Use ProductFeaturesList instead
 * @example
 * ```tsx
 * <FeatureCard
 *   product={product}
 *   onAddFeature={handleAdd}
 * />
 * ```
 */
export function FeatureCard({ product, onAddFeature }: FeatureCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: theme.shadows[1],
        "&:hover": {
          boxShadow: theme.shadows[4],
          transition: theme.transitions.create("box-shadow"),
        },
      }}
    >
      {/* Header */}
      <CardHeader
        title={product.name}
        subheader={`${product.features.length} feature${
          product.features.length !== 1 ? "s" : ""
        }`}
        sx={{
          pb: 1,
          "& .MuiCardHeader-title": {
            fontSize: "1.1rem",
            fontWeight: 600,
          },
        }}
      />

      {/* Content */}
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {product.features.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No features yet
            </Typography>
          ) : (
            product.features.slice(0, 3).map((feature) => (
              <Box key={feature.id} sx={{ fontSize: "0.875rem" }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {feature.name}
                </Typography>
              </Box>
            ))
          )}
          {product.features.length > 3 && (
            <Typography variant="caption" color="text.secondary">
              +{product.features.length - 3} more...
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <Box
        sx={{
          p: 2,
          pt: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={() => onAddFeature(product)}
          title="Add feature"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
