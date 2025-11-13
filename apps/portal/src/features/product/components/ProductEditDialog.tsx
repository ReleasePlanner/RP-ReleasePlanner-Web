/**
 * Product Edit Dialog Component
 *
 * Minimalist dialog for creating and editing products
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import type { Product } from "@/features/releasePlans/components/Plan/CommonDataCard";

interface ProductEditDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  onProductChange: (product: Product) => void;
}

export function ProductEditDialog({
  open,
  product,
  onClose,
  onSave,
  onProductChange,
}: ProductEditDialogProps) {
  const theme = useTheme();

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
          {product.name ? "Edit Product" : "Create Product"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            label="Product Name"
            fullWidth
            required
            value={product.name}
            onChange={(e) => {
              onProductChange({
                ...product,
                name: e.target.value,
              });
            }}
            placeholder="e.g., Release Planner Suite"
            variant="outlined"
            size="small"
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={product.description || ""}
            onChange={(e) => {
              onProductChange({
                ...product,
                description: e.target.value,
              });
            }}
            placeholder="Brief description of the product..."
            variant="outlined"
            size="small"
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(product)}
          variant="contained"
          disabled={!product.name.trim()}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {product.name ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
