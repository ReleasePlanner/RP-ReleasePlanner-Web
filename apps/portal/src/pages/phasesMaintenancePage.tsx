import { useState, useMemo } from "react";
import {
  Box,
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
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PageLayout, PageToolbar, type ViewMode } from "@/components";
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Partial<BasePhase>>({
    name: "",
    color: "#1976D2",
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
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          color: formData.color || "#1976D2",
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
    <PageLayout
      title="Phases Maintenance"
      description="Manage base phases that can be used in release plans"
      toolbar={
        <PageToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          sortOptions={[
            { value: "name", label: "Sort: Name" },
          ]}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          searchPlaceholder="Search phases..."
          onSearchChange={setSearchQuery}
        />
      }
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&:hover": {
              boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          Add Phase
        </Button>
      }
    >

      {/* Phases Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid"
              ? {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(320px, 1fr))",
                  md: "repeat(auto-fill, minmax(350px, 1fr))",
                  lg: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }
              : "1fr",
          gap: 3,
          pb: 2,
        }}
      >
        {filteredPhases.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 12,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: "1rem",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              {phases.length === 0 ? "No phases configured" : "No phases found"}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "0.875rem",
                color: theme.palette.text.disabled,
              }}
            >
              {phases.length === 0 
                ? "Start by adding your first base phase"
                : searchQuery 
                ? "Try adjusting your search criteria."
                : "No phases match your filters."}
            </Typography>
          </Box>
        ) : (
          filteredPhases.map((phase) => (
            <Card
              key={phase.id}
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                borderRadius: 3,
                overflow: "hidden",
                transition: theme.transitions.create(
                  ["box-shadow", "border-color", "transform"],
                  {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }
                ),
                "&:hover": {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.08)}`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Stack spacing={2.5}>
                  {/* Color Indicator and Name */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: phase.color,
                        flexShrink: 0,
                        boxShadow: `0 2px 12px ${alpha(phase.color, 0.4)}`,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          lineHeight: 1.4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {phase.name}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Color Display */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 1,
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Color
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: 40,
                        borderRadius: 2,
                        bgcolor: phase.color,
                        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                        boxShadow: `inset 0 1px 2px ${alpha(theme.palette.common.black, 0.1)}`,
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
              <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Stack direction="row" spacing={0.5} sx={{ ml: "auto" }}>
                  <Tooltip title="Duplicate" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => handleDuplicate(phase)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: theme.transitions.create(["color", "background-color", "transform"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.info.main, 0.12),
                          color: theme.palette.info.main,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <DuplicateIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(phase)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: theme.transitions.create(["color", "background-color", "transform"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(phase)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: theme.transitions.create(["color", "background-color", "transform"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.12),
                          color: theme.palette.error.main,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

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
        <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
          <Stack spacing={3}>
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
    </PageLayout>
  );
}

export default PhasesMaintenancePage;
