import { Button, useTheme, alpha } from "@mui/material";

export type DialogActionsProps = {
  readonly isCreating: boolean;
  readonly isFormValid: boolean;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

export function DialogActions({
  isCreating,
  isFormValid,
  onCancel,
  onSave,
}: DialogActionsProps) {
  const theme = useTheme();

  return (
    <>
      <Button
        onClick={onCancel}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          color: theme.palette.text.secondary,
          px: 2.5,
          borderRadius: 2,
          "&:hover": {
            bgcolor: alpha(theme.palette.action.hover, 0.05),
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        variant="contained"
        disabled={!isFormValid}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          borderRadius: 2,
          px: 3.5,
          py: 0.875,
          boxShadow: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&.Mui-disabled": {
            opacity: 0.45,
          },
        }}
      >
        {isCreating ? "Add" : "Save"}
      </Button>
    </>
  );
}

