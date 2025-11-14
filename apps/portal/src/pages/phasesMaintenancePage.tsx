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
import type { BasePhase } from "../api/services/basePhases.service";

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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formData, setFormData] = useState<Partial<BasePhase>>({
    name: "",
    color: "#1976D2",
    category: "",
  });

  const handleOpenDialog = (phase?: BasePhase) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        name: phase.name,
        color: phase.color,
        category: phase.category || "",
      });
    } else {
      setEditingPhase(null);
      setFormData({
        name: "",
        color: "#1976D2",
        category: "",
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
            category: formData.category?.trim() || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          color: formData.color || "#1976D2",
          category: formData.category?.trim() || undefined,
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving phase:', error);
      // Error handling is done by React Query
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
        setDeleteDialogOpen(false);
        setPhaseToDelete(null);
      } catch (error) {
        console.error('Error deleting phase:', error);
        // Error handling is done by React Query
      }
    }
  };

  const handleDuplicate = (phase: BasePhase) => {
    setFormData({
      name: `${phase.name} (Copia)`,
      color: phase.color,
      category: phase.category || "",
    });
    setEditingPhase(null);
    setDialogOpen(true);
  };

  // Filter and search phases
  const filteredPhases = useMemo(() => {
    let result = phases;

    // Filter by category
    if (categoryFilter !== "all") {
      result = result.filter(
        (p) => p.category === categoryFilter || (!p.category && categoryFilter === "none")
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [phases, categoryFilter, searchQuery]);

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set(phases.map((p) => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [phases]);

  const predefinedColors = [
    "#1976D2", // Blue
    "#388E3C", // Green
    "#FBC02D", // Yellow
    "#D32F2F", // Red
    "#7B1FA2", // Purple
    "#455A64", // Gray
    "#E64A19", // Orange
    "#0097A7", // Cyan
    "#5D4037", // Brown
    "#C2185B", // Pink
  ];

  const categories = [
    "Requerimientos",
    "Arquitectura",
    "Construcción",
    "Calidad",
    "Despliegue",
    "Soporte",
    "Otros",
  ];

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}>
        <Alert severity="error">
          Error al cargar las fases: {error instanceof Error ? error.message : 'Error desconocido'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <PhasesIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Mantenimiento de Fases
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Gestiona las fases base del sistema que se pueden usar en los
                planes de release
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              py: 1,
            }}
          >
            Agregar Fase
          </Button>
        </Stack>
      </Paper>

      {/* Search and Filter Bar */}
      {phases.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar fases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { sm: 300 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.5)
                    : "background.paper",
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="category-filter-label">Filtrar por categoría</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Filtrar por categoría"
                onChange={(e) => setCategoryFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon sx={{ color: theme.palette.text.secondary, ml: 1 }} />
                  </InputAdornment>
                }
                sx={{
                  bgcolor: theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.5)
                    : "background.paper",
                }}
              >
                <MenuItem value="all">Todas las categorías</MenuItem>
                <MenuItem value="none">Sin categoría</MenuItem>
                {uniqueCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ flex: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ alignSelf: "center" }}
            >
              {filteredPhases.length} de {phases.length} fases
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* Phases Grid */}
      {phases.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay fases configuradas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comienza agregando tu primera fase base
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Agregar Primera Fase
          </Button>
        </Paper>
      ) : filteredPhases.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron fases
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta ajustar los filtros de búsqueda
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredPhases.map((phase) => (
            <Grid item xs={12} sm={6} md={4} key={phase.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  transition: theme.transitions.create(
                    ["box-shadow", "transform"],
                    {
                      duration: theme.transitions.duration.short,
                    }
                  ),
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 2.5 }}>
                  <Stack spacing={2}>
                    {/* Color Indicator and Name */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: phase.color,
                          flexShrink: 0,
                          boxShadow: `0 2px 8px ${alpha(phase.color, 0.3)}`,
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {phase.name}
                        </Typography>
                        {phase.category && (
                          <Chip
                            label={phase.category}
                            size="small"
                            sx={{
                              mt: 0.5,
                              height: 20,
                              fontSize: "0.6875rem",
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                      </Box>
                    </Stack>

                    {/* Color Display */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        Color
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: 32,
                          borderRadius: 1,
                          bgcolor: phase.color,
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 1.5, pt: 0 }}>
                  <Stack direction="row" spacing={0.5} sx={{ ml: "auto" }}>
                    <Tooltip title="Duplicar" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleDuplicate(phase)}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          },
                        }}
                      >
                        <DuplicateIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(phase)}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(phase)}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            color: theme.palette.error.main,
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit/Create Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingPhase ? "Editar Fase" : "Nueva Fase"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nombre de la Fase"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              variant="outlined"
              size="small"
              required
              autoFocus
            />

            <FormControl fullWidth size="small">
              <InputLabel id="category-label">Categoría (Opcional)</InputLabel>
              <Select
                labelId="category-label"
                value={formData.category || ""}
                label="Categoría (Opcional)"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <MenuItem value="">
                  <em>Ninguna</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Seleccionar Color
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {predefinedColors.map((color) => (
                  <Tooltip key={color} title={color} arrow>
                    <Box
                      onClick={() => setFormData({ ...formData, color })}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: color,
                        cursor: "pointer",
                        border:
                          formData.color === color
                            ? `3px solid ${theme.palette.primary.main}`
                            : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                        transition: theme.transitions.create(["transform"], {
                          duration: theme.transitions.duration.shortest,
                        }),
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
              <TextField
                fullWidth
                type="color"
                label="Color Personalizado"
                value={formData.color || "#1976D2"}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                size="small"
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name?.trim() || createMutation.isPending || updateMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {editingPhase ? "Guardar Cambios" : "Crear Fase"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setPhaseToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer.
          </Alert>
          <Typography>
            ¿Está seguro de que desea eliminar la fase{" "}
            <strong>{phaseToDelete?.name}</strong>?
          </Typography>
          {phaseToDelete && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  bgcolor: phaseToDelete.color,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {phaseToDelete.name}
                </Typography>
                {phaseToDelete.category && (
                  <Typography variant="caption" color="text.secondary">
                    {phaseToDelete.category}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setPhaseToDelete(null);
            }}
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
            ) : null}
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PhasesMaintenancePage;
