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
import type { PlanMilestone } from "../../types";

interface MilestoneEditDialogProps {
  readonly open: boolean;
  readonly date: string | null;
  readonly milestone: PlanMilestone | null;
  readonly onClose: () => void;
  readonly onSave: (milestone: PlanMilestone) => void;
  readonly onDelete?: (milestoneId: string) => void;
}

export function MilestoneEditDialog({
  open,
  date,
  milestone,
  onClose,
  onSave,
  onDelete,
}: MilestoneEditDialogProps) {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      if (milestone) {
        setName(milestone.name);
        setDescription(milestone.description || "");
      } else {
        setName("");
        setDescription("");
      }
    }
  }, [open, milestone]);

  const handleSave = () => {
    if (!name.trim() || !date) return;

    const milestoneToSave: PlanMilestone = {
      id: milestone?.id || `milestone-${Date.now()}`,
      date: date,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    onSave(milestoneToSave);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const handleDelete = () => {
    if (milestone && onDelete) {
      onDelete(milestone.id);
      handleClose();
    }
  };

  if (!date) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          {milestone ? "Edit Milestone" : "Create Milestone"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              Date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontWeight: 600,
                color: theme.palette.info.main,
              }}
            >
              {date}
            </Typography>
          </Box>

          <TextField
            id="milestone-name-input"
            name="milestoneName"
            label="Milestone Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Release Date, Go-Live, Phase Completion"
            variant="outlined"
            size="small"
          />

          <TextField
            id="milestone-description-input"
            name="milestoneDescription"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            variant="outlined"
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          justifyContent: milestone ? "space-between" : "flex-end",
        }}
      >
        {milestone && onDelete && (
          <Button
            onClick={handleDelete}
            color="error"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!name.trim()}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {milestone ? "Update" : "Create"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
