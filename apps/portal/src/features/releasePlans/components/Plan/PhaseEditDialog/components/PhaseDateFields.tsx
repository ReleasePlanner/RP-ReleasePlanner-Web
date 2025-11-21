import { TextField, Grid, Alert } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { useCallback } from "react";
import type { PhaseFormData, PhaseFormErrors } from "../hooks/usePhaseForm";

export type PhaseDateFieldsProps = {
  formData: PhaseFormData;
  errors: PhaseFormErrors;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

export function PhaseDateFields({
  formData,
  errors,
  onStartDateChange,
  onEndDateChange,
  onKeyDown,
}: PhaseDateFieldsProps) {
  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onStartDateChange(e.target.value);
    },
    [onStartDateChange]
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onEndDateChange(e.target.value);
    },
    [onEndDateChange]
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            size="small"
            value={formData.startDate}
            onChange={handleStartDateChange}
            onKeyDown={onKeyDown}
            error={!!errors.startDate || !!errors.dateRange}
            helperText={errors.startDate || undefined}
            slotProps={{
              inputLabel: {
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.6875rem",
              },
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "& .MuiFormHelperText-root": {
                fontSize: "0.625rem",
                mt: 0.5,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="End Date"
            type="date"
            fullWidth
            size="small"
            value={formData.endDate}
            onChange={handleEndDateChange}
            onKeyDown={onKeyDown}
            error={!!errors.endDate || !!errors.dateRange}
            helperText={errors.endDate || errors.dateRange || undefined}
            slotProps={{
              inputLabel: {
                sx: {
                  fontSize: "0.625rem",
                  fontWeight: 500,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.6875rem",
              },
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "& .MuiFormHelperText-root": {
                fontSize: "0.625rem",
                mt: 0.5,
              },
            }}
          />
        </Grid>
      </Grid>
      {errors.dateRange && (
        <Alert
          severity="error"
          icon={<ErrorIcon sx={{ fontSize: 14 }} />}
          sx={{
            borderRadius: 1.5,
            "& .MuiAlert-message": {
              fontSize: "0.6875rem",
            },
            py: 0.75,
          }}
        >
          {errors.dateRange}
        </Alert>
      )}
    </>
  );
}

