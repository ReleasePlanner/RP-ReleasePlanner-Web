/**
 * IT Owner Edit Dialog
 *
 * Dialog for adding or editing IT Owner information
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
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
  const isNew = !owner.name;

  const handleChange = (field: keyof ITOwner, value: string) => {
    onChange({ ...owner, [field]: value });
  };

  const isValid = owner.name.trim() !== "" && owner.email?.trim() !== "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isNew ? "Add IT Owner" : "Edit IT Owner"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={owner.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            value={owner.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Department"
            value={owner.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!isValid}
          sx={{ textTransform: "none" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
