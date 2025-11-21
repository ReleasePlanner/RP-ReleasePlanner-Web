import { TextField, useTheme, alpha } from "@mui/material";

export type MilestoneDescriptionFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export function MilestoneDescriptionField({
  value,
  onChange,
}: MilestoneDescriptionFieldProps) {
  const theme = useTheme();

  return (
    <TextField
      id="milestone-description-input"
      name="milestoneDescription"
      label="Descripción"
      fullWidth
      required
      multiline
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Describa el hito y su importancia..."
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
          py: 1.25,
        },
        "& .MuiInputBase-inputMultiline": {
          py: 1.25,
        },
      }}
    />
  );
}

