import { Box, TextField, Typography, useTheme, alpha } from "@mui/material";

export type PlanNameFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: (value: string) => void;
};

export function PlanNameField({
  value,
  onChange,
  onBlur,
}: PlanNameFieldProps) {
  const theme = useTheme();

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
        Plan Name <span style={{ color: theme.palette.error.main }}>*</span>
      </Typography>
      <TextField
        id="plan-name-input"
        name="planName"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        placeholder="Plan name..."
        variant="outlined"
        size="small"
        sx={{
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
        }}
      />
    </Box>
  );
}

