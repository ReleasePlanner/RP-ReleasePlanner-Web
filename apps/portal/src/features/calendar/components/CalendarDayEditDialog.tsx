/**
 * CalendarDayEditDialog Component
 *
 * Dialog for creating and editing calendar days
 */

import { useState, useEffect } from "react";
import {
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
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
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={editing}
      title={editing ? "Edit Day" : "New Day"}
      subtitle={calendarName || undefined}
      subtitleChip={calendarName ? "Calendar" : undefined}
      maxWidth="sm"
      onSave={handleSave}
      saveButtonText={editing ? "Update Day" : "Add Day"}
      isFormValid={!!day.name.trim() && !!day.date}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        {/* Spacer to ensure controls are below header divider */}
        <Box sx={{ pt: 1 }} />
        
        {/* Day Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Day Name"
          placeholder="e.g., New Year's Day, Company Anniversary"
          value={day.name}
          onChange={(e) =>
            onDayChange({
              ...day,
              name: e.target.value,
            })
          }
          error={!!errors.name}
          helperText={errors.name}
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
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

        {/* Date */}
        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          value={day.date}
          onChange={(e) =>
            onDayChange({
              ...day,
              date: e.target.value,
            })
          }
          error={!!errors.date}
          helperText={errors.date}
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

        {/* Type */}
        <FormControl fullWidth required size="small">
          <InputLabel
            sx={{
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            }}
          >
            Type
          </InputLabel>
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
              fontSize: "0.6875rem",
              "& .MuiSelect-select": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
            }}
          >
            <MenuItem value="holiday" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
              Holiday
            </MenuItem>
            <MenuItem value="special" sx={{ fontSize: "0.6875rem", py: 0.5, minHeight: 32 }}>
              Special Day
            </MenuItem>
          </Select>
        </FormControl>

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          size="small"
          value={day.description || ""}
          onChange={(e) =>
            onDayChange({
              ...day,
              description: e.target.value,
            })
          }
          placeholder="Add optional description about this day"
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
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

        {/* Recurring Checkbox */}
        <Box
          sx={{
            p: 1.5,
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
                size="small"
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
                  fontSize: "0.6875rem",
                }}
              >
                Recurring annually
              </Typography>
            }
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              ml: 4,
              fontSize: "0.625rem",
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
            }}
          >
            Check if this day repeats every year
          </Typography>
        </Box>
      </Stack>
    </BaseEditDialog>
  );
}
