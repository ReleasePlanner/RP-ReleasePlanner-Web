import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useCallback, useState, useEffect } from "react";

type AddPhaseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  existingPhaseNames?: string[]; // Names of existing phases to validate uniqueness
};

export default function AddPhaseDialog({
  open,
  onClose,
  onSubmit,
  existingPhaseNames = [],
}: AddPhaseDialogProps) {
  const [phaseName, setPhaseName] = useState("");
  const [error, setError] = useState<string>("");

  // Validate phase name uniqueness
  const validatePhaseName = useCallback(
    (name: string): boolean => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("El nombre de la fase es requerido");
        return false;
      }

      const normalizedExisting = existingPhaseNames.map((n) =>
        n.toLowerCase().trim()
      );
      const normalizedNew = trimmedName.toLowerCase().trim();

      if (normalizedExisting.includes(normalizedNew)) {
        setError("Ya existe una fase con este nombre en el plan");
        return false;
      }

      setError("");
      return true;
    },
    [existingPhaseNames]
  );

  const submitPhase = useCallback(() => {
    const name = phaseName.trim();
    if (validatePhaseName(name)) {
      onSubmit(name);
      setPhaseName("");
      setError("");
      onClose();
    }
  }, [onSubmit, phaseName, onClose, validatePhaseName]);

  // Reset error when dialog opens/closes or name changes
  useEffect(() => {
    if (open) {
      setPhaseName("");
      setError("");
    }
  }, [open]);

  // Validate on name change
  useEffect(() => {
    if (phaseName.trim() && open) {
      validatePhaseName(phaseName);
    } else {
      setError("");
    }
  }, [phaseName, open, validatePhaseName]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ py: 1.5 }}>Agregar Fase</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          size="small"
          label="Nombre de la fase"
          type="text"
          fullWidth
          variant="outlined"
          value={phaseName}
          onChange={(e) => setPhaseName(e.target.value)}
          error={!!error}
          helperText={error}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !error) {
              e.preventDefault();
              submitPhase();
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          onClick={submitPhase}
          variant="contained"
          disabled={!phaseName.trim() || !!error}
          sx={{ textTransform: "none" }}
        >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
