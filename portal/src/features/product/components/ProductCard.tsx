/**
 * Product Card Component
 *
 * Displays a single product with its components in a card layout
 */

import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  type Product,
  type ComponentVersion,
} from "@/features/releasePlans/components/Plan/CommonDataCard/types";
import { ComponentsTable } from "./index";

interface ProductCardProps {
  product: Product;
  onEditComponent: (product: Product, component: ComponentVersion) => void;
  onDeleteComponent: (productId: string, componentId: string) => void;
  onAddComponent: (product: Product) => void;
}

export function ProductCard({
  product,
  onEditComponent,
  onDeleteComponent,
  onAddComponent,
}: ProductCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: theme.transitions.create(["box-shadow", "border-color"], {
          duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Product Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: theme.palette.text.primary,
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontFamily: "monospace",
              fontSize: "0.75rem",
            }}
          >
            {product.id}
          </Typography>
        </Box>

        {/* Components Table */}
        <ComponentsTable
          components={product.components}
          onEditComponent={(component: ComponentVersion) =>
            onEditComponent(product, component)
          }
          onDeleteComponent={(componentId: string) =>
            onDeleteComponent(product.id, componentId)
          }
        />

        {/* Add Component Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            mt: 2,
            textTransform: "none",
            fontWeight: 500,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              color: theme.palette.primary.main,
            },
          }}
          onClick={() => onAddComponent(product)}
          fullWidth
        >
          Add Component
        </Button>
      </CardContent>
    </Card>
  );
}
