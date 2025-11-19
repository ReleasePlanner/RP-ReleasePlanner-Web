/**
 * Product Edit Dialog Component
 *
 * Minimalist and elegant Material UI dialog for creating and editing products
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
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
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Product" : "New Product"}
      subtitle={
        isEditing
          ? "Modify the product details"
          : "Create a new product to manage components"
      }
      maxWidth="sm"
      onSave={() => onSave(product)}
      saveButtonText={isEditing ? "Save Changes" : "Create Product"}
      isFormValid={!!product.name?.trim()}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Product Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Product Name"
          placeholder="e.g., Release Planner Suite"
          value={product.name || ""}
          onChange={(e) => {
            onProductChange({
              ...product,
              name: e.target.value,
            });
          }}
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
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
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />

        {/* Description */}
        <TextField
          fullWidth
          size="small"
          label="Description"
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
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& textarea": {
                py: 0.625,
                fontSize: "0.6875rem",
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
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />
      </Stack>
    </BaseEditDialog>
  );
}
