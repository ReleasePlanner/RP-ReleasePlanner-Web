import { TextField, useTheme, alpha } from "@mui/material";

export type TitleFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function TitleField({ value, onChange }: TitleFieldProps) {
  const theme = useTheme();

  return (
    <TextField
      id="reference-title-input"
      name="referenceTitle"
      label="Título"
      fullWidth
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ingrese el título de la referencia"
      variant="outlined"
      size="small"
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
      }}
    />
  );
}

