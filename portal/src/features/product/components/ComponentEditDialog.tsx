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
import { type ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard/types";

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
          label="Component Name"
          fullWidth
          value={component.name}
          onChange={(e) => {
            onComponentChange({
              ...component,
              name: e.target.value,
            });
          }}
          placeholder="e.g., Web Portal"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Component Type"
          fullWidth
          value={component.type}
          onChange={(e) => {
            onComponentChange({
              ...component,
              type: e.target.value,
            });
          }}
          placeholder="e.g., web, mobile, service"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Version"
          fullWidth
          value={component.version || ""}
          onChange={(e) => {
            onComponentChange({
              ...component,
              version: e.target.value,
            });
          }}
          placeholder="e.g., 1.0.0"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={component.description || ""}
          onChange={(e) => {
            onComponentChange({
              ...component,
              description: e.target.value,
            });
          }}
          placeholder="Brief description..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!component.name || !component.type}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
