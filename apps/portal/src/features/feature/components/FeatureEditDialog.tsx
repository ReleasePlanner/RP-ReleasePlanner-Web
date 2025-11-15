import { useEffect, useState, useMemo } from "react";
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
  Stack,
  Box,
  Divider,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import type {
  Feature,
  FeatureStatus,
  FeatureCategory,
  ProductOwner,
} from "../types";
import {
  STATUS_LABELS,
} from "../constants";
import { useITOwners } from "@/api/hooks/useITOwners";
import { useFeatureCategories } from "@/api/hooks/useFeatureCategories";
import { useCountries } from "@/api/hooks/useCountries";

/**
 * Props for FeatureEditDialog component
 */
interface FeatureEditDialogProps {
  open: boolean;
  editing: boolean;
  feature: Feature | null;
  selectedProductName: string | null;
  onClose: () => void;
  onSave: (feature: Feature) => void;
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
  const theme = useTheme();
  const [formData, setFormData] = useState<Feature | null>(feature);
  
  // Load IT Owners from backend
  const { data: itOwners = [], isLoading: itOwnersLoading, error: itOwnersError } = useITOwners();
  
  // Load Feature Categories from backend
  const { data: featureCategories = [], isLoading: categoriesLoading, error: categoriesError } = useFeatureCategories();
  
  // Load Countries from backend
  const { data: countries = [], isLoading: countriesLoading, error: countriesError } = useCountries();
  
  // Map IT Owners to ProductOwner format for compatibility
  const productOwners: ProductOwner[] = useMemo(() => {
    return itOwners.map((itOwner) => ({
      id: itOwner.id,
      name: itOwner.name,
    }));
  }, [itOwners]);

