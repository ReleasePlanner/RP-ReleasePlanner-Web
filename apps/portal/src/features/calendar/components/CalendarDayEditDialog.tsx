/**
 * CalendarDayEditDialog Component
 *
 * Dialog for creating and editing calendar days
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import type { CalendarDay } from "../types";

interface CalendarDayEditDialogProps {
  open: boolean;
  editing: boolean;
  day: CalendarDay | null;
  calendarName: string | null;
  onClose: () => void;
  onSave: () => void;
  onDayChange: (day: CalendarDay) => void;
}

export function CalendarDayEditDialog({
  open,
  editing,
  day,
  calendarName,
  onClose,
  onSave,
  onDayChange,
}: CalendarDayEditDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  if (!day) return null;

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!day.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!day.date) {
      newErrors.date = "Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? "Edit Day" : "Add New Day"}
        {calendarName && (
          <Typography variant="body2" color="text.secondary">
            Calendar: {calendarName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        {/* Name */}
        <TextField
          label="Day Name"
          fullWidth
          value={day.name}
          onChange={(e) =>
            onDayChange({
              ...day,
              name: e.target.value,
            })
          }
          error={!!errors.name}
          helperText={errors.name}
          placeholder="e.g., New Year's Day, Company Anniversary"
        />

        {/* Date */}
        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={day.date}
          onChange={(e) =>
            onDayChange({
              ...day,
              date: e.target.value,
            })
          }
          error={!!errors.date}
          helperText={errors.date}
        />

        {/* Type */}
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={day.type}
            label="Type"
            onChange={(e) =>
              onDayChange({
                ...day,
                type: e.target.value as "holiday" | "special",
              })
            }
          >
            <MenuItem value="holiday">Holiday</MenuItem>
            <MenuItem value="special">Special Day</MenuItem>
          </Select>
        </FormControl>

        {/* Description */}
        <TextField
          label="Description (Optional)"
          fullWidth
          multiline
          rows={3}
          value={day.description || ""}
          onChange={(e) =>
            onDayChange({
              ...day,
              description: e.target.value,
            })
          }
          placeholder="Add optional description"
        />

        {/* Recurring */}
        <Box sx={{ pt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={day.recurring}
                onChange={(e) =>
                  onDayChange({
                    ...day,
                    recurring: e.target.checked,
                  })
                }
              />
            }
            label="Recurring annually"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", ml: 4 }}
          >
            Check if this day repeats every year
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {editing ? "Update" : "Add"} Day
        </Button>
      </DialogActions>
    </Dialog>
  );
}
