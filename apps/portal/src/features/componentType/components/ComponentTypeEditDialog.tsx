/**
 * Component Type Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing component types
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
import type { ComponentType } from "@/api/services/componentTypes.service";

interface ComponentTypeEditDialogProps {
  open: boolean;
  componentType: ComponentType | null;
  onClose: () => void;
  onSave: () => void;
  onComponentTypeChange: (componentType: ComponentType) => void;
}

export function ComponentTypeEditDialog({
  open,
  componentType,
  onClose,
  onSave,
  onComponentTypeChange,
}: ComponentTypeEditDialogProps) {
  const theme = useTheme();
  const isEditing = componentType?.name && componentType.name.trim() !== "";

  if (!componentType) return null;

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
        {isEditing ? "Edit Component Type" : "Create Component Type"}
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
              Component Type Information
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="Name"
                fullWidth
                required
                value={componentType.name || ""}
                onChange={(e) => {
                  onComponentTypeChange({
                    ...componentType,
                    name: e.target.value,
                  });
                }}
                placeholder="e.g., Web, Services, Mobile"
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
                label="Code"
                fullWidth
                value={componentType.code || ""}
                onChange={(e) => {
                  onComponentTypeChange({
                    ...componentType,
                    code: e.target.value,
                  });
                }}
                placeholder="e.g., web, services, mobile"
                variant="outlined"
                size="medium"
                helperText="Unique code identifier (optional)"
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
                rows={3}
                value={componentType.description || ""}
                onChange={(e) => {
                  onComponentTypeChange({
                    ...componentType,
                    description: e.target.value,
                  });
                }}
                placeholder="Brief description of the component type..."
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
          onClick={onSave}
          variant="contained"
          disabled={!componentType.name?.trim()}
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
          {isEditing ? "Update Component Type" : "Create Component Type"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

