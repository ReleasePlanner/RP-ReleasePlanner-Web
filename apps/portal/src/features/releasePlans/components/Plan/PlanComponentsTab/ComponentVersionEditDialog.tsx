import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  useTheme,
  alpha,
  Box,
} from "@mui/material";
import type { PlanComponent } from "@/features/releasePlans/types";

interface ComponentVersionEditDialogProps {
  open: boolean;
  component: PlanComponent | null;
  currentVersion: string;
  onClose: () => void;
  onSave: (component: PlanComponent) => void;
}

export function ComponentVersionEditDialog({
  open,
  component,
  currentVersion,
  onClose,
  onSave,
}: ComponentVersionEditDialogProps) {
  const theme = useTheme();
  const [finalVersion, setFinalVersion] = useState("");
  const [versionError, setVersionError] = useState("");

  useEffect(() => {
    if (open && component) {
      setFinalVersion(component.finalVersion);
      setVersionError("");
    }
  }, [open, component]);

  const validateVersionFormat = (version: string): boolean => {
    if (!version.trim()) return false;
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
   * Normalizes version to full format for comparison: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
   */
  const normalizeVersion = (version: string): string => {
    if (!version || version.trim().length === 0) return "0.0.0.0";
    const parts = version.trim().split(".").map((p) => parseInt(p, 10) || 0);
    while (parts.length < 4) {
      parts.push(0);
    }
    return parts.slice(0, 4).join(".");
  };

  /**
   * Compares two semantic versions
   * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
   */
  const compareVersions = (v1: string, v2: string): number => {
    const normalized1 = normalizeVersion(v1);
    const normalized2 = normalizeVersion(v2);
    const parts1 = normalized1.split(".").map((p) => parseInt(p, 10));
    const parts2 = normalized2.split(".").map((p) => parseInt(p, 10));

    for (let i = 0; i < 4; i++) {
      if (parts1[i] < parts2[i]) return -1;
      if (parts1[i] > parts2[i]) return 1;
    }
    return 0;
  };

  const handleVersionChange = (value: string) => {
    const cleaned = value.replace(/[^\d.\-+A-Za-z]/g, "");
    setFinalVersion(cleaned);

    if (cleaned && !validateVersionFormat(cleaned)) {
      setVersionError("Formato inválido. Use versionado semántico (ej: 1.0.0)");
      return;
    }

    // Validate that finalVersion is greater than currentVersion
    if (cleaned && currentVersion) {
      const comparison = compareVersions(cleaned, currentVersion);
      if (comparison <= 0) {
        setVersionError(`La versión final debe ser mayor que la versión actual (${currentVersion})`);
        return;
      }
    }

    setVersionError("");
  };

  const handleSave = () => {
    if (!component || !finalVersion) return;

    // Validate format
    if (!validateVersionFormat(finalVersion)) {
      setVersionError("Formato inválido. Use versionado semántico (ej: 1.0.0)");
      return;
    }

    // Validate that finalVersion is greater than currentVersion
    if (currentVersion) {
      const comparison = compareVersions(finalVersion, currentVersion);
      if (comparison <= 0) {
        setVersionError(`La versión final debe ser mayor que la versión actual (${currentVersion})`);
        return;
      }
    }

    if (!versionError) {
      onSave({
        ...component,
        finalVersion,
      });
    }
  };

  if (!component) return null;

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
          Edit Final Version
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentVersion && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.info.main, 0.06),
                border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
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
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                  color: theme.palette.info.main,
                }}
              >
                {currentVersion}
              </Typography>
            </Box>
          )}

          <TextField
            id="component-final-version-input"
            name="componentFinalVersion"
            label="Final Version"
            fullWidth
            required
            value={finalVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            placeholder="e.g., 1.0.0"
            error={!!versionError}
            helperText={
              versionError ||
              "Enter the final version that will be used in this release plan"
            }
            variant="outlined"
            size="small"
            inputProps={{
              pattern: "\\d+(\\.\\d+)*",
              inputMode: "numeric",
            }}
          />
        </Box>
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
          disabled={!finalVersion || !!versionError}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
