import { Button, useTheme, alpha } from "@mui/material";

export type DialogActionsProps = {
  readonly selectedCount: number;
  readonly onClose: () => void;
  readonly onAdd: () => void;
};

export function DialogActions({
  selectedCount,
  onClose,
  onAdd,
}: DialogActionsProps) {
  const theme = useTheme();

  return (
    <>
      <Button
        onClick={onClose}
        size="small"
        sx={{
          borderRadius: 1.5,
          textTransform: "none",
          px: 2,
          fontSize: "0.6875rem",
          py: 0.625,
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onAdd}
        variant="contained"
        size="small"
        disabled={selectedCount === 0}
        sx={{
          borderRadius: 1.5,
          textTransform: "none",
          px: 2,
          fontSize: "0.6875rem",
          fontWeight: 500,
          py: 0.625,
        }}
      >
        Add {selectedCount > 0 ? `(${selectedCount})` : ""}
      </Button>
    </>
  );
}

