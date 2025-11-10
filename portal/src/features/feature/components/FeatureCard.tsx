import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { Feature, ProductWithFeatures } from "../types";
import { FeaturesTable } from "./FeaturesTable";

/**
 * Props for FeatureCard component
 */
interface FeatureCardProps {
  product: ProductWithFeatures;
  onEditFeature: (product: ProductWithFeatures, feature: Feature) => void;
  onDeleteFeature: (productId: string, featureId: string) => void;
  onAddFeature: (product: ProductWithFeatures) => void;
}

/**
 * FeatureCard Component
 *
 * Displays a product card with expandable features table.
 * Shows feature count and allows inline editing/deletion.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   product={product}
 *   onEditFeature={handleEdit}
 *   onDeleteFeature={handleDelete}
 *   onAddFeature={handleAdd}
 * />
 * ```
 */
export function FeatureCard({
  product,
  onEditFeature,
  onDeleteFeature,
  onAddFeature,
}: FeatureCardProps) {
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
        <FeaturesTable
          features={product.features}
          onEditFeature={(feature: Feature) => onEditFeature(product, feature)}
          onDeleteFeature={(featureId: string) =>
            onDeleteFeature(product.id, featureId)
          }
        />
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
