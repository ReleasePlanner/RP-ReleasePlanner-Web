/**
 * Product Edit Dialog Component
 *
 * Minimalist and elegant Material UI dialog for creating and editing products
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  alpha,
  Stack,
  Box,
  Typography,
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
  const isEditing = product?.name && product.name.trim() !== "";

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: theme.palette.text.primary,
        }}
      >
        {isEditing ? "Edit Product" : "Create Product"}
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Product Information
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="Product Name"
                fullWidth
                required
                value={product.name || ""}
                onChange={(e) => {
                  onProductChange({
                    ...product,
                    name: e.target.value,
                  });
                }}
                placeholder="e.g., Release Planner Suite"
                variant="outlined"
                size="medium"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={product.description || ""}
                onChange={(e) => {
                  onProductChange({
                    ...product,
                    description: e.target.value,
                  });
                }}
                placeholder="Brief description of the product and its purpose..."
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.action.hover, 0.5),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(product)}
          variant="contained"
          disabled={!product.name?.trim()}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 1.5,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.32)}`,
            },
            "&:disabled": {
              boxShadow: "none",
            },
          }}
        >
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
