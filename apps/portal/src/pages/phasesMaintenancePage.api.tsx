/**
 * Phases Maintenance Page - Updated to use API hooks
 * 
 * This is an example of how to update components to use React Query hooks
 * instead of Redux for API operations.
 */
import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  useTheme,
  alpha,
  Grid,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as PhasesIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ContentCopy as DuplicateIcon,
} from "@mui/icons-material";
import {
  useBasePhases,
  useCreateBasePhase,
  useUpdateBasePhase,
  useDeleteBasePhase,
} from "../api/hooks";
import type { BasePhase } from "../features/releasePlans/types";

export function PhasesMaintenancePage() {
  const theme = useTheme();
  
  // API hooks
  const { data: phases = [], isLoading, error } = useBasePhases();
  const createMutation = useCreateBasePhase();
  const updateMutation = useUpdateBasePhase();
  const deleteMutation = useDeleteBasePhase();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState<BasePhase | null>(null);
  const [editingPhase, setEditingPhase] = useState<BasePhase | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<BasePhase>>({
    name: "",
    color: "#1976D2",
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpenDialog = (phase?: BasePhase) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        name: phase.name,
        color: phase.color,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        name: "",
        color: "#1976D2",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPhase(null);
    setFormData({
      name: "",
      color: "#1976D2",
      category: "",
    });
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) return;

    try {
      if (editingPhase) {
        await updateMutation.mutateAsync({
          id: editingPhase.id,
          data: {
            name: formData.name.trim(),
            color: formData.color || "#1976D2",
          },
        });
        setSnackbar({ open: true, message: 'Fase actualizada exitosamente', severity: 'success' });
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          color: formData.color || "#1976D2",
        });
        setSnackbar({ open: true, message: 'Fase creada exitosamente', severity: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error al guardar la fase',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (phase: BasePhase) => {
    setPhaseToDelete(phase);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (phaseToDelete) {
      try {
        await deleteMutation.mutateAsync(phaseToDelete.id);
        setSnackbar({ open: true, message: 'Fase eliminada exitosamente', severity: 'success' });
        setDeleteDialogOpen(false);
        setPhaseToDelete(null);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error instanceof Error ? error.message : 'Error al eliminar la fase',
          severity: 'error',
        });
      }
    }
  };

  const handleDuplicate = (phase: BasePhase) => {
    setFormData({
      name: `${phase.name} (Copia)`,
      color: phase.color,
    });
    setEditingPhase(null);
    setDialogOpen(true);
  };

  // Filter and search phases
  const filteredPhases = useMemo(() => {
    let result = phases;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [phases, searchQuery]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Error al cargar las fases: {error instanceof Error ? error.message : 'Error desconocido'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <PhasesIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        <Typography variant="h4" component="h1">
          Mantenimiento de Fases Base
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Buscar fases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nueva Fase
          </Button>
        </Stack>
      </Paper>

      {/* Phases Grid */}
      <Grid container spacing={2}>
        {filteredPhases.map((phase) => (
          <Grid item xs={12} sm={6} md={4} key={phase.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: phase.color,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    }}
                  />
                  <Typography variant="h6" component="div">
                    {phase.name}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(phase)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicar">
                  <IconButton size="small" onClick={() => handleDuplicate(phase)}>
                    <DuplicateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(phase)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPhases.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No se encontraron fases que coincidan con los filtros.
          </Typography>
        </Paper>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPhase ? "Editar Fase Base" : "Nueva Fase Base"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Color"
              type="color"
              fullWidth
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name?.trim() || createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la fase "{phaseToDelete?.name}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

