/**
 * IT Owner Edit Dialog
 *
 * Minimalist and elegant Material UI dialog for creating and editing IT Owners
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useTheme,
  alpha,
  Stack,
  Box,
  Typography,
} from "@mui/material";
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
        {isEditing ? "Edit IT Owner" : "Create IT Owner"}
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

            <Stack spacing={2.5}>
              <TextField
                label="Name"
                value={owner.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                fullWidth
                autoFocus
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                value={owner.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                fullWidth
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Department"
                value={owner.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
                fullWidth
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
          disabled={!isValid}
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
