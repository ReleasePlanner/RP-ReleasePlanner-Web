import { TextField, useTheme, alpha } from "@mui/material";
import type { PlanReferenceType } from "../../../../../types";

export type DescriptionFieldProps = {
  readonly type: PlanReferenceType;
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function DescriptionField({
  type,
  value,
  onChange,
}: DescriptionFieldProps) {
  const theme = useTheme();

  const placeholder =
    type === "note"
      ? "Ingrese su nota u observación..."
      : "Descripción opcional o notas...";

  return (
    <TextField
      id="reference-description-input"
      name="referenceDescription"
      label="Descripción"
      fullWidth
      multiline
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
        "& .MuiInputBase-input": {
          fontSize: "0.875rem",
          lineHeight: 1.7,
        },
      }}
    />
  );
}

