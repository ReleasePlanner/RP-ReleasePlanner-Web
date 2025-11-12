/**
 * PhaseEditDialog Component
 *
 * Minimalist dialog for creating and editing phases
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import type { PlanPhase } from "../../types";
import {
  getCurrentDateUTC,
  utcToLocalDate,
  localDateToUTC,
  addDays,
} from "../../lib/date";

export interface PhaseEditDialogProps {
  open: boolean;
  phase: PlanPhase | null;
  onClose: () => void;
  onSave: (phase: PlanPhase) => void;
}

export function PhaseEditDialog({
  open,
  phase,
  onClose,
  onSave,
}: PhaseEditDialogProps) {
  const theme = useTheme();
  const isNew = !phase?.id || phase.id.startsWith("new-");

  const [formData, setFormData] = useState<Partial<PlanPhase>>({
    name: "",
    startDate: "",
    endDate: "",
    color: "#185ABD",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    dateRange?: string;
  }>({});

  useEffect(() => {
    if (open && phase) {
      // Convert UTC dates to local for display in inputs
      setFormData({
        name: phase.name || "",
        startDate: phase.startDate ? utcToLocalDate(phase.startDate) : "",
        endDate: phase.endDate ? utcToLocalDate(phase.endDate) : "",
        color: phase.color || "#185ABD",
      });
      setErrors({});
    } else if (open && !phase) {
      // New phase defaults - use UTC dates, convert to local for input
      const todayUTC = getCurrentDateUTC();
      const weekLaterUTC = addDays(
        new Date(Date.UTC(
          parseInt(todayUTC.split("-")[0]),
          parseInt(todayUTC.split("-")[1]) - 1,
          parseInt(todayUTC.split("-")[2])
        )),
        7
      ).toISOString().slice(0, 10);
      // Convert to local for display in input
      setFormData({
        name: "",
        startDate: utcToLocalDate(todayUTC),
        endDate: utcToLocalDate(weekLaterUTC),
        color: "#185ABD",
      });
      setErrors({});
    }
  }, [open, phase]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Phase name is required";
    }

    if (formData.startDate && formData.endDate) {
      if (formData.endDate < formData.startDate) {
        newErrors.dateRange = "End date must be after or equal to start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Convert local dates back to UTC before saving
    const savedPhase: PlanPhase = {
      id: phase?.id || `phase-${Date.now()}`,
      name: formData.name?.trim() || "",
      startDate: formData.startDate ? localDateToUTC(formData.startDate) : "",
      endDate: formData.endDate ? localDateToUTC(formData.endDate) : "",
      color: formData.color,
    };

    onSave(savedPhase);
    onClose();
  };

  const handleChange = (field: keyof PlanPhase, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear related errors
    if (field === "name" && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
    if ((field === "startDate" || field === "endDate") && errors.dateRange) {
      setErrors((prev) => ({ ...prev, dateRange: undefined }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 2,
          px: 3,
          fontSize: "1.125rem",
          fontWeight: 600,
          letterSpacing: "0.01em",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {isNew ? "Create New Phase" : "Edit Phase"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Phase Name */}
          <TextField
            label="Phase Name"
            fullWidth
            size="small"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name || " "}
            autoFocus
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "0.875rem",
                letterSpacing: "0.01em",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.875rem",
                letterSpacing: "0.01em",
              },
            }}
          />

          {/* Date Range */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.01em",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.01em",
                },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateRange}
              helperText={errors.dateRange || " "}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.01em",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.01em",
                },
              }}
            />
          </Box>

          {/* Color Picker */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 32,
                borderRadius: 1,
                bgcolor: formData.color,
                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                flexShrink: 0,
              }}
            />
            <TextField
              label="Color"
              type="color"
              size="small"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.01em",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.875rem",
                  letterSpacing: "0.01em",
                },
                "& input[type='color']": {
                  height: 32,
                  cursor: "pointer",
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            color: theme.palette.text.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name?.trim()}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            letterSpacing: "0.01em",
            px: 3,
            boxShadow: "none",
            "&:hover": {
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.24)}`,
            },
          }}
        >
          {isNew ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
