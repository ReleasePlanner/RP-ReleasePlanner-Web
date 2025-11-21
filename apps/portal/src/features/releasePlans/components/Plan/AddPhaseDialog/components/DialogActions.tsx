import { Button, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

function getSubmitButtonText(tabValue: number, selectedCount: number): string {
  if (tabValue === 0) {
    return `Add ${selectedCount} Phase${selectedCount !== 1 ? "s" : ""}`;
  }
  return "Create Phase";
}

export type DialogActionsProps = {
  readonly tabValue: number;
  readonly selectedCount: number;
  readonly canSubmit: boolean;
  readonly onCancel: () => void;
  readonly onSubmit: () => void;
};

export function DialogActions({
  tabValue,
  selectedCount,
  canSubmit,
  onCancel,
  onSubmit,
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
          px: 2.5,
          py: 1,
          borderRadius: 1.5,
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: alpha(theme.palette.action.hover, 0.5),
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={!canSubmit}
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          px: 3,
          py: 1,
          borderRadius: 1.5,
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              : `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
                : `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        {getSubmitButtonText(tabValue, selectedCount)}
      </Button>
    </>
  );
}

