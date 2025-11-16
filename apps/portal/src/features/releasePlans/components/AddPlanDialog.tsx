import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { getErrorMessage } from "@/utils/notifications/errorNotification";
import { useAppSelector } from "@/store/hooks";
import type { PlanStatus } from "../../types";

export interface AddPlanDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, status: string, startDate: string, endDate: string, productId: string) => Promise<void>;
}

export default function AddPlanDialog({
  open,
  onClose,
  onSubmit,
}: AddPlanDialogProps) {
  const theme = useTheme();
  const products = useAppSelector((state) => state.products.products);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<PlanStatus>("planned");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productId, setProductId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      const nowUTC = new Date().toISOString().split("T")[0];
      const year = parseInt(nowUTC.split("-")[0]);
      setName("");
      setDescription("");
      setStatus("planned");
      setStartDate(`${year}-01-01`);
      setEndDate(`${year}-12-31`);
      setProductId("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    // Validate required fields
    if (!name.trim()) {
      setError("El nombre del plan es obligatorio");
      return;
    }
    if (!status) {
      setError("El estado es obligatorio");
      return;
    }
    if (!startDate) {
      setError("La fecha de inicio es obligatoria");
      return;
    }
    if (!endDate) {
      setError("La fecha de fin es obligatoria");
      return;
    }
    if (!productId) {
      setError("El producto es obligatorio");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(name.trim(), description.trim(), status, startDate, endDate, productId);
      // Only close and reset if successful
      setName("");
      setDescription("");
      setStatus("planned");
      setStartDate("");
      setEndDate("");
      setProductId("");
      onClose();
    } catch (err) {
      // Handle error - show user-friendly message
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    
    setName("");
    setDescription("");
    setStatus("planned");
    setStartDate("");
    setEndDate("");
    setProductId("");
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const isFormValid = name.trim() && status && startDate && endDate && productId;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: theme.palette.text.primary,
        }}
      >
        Nuevo Plan de Release
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                "& .MuiAlert-message": {
                  fontSize: "0.875rem",
                },
              }}
              onClose={() => setError(null)}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Error al crear el plan
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Alert>
          )}

          {/* Basic Information */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: theme.palette.text.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Información Básica
            </Typography>
            <Stack spacing={2}>
              <TextField
                id="add-plan-name-input"
                name="planName"
                label="Nombre del Plan"
                fullWidth
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Q1 2024 Release, Product Launch 2024"
                variant="outlined"
                size="small"
                autoFocus
                disabled={isSubmitting}
                error={!!error && error.toLowerCase().includes("nombre")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: "0.875rem",
                  },
                }}
              />

              <FormControl fullWidth size="small" required>
                <InputLabel id="status-label" sx={{ fontSize: "0.875rem" }}>Estado</InputLabel>
                <Select
                  id="add-plan-status-select"
                  name="planStatus"
                  labelId="status-label"
                  value={status}
                  label="Estado"
                  onChange={(e: SelectChangeEvent) => {
                    setStatus(e.target.value as PlanStatus);
                    setError(null);
                  }}
                  disabled={isSubmitting}
                  sx={{
                    fontSize: "0.875rem",
                    borderRadius: 1.5,
                  }}
                >
                  <MenuItem value="planned" sx={{ fontSize: "0.875rem" }}>Planificado</MenuItem>
                  <MenuItem value="in_progress" sx={{ fontSize: "0.875rem" }}>En Progreso</MenuItem>
                  <MenuItem value="done" sx={{ fontSize: "0.875rem" }}>Completado</MenuItem>
                  <MenuItem value="paused" sx={{ fontSize: "0.875rem" }}>Pausado</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1.5}>
                <TextField
                  id="add-plan-start-date-input"
                  name="planStartDate"
                  type="date"
                  label="Fecha Inicio"
                  fullWidth
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setError(null);
                  }}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: "0.875rem" },
                  }}
                  disabled={isSubmitting}
                  error={!!error && error.toLowerCase().includes("inicio")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: "0.875rem",
                    },
                  }}
                />
                <TextField
                  id="add-plan-end-date-input"
                  name="planEndDate"
                  type="date"
                  label="Fecha Fin"
                  fullWidth
                  required
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setError(null);
                  }}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: "0.875rem" },
                  }}
                  disabled={isSubmitting}
                  error={!!error && error.toLowerCase().includes("fin")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </Stack>

              <FormControl fullWidth size="small" required>
                <InputLabel id="product-label" sx={{ fontSize: "0.875rem" }}>Producto</InputLabel>
                <Select
                  id="add-plan-product-select"
                  name="planProductId"
                  labelId="product-label"
                  value={productId}
                  label="Producto"
                  onChange={(e: SelectChangeEvent) => {
                    setProductId(e.target.value);
                    setError(null);
                  }}
                  disabled={isSubmitting}
                  error={!!error && error.toLowerCase().includes("producto")}
                  sx={{
                    fontSize: "0.875rem",
                    borderRadius: 1.5,
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                    <em>Seleccione un producto</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id} sx={{ fontSize: "0.875rem" }}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                id="add-plan-description-input"
                name="planDescription"
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agrega una descripción opcional para este plan de release..."
                variant="outlined"
                size="small"
                disabled={isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: alpha(theme.palette.action.hover, 0.08),
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || isSubmitting}
          sx={{
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 1.5,
            fontWeight: 600,
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
            transition: "all 0.2s ease-in-out",
            minWidth: 120,
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: "inherit" }} />
              <span>Creando...</span>
            </Box>
          ) : (
            "Crear Plan"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
