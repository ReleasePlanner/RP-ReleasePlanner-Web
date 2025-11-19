/**
 * Component Type Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing component types
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
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
  const isEditing = componentType?.id && !componentType.id.startsWith('type-');

  if (!componentType) return null;

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Component Type" : "New Component Type"}
      subtitle="Manage component type information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Component Type"}
      isFormValid={!!componentType.name?.trim()}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Name"
          placeholder="e.g., Web, Services, Mobile"
          value={componentType.name || ""}
          onChange={(e) => {
            onComponentTypeChange({
              ...componentType,
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

        {/* Code */}
        <TextField
          fullWidth
          size="small"
          label="Code"
          placeholder="e.g., web, services, mobile"
          value={componentType.code || ""}
          onChange={(e) => {
            onComponentTypeChange({
              ...componentType,
              code: e.target.value,
            });
          }}
          helperText="Unique code identifier (optional)"
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
          multiline
          rows={3}
          size="small"
          label="Description"
          placeholder="Brief description of the component type..."
          value={componentType.description || ""}
          onChange={(e) => {
            onComponentTypeChange({
              ...componentType,
              description: e.target.value,
            });
          }}
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

