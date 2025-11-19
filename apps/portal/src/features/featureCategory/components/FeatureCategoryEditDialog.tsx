/**
 * Feature Category Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing feature categories
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

interface FeatureCategoryEditDialogProps {
  open: boolean;
  category: FeatureCategory | null;
  onClose: () => void;
  onSave: () => void;
  onCategoryChange: (category: FeatureCategory) => void;
}

export function FeatureCategoryEditDialog({
  open,
  category,
  onClose,
  onSave,
  onCategoryChange,
}: FeatureCategoryEditDialogProps) {
  const theme = useTheme();
  const isEditing = category?.id && !category.id.startsWith('cat-');

  if (!category) return null;

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Feature Category" : "New Feature Category"}
      subtitle="Manage feature category information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Feature Category"}
      isFormValid={!!category.name?.trim()}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Category Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Category Name"
          placeholder="e.g., Core Features, Enhancements, Bug Fixes"
          value={category.name || ""}
          onChange={(e) =>
            onCategoryChange({ ...category, name: e.target.value })
          }
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
      </Stack>
    </BaseEditDialog>
  );
}

