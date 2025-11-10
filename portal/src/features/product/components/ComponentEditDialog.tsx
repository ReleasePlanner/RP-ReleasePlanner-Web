/**
 * Component Edit Dialog Component
 *
 * Dialog for editing and adding product components
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Button,
} from "@mui/material";
import { type ComponentVersion, type ComponentTypeValue } from "../types";

interface ComponentEditDialogProps {
  open: boolean;
  editing: boolean;
  component: ComponentVersion | null;
  selectedProductName: string | null;
  onClose: () => void;
  onSave: () => void;
  onComponentChange: (component: ComponentVersion) => void;
}

export function ComponentEditDialog({
  open,
  editing,
  component,
  selectedProductName,
  onClose,
  onSave,
  onComponentChange,
}: ComponentEditDialogProps) {
  if (!component) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editing ? "Edit Component" : "Add Component"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {editing && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Editing component for: <strong>{selectedProductName}</strong>
          </Alert>
        )}

        <TextField
          label="Component Type"
          select
          fullWidth
          value={component.type}
          onChange={(e) => {
            onComponentChange({
              ...component,
              type: e.target.value as ComponentTypeValue,
            });
          }}
          SelectProps={{
            native: true,
          }}
          sx={{ mb: 2 }}
        >
          <option value="web">Web</option>
          <option value="services">Services</option>
          <option value="mobile">Mobile</option>
        </TextField>

        <TextField
          label="Current Version"
          fullWidth
          value={component.currentVersion}
          onChange={(e) => {
            onComponentChange({
              ...component,
              currentVersion: e.target.value,
            });
          }}
          placeholder="e.g., 1.0.0"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Previous Version"
          fullWidth
          value={component.previousVersion}
          onChange={(e) => {
            onComponentChange({
              ...component,
              previousVersion: e.target.value,
            });
          }}
          placeholder="e.g., 0.9.0"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