  // Map Feature Categories to FeatureCategory format for compatibility
  const categories: FeatureCategory[] = useMemo(() => {
    return featureCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));
  }, [featureCategories]);

  useEffect(() => {
    if (feature) {
      // When editing, ensure createdBy matches an IT Owner from the list
      // If the feature's createdBy doesn't match any IT Owner by ID, try to match by name
      let updatedFeature = { ...feature };
      
      if (feature.createdBy && productOwners.length > 0) {
        // Try to find matching IT Owner by ID first
        let matchingOwner = productOwners.find(po => po.id === feature.createdBy?.id);
        
        // If not found by ID, try to match by name
        if (!matchingOwner && feature.createdBy.name) {
          matchingOwner = productOwners.find(po => 
            po.name.toLowerCase() === feature.createdBy?.name?.toLowerCase()
          );
        }
        
        // If found, use the IT Owner from the list; otherwise keep the original
        if (matchingOwner) {
          updatedFeature = {
            ...updatedFeature,
            createdBy: matchingOwner,
          };
        } else if (!feature.createdBy.id && feature.createdBy.name) {
          // If no ID but has name, try to find or use first available
          updatedFeature = {
            ...updatedFeature,
            createdBy: productOwners[0] || feature.createdBy,
          };
        }
      } else if (!feature.createdBy && productOwners.length > 0) {
        // If no createdBy, use first IT Owner as default
        updatedFeature = {
          ...updatedFeature,
          createdBy: productOwners[0],
        };
      }
      
      setFormData(updatedFeature);
    }
  }, [feature, open, productOwners]);

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
      onSave(formData);
    }
  };

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
        {editing ? "Edit Feature" : "Create Feature"}
        {selectedProductName && (
          <Typography
            variant="body2"
            component="div"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.8125rem",
              mt: 1,
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Chip
              label="Product"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.6875rem",
                fontWeight: 500,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              }}
            />
            {selectedProductName}
          </Typography>
        )}
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
                label="Feature Name"
                fullWidth
                required
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., User Authentication"
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Description"
                fullWidth
                required
                multiline
                rows={2}
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of the feature..."
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

          <Divider sx={{ my: 0.5 }} />

          {/* Classification */}
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
              Classification
            </Typography>
            <Stack spacing={2.5}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category?.id || ""}
                  label="Category"
                  size="medium"
                  disabled={categoriesLoading || categoriesError !== null}
                  onChange={(e) => {
                    const category = categories.find(
                      (c) => c.id === e.target.value
                    );
                    if (category) handleChange("category", category);
                  }}
                  sx={{
                    borderRadius: 1.5,
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const category = categories.find((c) => c.id === value);
                    return category?.name || "";
                  }}
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Loading Categories...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : categoriesError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Failed to load Categories
                      </Alert>
                    </MenuItem>
                  ) : categories.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No Categories available
                      </Typography>
                    </MenuItem>
                  ) : (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {categoriesError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    Error loading Categories. Please refresh the page.
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || ""}
                  label="Status"
                  size="medium"
                  onChange={(e) =>
                    handleChange("status", e.target.value as FeatureStatus)
                  }
                  sx={{
                    borderRadius: 1.5,
                  }}
                >
                  {(Object.keys(STATUS_LABELS) as FeatureStatus[]).map((status) => (
                    <MenuItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Created By (IT Owner)</InputLabel>
                <Select
                  value={formData.createdBy?.id || ""}
                  label="Created By (IT Owner)"
                  size="medium"
                  disabled={itOwnersLoading || itOwnersError !== null}
                  onChange={(e) => {
                    const owner = productOwners.find((o) => o.id === e.target.value);
                    if (owner) handleChange("createdBy", owner);
                  }}
                  sx={{
                    borderRadius: 1.5,
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const owner = productOwners.find((o) => o.id === value);
                    return owner?.name || "";
                  }}
                >
                  {itOwnersLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Loading IT Owners...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : itOwnersError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Failed to load IT Owners
                      </Alert>
                    </MenuItem>
                  ) : productOwners.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No IT Owners available
                      </Typography>
                    </MenuItem>
                  ) : (
                    productOwners.map((owner) => (
                      <MenuItem key={owner.id} value={owner.id}>
                        {owner.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {itOwnersError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    Error loading IT Owners. Please refresh the page.
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  value={formData.country?.id || ""}
                  label="Country"
                  size="medium"
                  disabled={countriesLoading || countriesError !== null}
                  onChange={(e) => {
                    const country = countries.find((c) => c.id === e.target.value);
                    if (country) {
                      handleChange("country", {
                        id: country.id,
                        name: country.name,
                        code: country.code,
                      });
                    } else if (!e.target.value) {
                      handleChange("country", undefined);
                    }
                  }}
                  sx={{
                    borderRadius: 1.5,
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const country = countries.find((c) => c.id === value);
                    return country ? `${country.name} (${country.code})` : "";
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {countriesLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Loading Countries...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : countriesError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Failed to load Countries
                      </Alert>
                    </MenuItem>
                  ) : countries.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No Countries available
                      </Typography>
                    </MenuItem>
                  ) : (
                    countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </MenuItem>
                    ))
                  )}
                </Select>
                {countriesError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    Error loading Countries. Please refresh the page.
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Detailed Descriptions */}
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
              Detailed Descriptions
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="Technical Description"
                fullWidth
                required
                multiline
                rows={3}
                value={formData.technicalDescription || ""}
                onChange={(e) => handleChange("technicalDescription", e.target.value)}
                placeholder="Technical details, implementation notes..."
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Business Description"
                fullWidth
                required
                multiline
                rows={3}
                value={formData.businessDescription || ""}
                onChange={(e) => handleChange("businessDescription", e.target.value)}
                placeholder="Business value, user benefits..."
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
          onClick={handleSave}
          variant="contained"
          disabled={
            !formData?.name?.trim() ||
            !formData?.description?.trim() ||
            !formData?.technicalDescription?.trim() ||
            !formData?.businessDescription?.trim()
          }
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
          {editing ? "Update Feature" : "Create Feature"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
