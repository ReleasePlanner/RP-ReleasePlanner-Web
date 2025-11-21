import { TextField, useTheme, alpha } from "@mui/material";

export type UrlFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error?: string;
};

export function UrlField({ value, onChange, error }: UrlFieldProps) {
  const theme = useTheme();

  return (
    <TextField
      id="reference-url-input"
      name="referenceUrl"
      label="URL"
      fullWidth
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://ejemplo.com"
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error || "Debe comenzar con http:// o https://"}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          transition: "all 0.2s ease",
          "&:hover fieldset": {
            borderColor: alpha(theme.palette.primary.main, 0.5),
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
        },
        "& .MuiFormHelperText-root": {
          fontSize: "0.6875rem",
          mt: 0.75,
        },
      }}
    />
  );
}

