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
  Stack,
  Divider,
  Chip,
  useTheme,
  alpha,
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
  const theme = useTheme();
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
        {editing ? "Edit Day" : "Add New Day"}
        {calendarName && (
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
              label="Calendar"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.6875rem",
                fontWeight: 500,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              }}
            />
            {calendarName}
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
                label="Day Name"
                fullWidth
                required
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
                variant="outlined"
                size="medium"
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Date"
                type="date"
                fullWidth
                required
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
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <FormControl fullWidth required>
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
                  sx={{
                    borderRadius: 1.5,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.3),
                    },
                  }}
                >
                  <MenuItem value="holiday">Holiday</MenuItem>
                  <MenuItem value="special">Special Day</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.12) }} />

          {/* Additional Information */}
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
            <Stack spacing={2.5}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={day.description || ""}
                onChange={(e) =>
                  onDayChange({
                    ...day,
                    description: e.target.value,
                  })
                }
                placeholder="Add optional description about this day"
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                }}
              >
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
                      sx={{
                        color: theme.palette.primary.main,
                        "&.Mui-checked": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Recurring annually
                    </Typography>
                  }
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    ml: 4,
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                  }}
                >
                  Check if this day repeats every year
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
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
              bgcolor: alpha(theme.palette.action.hover, 0.08),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 600,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {editing ? "Update" : "Add"} Day
        </Button>
      </DialogActions>
    </Dialog>
  );
}
