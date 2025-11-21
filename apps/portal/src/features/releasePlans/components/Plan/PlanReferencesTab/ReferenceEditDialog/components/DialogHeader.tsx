import { DialogTitle, useTheme, alpha } from "@mui/material";

export type DialogHeaderProps = {
  readonly isCreating: boolean;
};

export function DialogHeader({ isCreating }: DialogHeaderProps) {
  const theme = useTheme();

  return (
    <DialogTitle
      sx={{
        pb: 3,
        pt: 3.5,
        px: 3,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        fontWeight: 600,
        fontSize: "1.0625rem",
        color: theme.palette.text.primary,
        letterSpacing: "-0.015em",
      }}
    >
      {isCreating ? "New Reference" : "Edit Reference"}
    </DialogTitle>
  );
}

