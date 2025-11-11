import { useState, useEffect } from "react";
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
} from "@mui/material";
import type { ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard";

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
  const [newVersion, setNewVersion] = useState("");
  const [versionError, setVersionError] = useState("");

  // Reset version when dialog opens/closes or component changes
  useEffect(() => {
    if (open && component) {
      setNewVersion("");
      setVersionError("");
    }
  }, [open, component]);

  if (!component) return null;

  const currentVersion = component.version || "";

  /**
   * Validates version format (semantic versioning: MAJOR.MINOR.PATCH)
   * Accepts formats like: 1.0.0, 1.0, 1, 1.0.0-beta, 1.0.0-alpha.1
   */
  const validateVersionFormat = (version: string): boolean => {
    if (!version.trim()) return true; // Empty is valid (will use current version)

    // Semantic versioning pattern: X.Y.Z or X.Y or X (with optional pre-release/build)
    const semverPattern =
      /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
    const shortPattern = /^(\d+)\.(\d+)$/;
    const singlePattern = /^(\d+)$/;

    return (
      semverPattern.test(version) ||
      shortPattern.test(version) ||
      singlePattern.test(version)
    );
  };

  /**
   * Formats version input to ensure consistency
   * Auto-formats as user types: "1" -> "1.0.0", "1.2" -> "1.2.0"
   */
  const formatVersionInput = (value: string): string => {
    // Remove any non-digit and non-dot characters except for pre-release/build identifiers
    const cleaned = value.replace(/[^\d.\-+A-Za-z]/g, "");

    // If user is typing a simple number, allow it temporarily
    if (/^\d+$/.test(cleaned)) {
      return cleaned;
    }

    // If user is typing X.Y format, allow it temporarily
    if (/^\d+\.\d+$/.test(cleaned)) {
      return cleaned;
    }

    // For full semantic version, validate format
    if (cleaned.includes(".")) {
      const parts = cleaned.split(".");
      // Limit to 3 main parts (MAJOR.MINOR.PATCH)
      if (parts.length > 3) {
        // Keep first 3 parts, join rest with dots for pre-release identifiers
        const mainParts = parts.slice(0, 3);
        const extraParts = parts.slice(3);
        return (
          mainParts.join(".") +
          (extraParts.length > 0 ? "-" + extraParts.join(".") : "")
        );
      }
    }

    return cleaned;
  };

  const handleVersionChange = (value: string) => {
    const formatted = formatVersionInput(value);
    setNewVersion(formatted);

    // Validate format
    if (formatted && !validateVersionFormat(formatted)) {
      setVersionError(
        "Invalid format. Use semantic versioning (e.g., 1.0.0 or 1.2.3)"
      );
    } else {
      setVersionError("");
    }

    // Only update component if version is valid or empty
    if (!formatted || validateVersionFormat(formatted)) {
      onComponentChange({
        ...component,
        version: formatted || currentVersion,
      });
    }
  };

  /**
   * Normalizes version to full semantic format (X.Y.Z)
   */
  const normalizeVersion = (version: string): string => {
    if (!version) return "";

    const parts = version.split(".");
    if (parts.length === 1) {
      return `${parts[0]}.0.0`;
    } else if (parts.length === 2) {
      return `${parts[0]}.${parts[1]}.0`;
    }
    return version;
  };

  const handleSave = () => {
    // Normalize version before saving if provided
    if (newVersion && validateVersionFormat(newVersion)) {
      const normalized = normalizeVersion(newVersion);
      onComponentChange({
        ...component,
        version: normalized,
      });
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
          pb: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
          {editing ? "Edit Component" : "Add Component"}
        </Typography>
        {selectedProductName && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              mt: 0.5,
              display: "block",
            }}
          >
            Product: {selectedProductName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          {/* Basic Information */}
          <Stack spacing={2}>
            <TextField
              label="Component Name"
              fullWidth
              required
              value={component.name}
              onChange={(e) => {
                onComponentChange({
                  ...component,
                  name: e.target.value,
                });
              }}
              placeholder="e.g., Web Portal"
              variant="outlined"
              size="small"
            />

            <TextField
              label="Component Type"
              fullWidth
              required
              value={component.type}
              onChange={(e) => {
                onComponentChange({
                  ...component,
                  type: e.target.value,
                });
              }}
              placeholder="e.g., web, mobile, service"
              variant="outlined"
              size="small"
            />
          </Stack>

          <Divider sx={{ my: 1 }} />

          {/* Version Control Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: theme.palette.text.primary,
              }}
            >
              Version Control
            </Typography>

            {currentVersion && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 0.5,
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
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
                    height: 24,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
            )}

            <TextField
              label="New Version"
              fullWidth
              value={newVersion}
              onChange={(e) => handleVersionChange(e.target.value)}
              placeholder={
                currentVersion
                  ? `e.g., ${incrementVersion(currentVersion)}`
                  : "e.g., 1.0.0"
              }
              helperText={
                versionError
                  ? versionError
                  : currentVersion
                  ? "Leave empty to keep current version. Format: MAJOR.MINOR.PATCH (e.g., 1.0.0)"
                  : "Enter initial version. Format: MAJOR.MINOR.PATCH (e.g., 1.0.0)"
              }
              error={!!versionError}
              variant="outlined"
              size="small"
              inputProps={{
                pattern: "\\d+(\\.\\d+)*",
                inputMode: "numeric",
              }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Description */}
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
            variant="outlined"
            size="small"
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!component.name || !component.type || !!versionError}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {editing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Helper function to suggest next version
function incrementVersion(version: string): string {
  const parts = version.split(".");
  if (parts.length >= 3) {
    const patch = parseInt(parts[2]) || 0;
    return `${parts[0]}.${parts[1]}.${patch + 1}`;
  } else if (parts.length === 2) {
    return `${parts[0]}.${parts[1]}.1`;
  } else if (parts.length === 1) {
    return `${parts[0]}.0.1`;
  }
  return "1.0.0";
}
