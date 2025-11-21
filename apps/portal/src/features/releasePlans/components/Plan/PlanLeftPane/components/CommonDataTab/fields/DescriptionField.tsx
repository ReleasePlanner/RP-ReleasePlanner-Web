import { Box, TextField, Typography, useTheme, alpha } from "@mui/material";

export type DescriptionFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBlur: (value: string) => void;
};

export function DescriptionField({
  value,
  onChange,
  onBlur,
}: DescriptionFieldProps) {
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
        Description
      </Typography>
      <TextField
        id="plan-description-input"
        name="planDescription"
        fullWidth
        multiline
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        placeholder="Release plan description..."
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: "0.6875rem",
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.5)
                : "background.paper",
            "& textarea": {
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

