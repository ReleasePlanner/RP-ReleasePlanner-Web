/**
 * Product Card Component
 *
 * Displays a single product with its components in a card layout
 */

import { Card, CardContent, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { type Product, type ComponentVersion } from "../types";
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
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {product.name}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          ID: {product.id}
        </Typography>

        <ComponentsTable
          components={product.components}
          onEditComponent={(component: ComponentVersion) => onEditComponent(product, component)}
          onDeleteComponent={(componentId: string) =>
            onDeleteComponent(product.id, componentId)
          }
        />

        <Button
          variant="text"
          size="small"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={() => onAddComponent(product)}
        >
          Add Component
        </Button>
      </CardContent>
    </Card>
  );
}
