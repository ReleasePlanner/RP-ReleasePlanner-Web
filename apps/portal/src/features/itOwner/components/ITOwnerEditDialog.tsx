/**
 * IT Owner Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing IT Owners
 */

import {
  TextField,
  Stack,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { ITOwner } from "@/features/releasePlans/constants/itOwners";

interface ITOwnerEditDialogProps {
  open: boolean;
  owner: ITOwner;
  onSave: () => void;
  onClose: () => void;
  onChange: (owner: ITOwner) => void;
}

export function ITOwnerEditDialog({
  open,
  owner,
  onSave,
  onClose,
  onChange,
}: ITOwnerEditDialogProps) {
  const theme = useTheme();
  const isEditing = owner.id && !owner.id.startsWith('owner-');

  const handleChange = (field: keyof ITOwner, value: string) => {
    onChange({ ...owner, [field]: value });
  };

  const isValid = owner.name.trim() !== "" && owner.email?.trim() !== "";

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit IT Owner" : "New IT Owner"}
      subtitle="Manage IT Owner information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create IT Owner"}
      isFormValid={isValid}
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
          placeholder="e.g., John Doe"
          value={owner.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
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

        {/* Email */}
        <TextField
          fullWidth
          size="small"
          label="Email"
          type="email"
          placeholder="e.g., john.doe@company.com"
          value={owner.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
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

        {/* Department */}
        <TextField
          fullWidth
          size="small"
          label="Department"
          placeholder="e.g., IT, Engineering, Product"
          value={owner.department || ""}
          onChange={(e) => handleChange("department", e.target.value)}
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
