/**
 * Feature Edit Dialog Component
 *
 * Minimalist and elegant Material UI dialog for creating and editing features
 */

import { useEffect, useState, useMemo } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Box,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
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
    value: string | FeatureStatus | FeatureCategory | ProductOwner | undefined
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

  const isFormValid = 
    formData?.name?.trim() &&
    formData?.description?.trim() &&
    formData?.technicalDescription?.trim() &&
    formData?.businessDescription?.trim();

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={editing}
      title={editing ? "Editar Feature" : "Nueva Feature"}
      subtitle={
        editing
          ? "Modifica los detalles de la feature"
          : "Crea una nueva feature para el producto"
      }
      subtitleChip={selectedProductName || undefined}
      maxWidth="md"
      onSave={handleSave}
      saveButtonText={editing ? "Actualizar Feature" : "Crear Feature"}
      isFormValid={isFormValid}
    >
        <Stack spacing={3}>
          {/* Feature Name */}
          <Box sx={{ pt: 3 }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              label="Nombre de la Feature"
            placeholder="Ej: User Authentication, Payment Gateway..."
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.625rem",
                fontWeight: 500,
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.875)",
                  backgroundColor: theme.palette.background.paper,
                  paddingLeft: "6px",
                  paddingRight: "6px",
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
          </Box>

          {/* Description */}
          <TextField
            fullWidth
            size="small"
            label="Descripción"
            multiline
            rows={3}
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Breve descripción de la feature..."
            required
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.6875rem",
                fontWeight: 500,
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.875)",
                  backgroundColor: theme.palette.background.paper,
                  paddingLeft: "6px",
                  paddingRight: "6px",
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

          {/* Classification Fields */}
          <Grid container spacing={2}>
              {/* Category */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl size="small" sx={{ minWidth: 120, width: "100%" }}>
                <InputLabel
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.875)",
                      backgroundColor: theme.palette.background.paper,
                      paddingLeft: "6px",
                      paddingRight: "6px",
                    },
                  }}
                >
                  Categoría
                </InputLabel>
                <Select
                  value={formData.category?.id || ""}
                  label="Categoría"
                  disabled={categoriesLoading || categoriesError !== null}
                  onChange={(e) => {
                    const category = categories.find(
                      (c) => c.id === e.target.value
                    );
                    if (category) handleChange("category", category);
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const category = categories.find((c) => c.id === value);
                    return (
                      <Typography sx={{ fontSize: "0.6875rem", lineHeight: 1.5 }}>
                        {category?.name || ""}
                      </Typography>
                    );
                  }}
                  sx={{
                    fontSize: "0.6875rem",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.6875rem",
                      "& .MuiSelect-select": {
                        py: 0.625,
                        fontSize: "0.6875rem",
                        lineHeight: 1.5,
                      },
                      "& .MuiSelect-nativeInput": {
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
                  }}
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.6875rem" }}>
                          Cargando categorías...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : categoriesError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Error al cargar categorías
                      </Alert>
                    </MenuItem>
                  ) : categories.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.625rem" }}>
                        No hay categorías disponibles
                      </Typography>
                    </MenuItem>
                  ) : (
                    categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                      {cat.name}
                    </MenuItem>
                    ))
                  )}
                </Select>
                {categoriesError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75, fontSize: "0.625rem" }}>
                    Error al cargar categorías. Por favor, actualiza la página.
                  </Typography>
                )}
                </FormControl>
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl size="small" sx={{ minWidth: 120, width: "100%" }}>
                <InputLabel
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.875)",
                      backgroundColor: theme.palette.background.paper,
                      paddingLeft: "6px",
                      paddingRight: "6px",
                    },
                  }}
                >
                  Estado
                </InputLabel>
                <Select
                  value={formData.status || ""}
                  label="Estado"
                  onChange={(e) =>
                    handleChange("status", e.target.value as FeatureStatus)
                  }
                  IconComponent={() => null}
                  sx={{
                    fontSize: "0.6875rem",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.6875rem",
                      "& .MuiSelect-select": {
                        py: 0.625,
                        fontSize: "0.6875rem",
                        lineHeight: 1.5,
                      },
                      "& .MuiSelect-nativeInput": {
                        fontSize: "0.6875rem",
                      },
                      "& .MuiSelect-icon": {
                        display: "none",
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
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const statusLabel = STATUS_LABELS[value as FeatureStatus];
                    return (
                      <Typography sx={{ fontSize: "0.6875rem", lineHeight: 1.5 }}>
                        {statusLabel || ""}
                      </Typography>
                    );
                  }}
                >
                  {(Object.keys(STATUS_LABELS) as FeatureStatus[]).map((status) => (
                    <MenuItem key={status} value={status} sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                      {STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>

              {/* Created By (IT Owner) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl size="small" sx={{ minWidth: 120, width: "100%" }}>
                <InputLabel
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.875)",
                      backgroundColor: theme.palette.background.paper,
                      paddingLeft: "6px",
                      paddingRight: "6px",
                    },
                  }}
                >
                  Creado Por (IT Owner)
                </InputLabel>
                <Select
                  value={formData.createdBy?.id || ""}
                  label="Creado Por (IT Owner)"
                  disabled={itOwnersLoading || itOwnersError !== null}
                  onChange={(e) => {
                    const owner = productOwners.find((o) => o.id === e.target.value);
                    if (owner) handleChange("createdBy", owner);
                  }}
                  renderValue={(value) => {
                    if (!value) return "";
                    const owner = productOwners.find((o) => o.id === value);
                    return (
                      <Typography sx={{ fontSize: "0.6875rem", lineHeight: 1.5 }}>
                        {owner?.name || ""}
                      </Typography>
                    );
                  }}
                  sx={{
                    fontSize: "0.6875rem",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.6875rem",
                      "& .MuiSelect-select": {
                        py: 0.625,
                        fontSize: "0.6875rem",
                        lineHeight: 1.5,
                      },
                      "& .MuiSelect-nativeInput": {
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
                  }}
                >
                  {itOwnersLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.625rem" }}>
                          Cargando IT Owners...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : itOwnersError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Error al cargar IT Owners
                      </Alert>
                    </MenuItem>
                  ) : productOwners.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.625rem" }}>
                        No hay IT Owners disponibles
                      </Typography>
                    </MenuItem>
                  ) : (
                    productOwners.map((owner) => (
                    <MenuItem key={owner.id} value={owner.id} sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                      {owner.name}
                    </MenuItem>
                    ))
                  )}
                </Select>
                {itOwnersError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75, fontSize: "0.625rem" }}>
                    Error al cargar IT Owners. Por favor, actualiza la página.
                  </Typography>
                )}
              </FormControl>
              </Grid>

              {/* Country */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl size="small" sx={{ minWidth: 120, width: "100%" }}>
                <InputLabel
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.875)",
                      backgroundColor: theme.palette.background.paper,
                      paddingLeft: "6px",
                      paddingRight: "6px",
                    },
                  }}
                >
                  País
                </InputLabel>
                <Select
                  value={formData.country?.id || ""}
                  label="País"
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
                  renderValue={(value) => {
                    if (!value) return "";
                    const country = countries.find((c) => c.id === value);
                    return (
                      <Typography sx={{ fontSize: "0.6875rem", lineHeight: 1.5 }}>
                        {country ? `${country.name} (${country.code})` : ""}
                      </Typography>
                    );
                  }}
                  sx={{
                    fontSize: "0.6875rem",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.6875rem",
                      "& .MuiSelect-select": {
                        py: 0.625,
                        fontSize: "0.6875rem",
                        lineHeight: 1.5,
                      },
                      "& .MuiSelect-nativeInput": {
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
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: "0.6875rem" }}>
                    <em>Ninguno</em>
                  </MenuItem>
                  {countriesLoading ? (
                    <MenuItem disabled>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.625rem" }}>
                          Cargando países...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : countriesError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Error al cargar países
                      </Alert>
                    </MenuItem>
                  ) : countries.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.625rem" }}>
                        No hay países disponibles
                      </Typography>
                    </MenuItem>
                  ) : (
                    countries.map((country) => (
                    <MenuItem key={country.id} value={country.id} sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
                      {country.name} ({country.code})
                    </MenuItem>
                    ))
                  )}
                </Select>
                {countriesError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75, fontSize: "0.625rem" }}>
                    Error al cargar países. Por favor, actualiza la página.
                  </Typography>
                )}
              </FormControl>
              </Grid>
          </Grid>

          {/* Detailed Descriptions Fields */}
          <Stack spacing={2}>
              {/* Technical Description */}
              <TextField
                fullWidth
                size="small"
                label="Descripción Técnica"
                multiline
                rows={4}
                value={formData.technicalDescription || ""}
                onChange={(e) => handleChange("technicalDescription", e.target.value)}
                placeholder="Detalles técnicos, notas de implementación..."
                required
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    transform: "translate(14px, -9px) scale(0.875)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.875)",
                      backgroundColor: theme.palette.background.paper,
                      paddingLeft: "6px",
                      paddingRight: "6px",
                      zIndex: 1,
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.75rem",
                    "& textarea": {
                      py: 0.75,
                      fontSize: "0.75rem",
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
                    marginTop: "6px",
                    marginLeft: "0px",
                    fontSize: "0.6875rem",
                  },
                }}
              />

              {/* Business Description */}
              <TextField
                fullWidth
                size="small"
                label="Descripción de Negocio"
                multiline
                rows={4}
                value={formData.businessDescription || ""}
                onChange={(e) => handleChange("businessDescription", e.target.value)}
                placeholder="Valor de negocio, beneficios para el usuario..."
                required
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    transform: "translate(14px, -9px) scale(0.875)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -9px) scale(0.875)",
                      backgroundColor: theme.palette.background.paper,
                      paddingLeft: "6px",
                      paddingRight: "6px",
                      zIndex: 1,
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.75rem",
                    "& textarea": {
                      py: 0.75,
                      fontSize: "0.75rem",
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
                    marginTop: "6px",
                    marginLeft: "0px",
                    fontSize: "0.6875rem",
                  },
                }}
              />
          </Stack>
        </Stack>
    </BaseEditDialog>
  );
}
