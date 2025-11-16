import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
} from "@mui/material";
import type { ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard";
import { useComponentTypes } from "@/api/hooks/useComponentTypes";

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
      if (!finalCurrentVersion) {
        // This should not happen if validation is working, but add defensive check
        console.error('No version provided for new component', { 
          currentVersionInput, 
          newVersion, 
          normalizedCurrent, 
          normalizedNew,
          finalCurrentVersion 
        });
        setCurrentVersionError("Current Version is required");
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
      
      onComponentChange({
        ...component,
        version: finalCurrentVersion,
        currentVersion: finalCurrentVersion,
        previousVersion: finalPreviousVersion || finalCurrentVersion, // Fallback to currentVersion if empty
      } as any);
    } else {
      // Editing: if newVersion is provided, use it as new currentVersion
      const currentVer = component.version || (component as any).currentVersion || "";
      
      if (newVersion && newVersion.trim()) {
        // User entered a new version - normalize and use it
        const normalized = normalizeVersion(newVersion.trim());
        // Update the input field with normalized value for visual feedback
        if (normalized && normalized !== newVersion) {
          setNewVersion(normalized);
        }
        
        if (normalized && validateVersionFormat(normalized)) {
          setVersionError(""); // Clear error
          onComponentChange({
            ...component,
            version: normalized,
            currentVersion: normalized,
          } as any);
        } else {
          setVersionError("Invalid version format. Please enter a valid version (e.g., 1.0.0.0)");
          return; // Don't save if invalid
        }
      } else {
        // Editing but no new version provided - keep current version
        onComponentChange({
          ...component,
          version: currentVer,
          currentVersion: currentVer,
        } as any);
      }
    }
    onSave();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
        {editing ? "Edit Component" : "Add Component"}
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
                label="Component Name"
                fullWidth
                required
                value={component.name || ""}
                onChange={(e) => {
                  onComponentChange({
                    ...component,
                    name: e.target.value,
                  });
                }}
                placeholder="e.g., Web Portal"
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <FormControl fullWidth required>
                <InputLabel>Component Type</InputLabel>
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
                  label="Component Type"
                  size="medium"
                  disabled={componentTypesLoading || componentTypesError !== null}
                  onChange={(e) => {
                    const selectedType = componentTypes.find((ct) => ct.id === e.target.value);
                    if (selectedType) {
                      onComponentChange({
                        ...component,
                        type: selectedType.code || selectedType.name,
                        componentTypeId: selectedType.id,
                      } as any);
                    }
                  }}
                  sx={{
                    borderRadius: 1.5,
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
                        <Typography variant="body2" color="text.secondary">
                          Loading Component Types...
                        </Typography>
                      </Box>
                    </MenuItem>
                  ) : componentTypesError ? (
                    <MenuItem disabled>
                      <Alert severity="error" sx={{ width: "100%" }}>
                        Failed to load Component Types
                      </Alert>
                    </MenuItem>
                  ) : componentTypes.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No Component Types available
                      </Typography>
                    </MenuItem>
                  ) : (
                    componentTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name} {type.code && `(${type.code})`}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {componentTypesError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    Error loading Component Types. Please refresh the page.
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Version Control Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2.5,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Version Control
            </Typography>

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
                        size="medium"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          height: 32,
                          fontSize: "0.875rem",
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
                        size="medium"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 500,
                          bgcolor: theme.palette.info.main,
                          color: theme.palette.info.contrastText,
                          height: 32,
                          fontSize: "0.875rem",
                          px: 1,
                        }}
                      />
                    </Box>
                  )}
                </Stack>

                <TextField
                  label="New Version"
                  fullWidth
                  value={newVersion}
                  onChange={(e) => handleVersionChange(e.target.value)}
                  onBlur={handleVersionBlur}
                  placeholder={currentVersion ? `e.g., ${incrementVersion(currentVersion)}` : "e.g., 1.0.0.0"}
                  helperText={
                    versionError
                      ? versionError
                      : currentVersion
                      ? `Enter a new version (current: ${currentVersion}). Leave empty to keep current version. Format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0). Partial versions like '1' or '1.2' will be auto-completed.`
                      : "Enter a new version. Format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0). Partial versions like '1' or '1.2' will be auto-completed."
                  }
                  error={!!versionError}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
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
              <Stack spacing={2.5}>
                <TextField
                  label="Current Version"
                  fullWidth
                  required
                  value={currentVersionInput}
                  onChange={(e) => handleCurrentVersionChange(e.target.value)}
                  onBlur={handleCurrentVersionBlur}
                  placeholder="e.g., 1.0.0.0"
                  helperText={
                    currentVersionError
                      ? currentVersionError
                      : "Enter the current version. Format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0). Partial versions like '1' or '1.2' will be auto-completed."
                  }
                  error={!!currentVersionError}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                  inputProps={{
                    pattern: "\\d+(\\.\\d+)*",
                    inputMode: "numeric",
                  }}
                />

                <TextField
                  label="New Version"
                  fullWidth
                  value={newVersion}
                  onChange={(e) => handleVersionChange(e.target.value)}
                  onBlur={handleVersionBlur}
                  placeholder="e.g., 1.0.0.1"
                  helperText={
                    versionError
                      ? versionError
                      : "Optional: Enter a new version to update to. If empty, Current Version will be used. Format: MAJOR.SUBVERSION.MINOR.PATCH (e.g., 1.0.0.0). Partial versions like '1' or '1.2' will be auto-completed."
                  }
                  error={!!versionError}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                  inputProps={{
                    pattern: "\\d+(\\.\\d+)*",
                    inputMode: "numeric",
                  }}
                />
              </Stack>
            )}
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Description */}
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
              Additional Information
            </Typography>
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
              placeholder="Brief description of the component..."
              variant="outlined"
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
              }}
            />
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
            !component.name || 
            !component.type || 
            !!versionError ||
            !!currentVersionError ||
            (!editing && !currentVersionInput) // Require currentVersion when creating
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
          {editing ? "Update Component" : "Create Component"}
        </Button>
      </DialogActions>
    </Dialog>
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
