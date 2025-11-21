import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  alpha,
  Box,
} from "@mui/material";
import type { PlanComponent } from "../../../../../types";
import { CurrentVersionDisplay, VersionTextField } from "./components";
import { useVersionForm } from "./hooks";

export type ComponentVersionEditDialogProps = {
  readonly open: boolean;
  readonly component: PlanComponent | null;
  readonly currentVersion: string;
  readonly onClose: () => void;
  readonly onSave: (component: PlanComponent) => void;
};

export function ComponentVersionEditDialog({
  open,
  component,
  currentVersion,
  onClose,
  onSave,
}: ComponentVersionEditDialogProps) {
  const theme = useTheme();
  const { finalVersion, versionError, handleVersionChange, validateForm } = useVersionForm(
    open,
    component,
    currentVersion
  );

  const handleSave = () => {
    if (!component || !finalVersion) return;

    if (!validateForm()) {
      return;
    }

    onSave({
      ...component,
      finalVersion,
    });
  };

  if (!component) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
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
          Edit New Version
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentVersion && <CurrentVersionDisplay currentVersion={currentVersion} />}

          <VersionTextField value={finalVersion} error={versionError} onChange={handleVersionChange} />
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

