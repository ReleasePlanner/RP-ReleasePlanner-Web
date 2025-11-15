/**
 * Feature Category Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing feature categories
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
        {isEditing ? "Edit Feature Category" : "Create Feature Category"}
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
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Category Name"
              value={category.name || ""}
              onChange={(e) =>
                onCategoryChange({ ...category, name: e.target.value })
              }
              required
              autoFocus
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
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
              bgcolor: alpha(theme.palette.text.secondary, 0.08),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!category.name || category.name.trim() === ""}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 600,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {isEditing ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

