import { Box, TextField, Typography, Stack, useTheme, alpha } from "@mui/material";

export type PeriodFieldProps = {
  readonly startDate: string;
  readonly endDate: string;
  readonly formattedDateRange: string;
  readonly duration: number;
  readonly onStartDateChange: (value: string) => void;
  readonly onEndDateChange: (value: string) => void;
  readonly onStartDateBlur: (value: string) => void;
  readonly onEndDateBlur: (value: string) => void;
};

export function PeriodField({
  startDate,
  endDate,
  formattedDateRange,
  duration,
  onStartDateChange,
  onEndDateChange,
  onStartDateBlur,
  onEndDateBlur,
}: PeriodFieldProps) {
  const theme = useTheme();

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      fontSize: "0.6875rem",
      bgcolor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.background.paper, 0.5)
          : "background.paper",
      "& input": {
        py: 0.625,
      },
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.2),
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.4),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1.5,
      },
    },
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          mb: 0.5,
          display: "block",
        }}
      >
        Period <span style={{ color: theme.palette.error.main }}>*</span>
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          id="plan-start-date-input"
          name="planStartDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          onBlur={(e) => onStartDateBlur(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={commonTextFieldStyles}
        />
        <TextField
          id="plan-end-date-input"
          name="planEndDate"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          onBlur={(e) => onEndDateBlur(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={commonTextFieldStyles}
        />
      </Stack>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.625rem",
          color: theme.palette.text.secondary,
          mt: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: 400,
        }}
      >
        <span>{formattedDateRange}</span>
        <span>•</span>
        <span>
          {duration} {duration === 1 ? "day" : "days"}
        </span>
      </Typography>
    </Box>
  );
}

