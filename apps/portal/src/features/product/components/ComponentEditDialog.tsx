import { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
  Stack,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard";
import { useComponentTypes } from "@/api/hooks/useComponentTypes";

interface ComponentEditDialogProps {
  open: boolean;
  editing: boolean;
  component: ComponentVersion | null;
  selectedProductName: string | null;
  onClose: () => void;
  onSave: (updatedComponent?: ComponentVersion) => void;
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
  const theme = useTheme();
  const [currentVersionInput, setCurrentVersionInput] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [currentVersionError, setCurrentVersionError] = useState("");
  const [versionError, setVersionError] = useState("");

  // Load Component Types from backend
  const { data: componentTypes = [], isLoading: componentTypesLoading, error: componentTypesError } = useComponentTypes();

  // Reset version when dialog opens/closes or component changes
  useEffect(() => {
    if (open && component) {
      // When creating, initialize both fields as empty
      // When editing, only newVersion is empty (currentVersion is shown as reference)
      if (!editing) {
        setCurrentVersionInput("");
        setNewVersion("");
      } else {
        setNewVersion("");
      }
      setCurrentVersionError("");
      setVersionError("");
    }
  }, [open, component, editing]);

  if (!component) return null;

  // Support both version formats: version (frontend) and currentVersion (backend)
  const currentVersion = component.version || (component as any).currentVersion || "";
  const previousVersion = (component as any).previousVersion || "";

  /**
   * Validates version format: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
   * Accepts formats like: 1.0.0.0, 1.2.3.4, 1.0.0 (will be normalized to 1.0.0.0)
   */
  const validateVersionFormat = (version: string): boolean => {
    if (!version.trim()) return true; // Empty is valid (will use current version)

    // Format: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
    // Accepts: 1.0.0.0, 1.2.3.4, 1.0.0 (will normalize), 1.0 (will normalize), 1 (will normalize)
    const fullPattern = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    const threePartPattern = /^(\d+)\.(\d+)\.(\d+)$/;
    const twoPartPattern = /^(\d+)\.(\d+)$/;
    const singlePattern = /^(\d+)$/;

    return (
      fullPattern.test(version) ||
      threePartPattern.test(version) ||
      twoPartPattern.test(version) ||
      singlePattern.test(version)
    );
  };

  /**
   * Formats version input to ensure consistency
   * Auto-formats as user types: "1" -> "1.0.0.0", "1.2" -> "1.2.0.0", "1.2.3" -> "1.2.3.0"
   * Format: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
   */
  const formatVersionInput = (value: string): string => {
    // Remove any non-digit and non-dot characters
    const cleaned = value.replace(/[^\d.]/g, "");

    // If user is typing a simple number, allow it temporarily
    if (/^\d+$/.test(cleaned)) {
      return cleaned;
    }

    // If user is typing X.Y format, allow it temporarily
    if (/^\d+\.\d+$/.test(cleaned)) {
      return cleaned;
    }

    // If user is typing X.Y.Z format, allow it temporarily
    if (/^\d+\.\d+\.\d+$/.test(cleaned)) {
      return cleaned;
    }

    // For full version format, limit to 4 parts (MAJOR.SUBVERSION.MINOR.PATCH)
    if (cleaned.includes(".")) {
      const parts = cleaned.split(".");
      if (parts.length > 4) {
        // Keep first 4 parts only
        return parts.slice(0, 4).join(".");
      }
    }

    return cleaned;
  };

  /**
   * Normalizes version to full format: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
   * Examples: "1" -> "1.0.0.0", "1.2" -> "1.2.0.0", "1.2.3" -> "1.2.3.0", "1.2.3.4" -> "1.2.3.4"
   * Handles edge cases: empty strings, whitespace, invalid characters
   * Never returns empty string if input contains any digits
   */
  const normalizeVersion = (version: string): string => {
    if (!version || !version.trim()) return "";

    // Clean the version: remove any non-digit and non-dot characters, trim whitespace
    const cleaned = version.trim().replace(/[^\d.]/g, "");
    if (!cleaned) return "";

    // Check if there are any digits at all
    if (!/\d/.test(cleaned)) return "";

    const parts = cleaned.split(".").filter(p => p !== ""); // Remove empty parts
    
    if (parts.length === 0) {
      // If no parts but we have digits, try to extract them
      const digits = cleaned.match(/\d+/);
      if (digits && digits[0]) {
        return `${digits[0]}.0.0.0`;
      }
      return "";
    }
    
    // Ensure all parts are valid numbers
    const numericParts = parts.map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? "0" : String(num);
    });

    // Ensure we have at least one valid numeric part
    if (numericParts.length === 0 || numericParts.every(p => p === "0" && numericParts.length === 1)) {
      // If all parts are zero or empty, but we had input, default to "0.0.0.0"
      return "0.0.0.0";
    }

    if (numericParts.length === 1) {
      return `${numericParts[0]}.0.0.0`;
    } else if (numericParts.length === 2) {
      return `${numericParts[0]}.${numericParts[1]}.0.0`;
    } else if (numericParts.length === 3) {
      return `${numericParts[0]}.${numericParts[1]}.${numericParts[2]}.0`;
    } else if (numericParts.length >= 4) {
      // Take first 4 parts only
      return `${numericParts[0]}.${numericParts[1]}.${numericParts[2]}.${numericParts[3]}`;
    }
    
    // Fallback: if we have any numeric parts, use them
    if (numericParts.length > 0 && numericParts.length < 4) {
      const base = numericParts.join(".");
      const missing = 4 - numericParts.length;
      const zeros = Array(missing).fill("0").join(".");
      return `${base}.${zeros}`;
    }
    
    return cleaned; // Last resort fallback
  };

  const handleCurrentVersionChange = (value: string) => {
    const formatted = formatVersionInput(value);
    setCurrentVersionInput(formatted);

    // Validate format - allow partial versions while typing
    if (formatted && !validateVersionFormat(formatted)) {
      setCurrentVersionError(
        "Invalid format. Use version format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0)"
      );
    } else {
      setCurrentVersionError("");
    }
  };

  const handleCurrentVersionBlur = () => {
    // Normalize version when losing focus
    if (currentVersionInput && currentVersionInput.trim()) {
      const trimmed = currentVersionInput.trim();
      
      // Always try to normalize - normalizeVersion handles partial versions like "1" -> "1.0.0.0"
      const normalized = normalizeVersion(trimmed);
      
      if (normalized) {
        // Normalization succeeded - update the field with normalized value
        setCurrentVersionInput(normalized);
        setCurrentVersionError("");
      } else {
        // Normalization failed (empty string returned) - this should only happen for truly invalid input
        // Check if the format is valid (might be partial input that normalization couldn't handle)
        if (validateVersionFormat(trimmed)) {
          // Format is valid but normalization failed - preserve input and clear error
          // This shouldn't happen, but handle it gracefully
          setCurrentVersionError("");
        } else {
          // Format is invalid - show error but preserve input so user can fix it
          setCurrentVersionError(
            "Invalid format. Use version format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0)"
          );
        }
      }
    } else {
      // Empty input - clear error (required field validation will handle empty state)
      setCurrentVersionError("");
    }
  };

  const handleVersionChange = (value: string) => {
    const formatted = formatVersionInput(value);
    setNewVersion(formatted);

    // Validate format - allow partial versions while typing
    if (formatted && !validateVersionFormat(formatted)) {
      setVersionError(
        "Invalid format. Use version format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0)"
      );
    } else {
      setVersionError("");
    }
  };

  const handleVersionBlur = () => {
    // Normalize version when losing focus (only if not empty)
    if (newVersion && newVersion.trim()) {
      const trimmed = newVersion.trim();
      
      // Always try to normalize - normalizeVersion handles partial versions like "1" -> "1.0.0.0"
      const normalized = normalizeVersion(trimmed);
      
      if (normalized) {
        // Normalization succeeded - update the field with normalized value
        setNewVersion(normalized);
        setVersionError("");
      } else {
        // Normalization failed (empty string returned) - this should only happen for truly invalid input
        // Check if the format is valid (might be partial input that normalization couldn't handle)
        if (validateVersionFormat(trimmed)) {
          // Format is valid but normalization failed - preserve input and clear error
          // This shouldn't happen, but handle it gracefully
          setVersionError("");
        } else {
          // Format is invalid - show error but preserve input so user can fix it
          setVersionError(
            "Invalid format. Use version format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0)"
          );
        }
      }
    } else {
      // Empty input - clear error (optional field, so empty is OK)
      setVersionError("");
    }
  };

  const handleSave = () => {
    // Normalize versions before saving - always normalize first, then validate
    if (!editing) {
      // Creating: normalize both versions (always normalize, even if partial)
      // normalizeVersion handles partial versions and auto-completes them
      let normalizedCurrent = "";
      let normalizedNew = "";
      
      // Normalize currentVersionInput if it exists
      // Always normalize, even if it's a partial version like "1" or "1.2"
      if (currentVersionInput && currentVersionInput.trim()) {
        normalizedCurrent = normalizeVersion(currentVersionInput.trim());
      }
      
      // Normalize newVersion if it exists
      // Always normalize, even if it's a partial version like "1" or "1.2"
      if (newVersion && newVersion.trim()) {
        normalizedNew = normalizeVersion(newVersion.trim());
      }
      
      // For new components:
      // - If newVersion is provided, it becomes the currentVersion and currentVersionInput becomes previousVersion
      // - If no newVersion but currentVersionInput exists, currentVersionInput becomes currentVersion
      // - If newVersion exists but no currentVersionInput, use newVersion for both
      const finalCurrentVersion = normalizedNew || normalizedCurrent;
      const finalPreviousVersion = normalizedNew 
        ? (normalizedCurrent || normalizedNew) // If newVersion exists, use currentVersionInput as previousVersion, or newVersion if currentVersionInput is empty
        : (normalizedCurrent || ""); // If no newVersion, use currentVersionInput as previousVersion (or empty)
      
      // Ensure we have at least a currentVersion
      // For new components, require at least one version field to be filled
      if (!finalCurrentVersion || finalCurrentVersion.trim() === '') {
        // This should not happen if validation is working, but add defensive check
        console.error('No version provided for new component', { 
          currentVersionInput, 
          newVersion, 
          normalizedCurrent, 
          normalizedNew,
          finalCurrentVersion 
        });
        // Show error on the appropriate field
        if (!currentVersionInput || currentVersionInput.trim() === '') {
          setCurrentVersionError("Current Version is required. Please enter at least a Current Version or New Version.");
        }
        if (!newVersion || newVersion.trim() === '') {
          setVersionError("At least one version field is required.");
        }
        return; // Don't save if no version
      }
      
      // Validate final versions are in correct format (after normalization)
      if (!validateVersionFormat(finalCurrentVersion)) {
        console.error('Invalid version format after normalization', { 
          finalCurrentVersion,
          normalizedCurrent,
          normalizedNew 
        });
        setCurrentVersionError("Invalid version format. Please enter a valid version (e.g., 1.0.0.0)");
        return;
      }
      
      // Clear any errors before saving
      setCurrentVersionError("");
      setVersionError("");
      
      const updatedComponent = {
        ...component,
        version: finalCurrentVersion,
        currentVersion: finalCurrentVersion,
        previousVersion: finalPreviousVersion || finalCurrentVersion, // Fallback to currentVersion if empty
        // Ensure name and type are preserved from component
        name: component.name || '',
        // Normalize type to lowercase to match enum values (web, services, mobile)
        type: component.type ? component.type.toLowerCase() : '',
        componentTypeId: (component as any).componentTypeId,
      } as any;
      
      // Validate required fields before saving
      if (!updatedComponent.name || updatedComponent.name.trim() === '') {
        setCurrentVersionError("Component name is required");
        return;
      }
      
      if (!updatedComponent.type && !updatedComponent.componentTypeId) {
        setCurrentVersionError("Component type is required");
        return;
      }
      
      // Update parent state
      onComponentChange(updatedComponent);
      
      // Pass updated component directly to onSave to avoid timing issues
      onSave(updatedComponent);
    } else {
      // Editing: if newVersion is provided, use it as new currentVersion
      const currentVer = component.version || (component as any).currentVersion || "";
      
      let updatedComponent: ComponentVersion;
      
      if (newVersion && newVersion.trim()) {
        // User entered a new version - normalize and use it
        const normalized = normalizeVersion(newVersion.trim());
        // Update the input field with normalized value for visual feedback
        if (normalized && normalized !== newVersion) {
          setNewVersion(normalized);
        }
        
        if (normalized && validateVersionFormat(normalized)) {
          setVersionError(""); // Clear error
          updatedComponent = {
            ...component,
            version: normalized,
            currentVersion: normalized,
            // Normalize type to lowercase to match enum values (web, services, mobile)
            type: component.type ? component.type.toLowerCase() : component.type,
          } as any;
          // Update parent state
          onComponentChange(updatedComponent);
          // Pass updated component directly to onSave
          onSave(updatedComponent);
        } else {
          setVersionError("Invalid version format. Please enter a valid version (e.g., 1.0.0.0)");
          return; // Don't save if invalid
        }
      } else {
        // Editing but no new version provided - keep current version
        updatedComponent = {
          ...component,
          version: currentVer,
          currentVersion: currentVer,
          // Normalize type to lowercase to match enum values (web, services, mobile)
          type: component.type ? component.type.toLowerCase() : component.type,
        } as any;
        // Update parent state
        onComponentChange(updatedComponent);
        // Pass updated component directly to onSave
        onSave(updatedComponent);
      }
    }
  };

  const isFormValid = 
    component.name && 
    component.type && 
    !versionError &&
    !currentVersionError &&
    (editing || currentVersionInput || newVersion);

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={editing}
      title={editing ? "Editar Componente" : "Nuevo Componente"}
      subtitle={
        selectedProductName
          ? `Producto: ${selectedProductName}`
          : editing
          ? "Modifica los detalles del componente"
          : "Agrega un nuevo componente al producto"
      }
      maxWidth="sm"
      onSave={handleSave}
      saveButtonText={editing ? "Guardar Cambios" : "Crear Componente"}
      isFormValid={isFormValid}
    >
      <Stack spacing={3}>
        {/* Component Name */}
        <Box sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Nombre del Componente"
            placeholder="Ej: Web Portal"
            value={component.name || ""}
            onChange={(e) => {
              onComponentChange({
                ...component,
                name: e.target.value,
              });
            }}
            required
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
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
                "& input": {
                  py: 0.75,
                  fontSize: "0.75rem",
                },
                "& .MuiSelect-select": {
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
              },
            }}
          />
        </Box>

        {/* Component Type */}
          <FormControl fullWidth required size="medium">
            <InputLabel
              shrink
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                transform: "translate(14px, -9px) scale(0.875)",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.875)",
                  backgroundColor: theme.palette.background.paper,
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  zIndex: 1,
                },
              }}
            >
              Tipo de Componente
            </InputLabel>
            <Select
              value={(() => {
                // If componentTypeId exists and is a valid UUID, use it
                if ((component as any).componentTypeId && 
                    typeof (component as any).componentTypeId === 'string' &&
                    (component as any).componentTypeId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                  return (component as any).componentTypeId;
                }
                // Otherwise, try to find ComponentType by code or name
                if (component.type) {
                  const foundType = componentTypes.find(
                    (ct) => ct.code?.toLowerCase() === component.type?.toLowerCase() ||
                            ct.name?.toLowerCase() === component.type?.toLowerCase()
                  );
                  if (foundType) {
                    return foundType.id;
                  }
                }
                return "";
              })()}
              label="Tipo de Componente"
              disabled={componentTypesLoading || componentTypesError !== null}
              onChange={(e) => {
                const selectedType = componentTypes.find((ct) => ct.id === e.target.value);
                if (selectedType) {
                  // Normalize type to lowercase to match enum values (web, services, mobile)
                  const normalizedType = (selectedType.code || selectedType.name || '').toLowerCase();
                  onComponentChange({
                    ...component,
                    type: normalizedType,
                    componentTypeId: selectedType.id,
                  } as any);
                }
              }}
              sx={{
                fontSize: "0.75rem",
                "& input": {
                  py: 0.75,
                  fontSize: "0.75rem",
                },
                "& .MuiSelect-select": {
                  py: 0.75,
                  fontSize: "0.75rem",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              }}
              renderValue={(value) => {
                if (!value) return "";
                const selectedType = componentTypes.find((ct) => ct.id === value);
                return selectedType?.name || value;
              }}
            >
              {componentTypesLoading ? (
                <MenuItem disabled>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.6875rem" }}>
                      Cargando tipos de componente...
                    </Typography>
                  </Box>
                </MenuItem>
              ) : componentTypesError ? (
                <MenuItem disabled>
                  <Alert severity="error" sx={{ width: "100%" }}>
                    Error al cargar los tipos de componente
                  </Alert>
                </MenuItem>
              ) : componentTypes.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.6875rem" }}>
                    No hay tipos de componente disponibles
                  </Typography>
                </MenuItem>
              ) : (
                componentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id} sx={{ fontSize: "0.6875rem" }}>
                    {type.name} {type.code && `(${type.code})`}
                  </MenuItem>
                ))
              )}
            </Select>
            {componentTypesError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                Error al cargar los tipos de componente. Por favor, actualiza la página.
              </Typography>
            )}
          </FormControl>

          {/* Version Control Fields */}

            {editing ? (
              // When editing: show current version as reference, allow entering new version
              <>
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {currentVersion && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.16
                        )}`,
                        transition: theme.transitions.create(['background-color', 'border-color']),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 1,
                          color: theme.palette.text.secondary,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Current Version
                      </Typography>
                      <Chip
                        label={currentVersion}
                        size="small"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          height: 26,
                          fontSize: "0.6875rem",
                          px: 1,
                        }}
                      />
                    </Box>
                  )}
                  
                  {previousVersion && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        border: `1px solid ${alpha(
                          theme.palette.info.main,
                          0.16
                        )}`,
                        transition: theme.transitions.create(['background-color', 'border-color']),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 1,
                          color: theme.palette.text.secondary,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Previous Version
                      </Typography>
                      <Chip
                        label={previousVersion}
                        size="small"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 500,
                          bgcolor: theme.palette.info.main,
                          color: theme.palette.info.contrastText,
                          height: 26,
                          fontSize: "0.6875rem",
                          px: 1,
                        }}
                      />
                    </Box>
                  )}
                </Stack>

                <TextField
                  label="Nueva Versión"
                  fullWidth
                  size="small"
                  value={newVersion}
                  onChange={(e) => handleVersionChange(e.target.value)}
                  onBlur={handleVersionBlur}
                  placeholder={currentVersion ? `Ej: ${incrementVersion(currentVersion)}` : "Ej: 1.0.0.0"}
                  helperText={
                    versionError
                      ? versionError
                      : currentVersion
                      ? `Ingresa una nueva versión (actual: ${currentVersion}). Deja vacío para mantener la versión actual. Formato: MAJOR.SUBVERSION.MINOR.PATCH (ej: 1.0.0.0). Versiones parciales como '1' o '1.2' se completarán automáticamente.`
                      : "Ingresa una nueva versión. Formato: MAJOR.SUBVERSION.MINOR.PATCH (ej: 1.0.0.0). Versiones parciales como '1' o '1.2' se completarán automáticamente."
                  }
                  error={!!versionError}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: "0.75rem",
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
                      "& input": {
                        py: 0.75,
                        fontSize: "0.75rem",
                      },
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: versionError ? theme.palette.error.main : theme.palette.primary.main,
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                          borderColor: versionError ? theme.palette.error.main : theme.palette.primary.main,
                        },
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      marginTop: "6px",
                      marginLeft: "0px",
                      fontSize: "0.6875rem",
                    },
                  }}
                  inputProps={{
                    pattern: "\\d+(\\.\\d+)*",
                    inputMode: "numeric",
                  }}
                />
              </>
            ) : (
              // When creating: show two fields for Current Version and New Version
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Versión Actual"
                    fullWidth
                    size="small"
                    required
                    value={currentVersionInput}
                    onChange={(e) => handleCurrentVersionChange(e.target.value)}
                    onBlur={handleCurrentVersionBlur}
                    placeholder="Ej: 1.0.0.0"
                    helperText={
                      currentVersionError
                        ? currentVersionError
                        : "Formato: MAJOR.SUBVERSION.MINOR.PATCH"
                    }
                    error={!!currentVersionError}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: "0.75rem",
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
                        "& input": {
                          py: 0.75,
                          fontSize: "0.75rem",
                        },
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: currentVersionError ? theme.palette.error.main : theme.palette.primary.main,
                          },
                        },
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 2,
                            borderColor: currentVersionError ? theme.palette.error.main : theme.palette.primary.main,
                          },
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        marginTop: "6px",
                        marginLeft: "0px",
                        fontSize: "0.6875rem",
                      },
                    }}
                    inputProps={{
                      pattern: "\\d+(\\.\\d+)*",
                      inputMode: "numeric",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Nueva Versión"
                    fullWidth
                    size="small"
                    value={newVersion}
                    onChange={(e) => handleVersionChange(e.target.value)}
                    onBlur={handleVersionBlur}
                    placeholder="Ej: 1.0.0.1"
                    helperText={
                      versionError
                        ? versionError
                        : "Opcional: Si está vacío, se usará la versión actual"
                    }
                    error={!!versionError}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: "0.75rem",
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon
                            sx={{
                              fontSize: 18,
                              color: versionError ? theme.palette.error.main : theme.palette.text.secondary,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.75rem",
                        "& input": {
                          py: 0.75,
                          fontSize: "0.75rem",
                        },
                        "&:hover": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: versionError ? theme.palette.error.main : theme.palette.primary.main,
                          },
                        },
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 2,
                            borderColor: versionError ? theme.palette.error.main : theme.palette.primary.main,
                          },
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        marginTop: "6px",
                        marginLeft: "0px",
                        fontSize: "0.6875rem",
                      },
                    }}
                    inputProps={{
                      pattern: "\\d+(\\.\\d+)*",
                      inputMode: "numeric",
                    }}
                  />
                </Grid>
              </Grid>
            )}

          {/* Description */}
          <TextField
            fullWidth
            size="small"
            label="Descripción"
            multiline
            rows={3}
            value={component.description || ""}
            onChange={(e) => {
              onComponentChange({
                ...component,
                description: e.target.value,
              });
            }}
            placeholder="Breve descripción del componente..."
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                  <DescriptionIcon
                    sx={{
                      fontSize: 18,
                      color: theme.palette.text.secondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.75rem",
                "& input": {
                  py: 0.75,
                  fontSize: "0.75rem",
                },
                "& .MuiSelect-select": {
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
              },
            }}
          />
        </Stack>
    </BaseEditDialog>
  );
}

// Helper function to suggest next version (increments PATCH: MAJOR.SUBVERSION.MINOR.PATCH)
function incrementVersion(version: string): string {
  const parts = version.split(".");
  if (parts.length >= 4) {
    const patch = parseInt(parts[3]) || 0;
    return `${parts[0]}.${parts[1]}.${parts[2]}.${patch + 1}`;
  } else if (parts.length === 3) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.1`;
  } else if (parts.length === 2) {
    return `${parts[0]}.${parts[1]}.0.1`;
  } else if (parts.length === 1) {
    return `${parts[0]}.0.0.1`;
  }
  return "1.0.0.0";
}
