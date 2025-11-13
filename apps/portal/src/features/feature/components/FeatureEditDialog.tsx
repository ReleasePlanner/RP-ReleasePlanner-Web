import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import type {
  Feature,
  FeatureStatus,
  FeatureCategory,
  ProductOwner,
} from "../types";
import {
  FEATURE_CATEGORIES,
  PRODUCT_OWNERS,
  STATUS_LABELS,
} from "../constants";

/**
 * Props for FeatureEditDialog component
 */
interface FeatureEditDialogProps {
  open: boolean;
  editing: boolean;
  feature: Feature | null;
  selectedProductName: string | null;
  onClose: () => void;
  onSave: () => void;
  onFeatureChange: (feature: Feature) => void;
}

/**
 * FeatureEditDialog Component
 *
 * Dialog for creating or editing features with full form validation.
 * Allows editing all feature properties including category and owner.
 *
 * @example
 * ```tsx
 * <FeatureEditDialog
 *   open={open}
 *   editing={isEditing}
 *   feature={feature}
 *   selectedProductName={productName}
 *   onClose={handleClose}
 *   onSave={handleSave}
 *   onFeatureChange={handleChange}
 * />
 * ```
 */
export function FeatureEditDialog({
  open,
  editing,
  feature,
  selectedProductName,
  onClose,
  onSave,
  onFeatureChange,
}: FeatureEditDialogProps) {
  const [formData, setFormData] = useState<Feature | null>(feature);

  useEffect(() => {
    setFormData(feature);
  }, [feature, open]);

  if (!formData) return null;

  const handleChange = (
    field: keyof Feature,
    value: string | FeatureStatus | FeatureCategory | ProductOwner
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    if (formData) {
      onFeatureChange(formData);
      onSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? "Edit Feature" : "Create Feature"}
        {selectedProductName && (
          <Typography variant="caption" display="block" color="text.secondary">
            Product: {selectedProductName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        {/* Name */}
        <TextField
          label="Feature Name"
          fullWidth
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* Category */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category.id}
            label="Category"
            onChange={(e) => {
              const category = FEATURE_CATEGORIES.find(
                (c) => c.id === e.target.value
              );
              if (category) handleChange("category", category);
            }}
          >
            {FEATURE_CATEGORIES.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            label="Status"
            onChange={(e) =>
              handleChange("status", e.target.value as FeatureStatus)
            }
          >
            {(Object.keys(STATUS_LABELS) as FeatureStatus[]).map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Product Owner */}
        <FormControl fullWidth>
          <InputLabel>Created By (Product Owner)</InputLabel>
          <Select
            value={formData.createdBy.id}
            label="Created By (Product Owner)"
            onChange={(e) => {
              const owner = PRODUCT_OWNERS.find((o) => o.id === e.target.value);
              if (owner) handleChange("createdBy", owner);
            }}
          >
            {PRODUCT_OWNERS.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Technical Description */}
        <TextField
          label="Technical Description"
          fullWidth
          multiline
          rows={3}
          value={formData.technicalDescription}
          onChange={(e) => handleChange("technicalDescription", e.target.value)}
        />

        {/* Business Description */}
        <TextField
          label="Business Description"
          fullWidth
          multiline
          rows={3}
          value={formData.businessDescription}
          onChange={(e) => handleChange("businessDescription", e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {editing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
