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
  Grid,
  useTheme,
  alpha,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
} from "@mui/material";
import { PageLayout, PageToolbar, BaseEditDialog, type ViewMode } from "@/components";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as PhasesIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ContentCopy as DuplicateIcon,
  Palette as PaletteIcon,
  Timeline as TimelineIcon,
  Tune as TuneIcon,
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
  const [viewMode, setViewMode] = useState<ViewMode>("list");
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
          Error loading phases: {error instanceof Error ? error.message : 'Unknown error'}
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
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => handleOpenDialog()}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.8125rem",
            px: 2,
            py: 0.75,
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

      {/* Phases List - Compact and Minimalist */}
      {filteredPhases.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: "0.875rem",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              mb: 0.5,
            }}
          >
            {phases.length === 0 ? "No phases configured" : "No phases found"}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: "0.75rem",
              color: theme.palette.text.disabled,
            }}
          >
            {phases.length === 0 
              ? "Start by adding your first base phase"
              : searchQuery 
              ? "Try adjusting your search criteria."
              : "No phases match your filters."}
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {filteredPhases.map((phase, index) => (
            <Box key={phase.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                {/* Color Indicator */}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 1,
                    bgcolor: phase.color,
                    flexShrink: 0,
                    mr: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  }}
                />

                {/* Phase Name */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      lineHeight: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {phase.name}
                  </Typography>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={0.25}>
                  <Tooltip title="Duplicate" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleDuplicate(phase)}
                      sx={{
                        color: theme.palette.text.secondary,
                        p: 0.75,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                        },
                      }}
                    >
                      <DuplicateIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(phase)}
                      sx={{
                        color: theme.palette.text.secondary,
                        p: 0.75,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(phase)}
                      sx={{
                        color: theme.palette.text.secondary,
                        p: 0.75,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                        },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              {index < filteredPhases.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* Edit/Create Dialog */}
      <BaseEditDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editing={!!editingPhase}
        title={editingPhase ? "Edit Phase" : "New Phase"}
        subtitle={
          editingPhase
            ? "Modify the base phase details"
            : "Create a new base phase to use in plans"
        }
        maxWidth="sm"
        onSave={handleSave}
        saveButtonText={editingPhase ? "Save Changes" : "Create Phase"}
        isFormValid={!!formData.name?.trim() && !createMutation.isPending && !updateMutation.isPending}
        saveButtonDisabled={createMutation.isPending || updateMutation.isPending}
      >
        <Stack spacing={3} sx={{ width: "100%" }}>
          {/* Spacer to ensure controls are below header divider */}
          <Box sx={{ pt: 1 }} />
          
          {/* Phase Name Input */}
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Phase Name"
            placeholder="e.g., Planning, Development, Testing..."
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.625rem",
                fontWeight: 500,
                "&.MuiInputLabel-shrink": {
                  backgroundColor: theme.palette.background.paper,
                  paddingLeft: "6px",
                  paddingRight: "6px",
                  zIndex: 1,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.6875rem",
                "& input": {
                  py: 0.625,
                  fontSize: "0.6875rem",
                },
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
              "& .MuiFormHelperText-root": {
                marginTop: "4px",
                marginLeft: "0px",
                fontSize: "0.625rem",
              },
            }}
          />

          {/* Color Picker */}
          <Box sx={{ width: "100%" }}>
            {/* Colors Row */}
            <Grid container spacing={2} alignItems="center">
              {/* Predefined Colors */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  flexWrap="nowrap" 
                  sx={{ 
                    gap: 1,
                    "& > *": {
                      flexShrink: 0,
                    },
                  }}
                >
                  {predefinedColors.map((color) => (
                    <Tooltip key={color} title={color} arrow>
                      <Box
                        onClick={() => setFormData({ ...formData, color })}
                        sx={{
                          width: { xs: 36, sm: 40 },
                          height: { xs: 36, sm: 40 },
                          borderRadius: 1.5,
                          bgcolor: color,
                          cursor: "pointer",
                          border:
                            formData.color === color
                              ? `3px solid ${theme.palette.common.white}`
                              : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                          boxShadow:
                            formData.color === color
                              ? `0 0 0 2px ${color}, 0 2px 8px ${alpha(
                                  theme.palette.common.black,
                                  0.2
                                )}`
                              : "none",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: `0 2px 8px ${alpha(color, 0.4)}`,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </Grid>

              {/* Custom Color Box */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Tooltip title="Click to select a custom color" arrow>
                  <Box
                    component="label"
                    htmlFor="custom-color-input"
                    sx={{
                      position: "relative",
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: 1.5,
                      bgcolor: formData.color || "#1976D2",
                      cursor: "pointer",
                      border:
                        !predefinedColors.includes(formData.color || "")
                          ? `3px solid ${theme.palette.common.white}`
                          : `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                      boxShadow:
                        !predefinedColors.includes(formData.color || "")
                          ? `0 0 0 2px ${formData.color || "#1976D2"}, 0 2px 8px ${alpha(
                              theme.palette.common.black,
                              0.2
                            )}`
                          : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: `0 2px 8px ${alpha(formData.color || "#1976D2", 0.4)}`,
                      },
                    }}
                  >
                    <TuneIcon
                      sx={{
                        fontSize: { xs: 16, sm: 18 },
                        color: theme.palette.common.white,
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                      }}
                    />
                    <input
                      id="custom-color-input"
                      type="color"
                      value={formData.color || "#1976D2"}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </BaseEditDialog>

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
        <DialogTitle sx={{ pb: 1 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete the phase{" "}
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
            Cancel
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}

export default PhasesMaintenancePage;
