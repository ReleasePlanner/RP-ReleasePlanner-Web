import { useMemo, useState, useEffect, useCallback, lazy, Suspense, memo } from "react";
import {
  Box,
  Stack,
  Fab,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  useTheme,
  alpha,
  Typography,
  Divider,
  Chip,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Menu,
  Snackbar,
  Skeleton,
} from "@mui/material";
import { formatCompactDate, getCurrentDateUTC } from "@/features/releasePlans/lib/date";
import {
  Add as AddIcon,
  UnfoldMore as ExpandIcon,
  UnfoldLess as CollapseIcon,
  ExpandMore,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  Assignment as TaskIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";
import AddPlanDialog from "../features/releasePlans/components/AddPlanDialog";
import type { Plan as LocalPlan, PlanStatus } from "../features/releasePlans/types";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  usePlans,
  useCreatePlan,
  useDeletePlan,
  useUpdatePlan,
  useBasePhases,
} from "../api/hooks";
import { convertAPIPlanToLocal } from "../features/releasePlans/lib/planConverters";
// Import memoized PlanListItem component
import PlanListItem from "./components/PlanListItem";
import { setPlanExpanded } from "../store/store";
import { PageLayout } from "@/components";

type ViewMode = "grid" | "list";
type SortOption = "name" | "startDate" | "endDate" | "status" | "owner";
type FilterStatus = PlanStatus | "all";

export default function ReleasePlanner() {
  const theme = useTheme();
  
  // API hooks
  const { data: apiPlans = [], isLoading: isLoadingPlans, error: plansError } = usePlans();
  const { data: basePhases = [], isLoading: isLoadingPhases, error: phasesError } = useBasePhases();
  const createMutation = useCreatePlan();
  const deleteMutation = useDeletePlan();
  const updateMutation = useUpdatePlan();
  
  // Convert API plans to local format and ensure all plans have default phases
  const plans = useMemo(() => {
    const convertedPlans = apiPlans.map(convertAPIPlanToLocal);
    
    // Ensure all plans have phases from basePhases if they don't have any
    return convertedPlans.map((plan) => {
      // If plan has no phases or empty phases array, initialize with base phases
      if (!plan.metadata.phases || plan.metadata.phases.length === 0) {
        if (basePhases.length > 0) {
          // Create phases from base phases with unique IDs
          plan.metadata.phases = basePhases.map((bp, index) => ({
            id: `phase-${plan.id}-${Date.now()}-${index}-${bp.id}`,
            name: bp.name,
            color: bp.color,
            // startDate and endDate will be set by the user or can be auto-generated
          }));
        }
      }
      return plan;
    });
  }, [apiPlans, basePhases]);

  // Auto-save removed - all saves must be manual via save buttons
  
  const dispatch = useAppDispatch();
  
  const isLoading = isLoadingPlans || isLoadingPhases;
  const error = plansError || phasesError;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<LocalPlan | null>(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [planForContextMenu, setPlanForContextMenu] = useState<LocalPlan | null>(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });


  // View and filter state
  const [viewMode, setViewMode] = useState<ViewMode>("list"); // Default to compact list view
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [showFilters, setShowFilters] = useState(true); // Show filters by default

  // Debounce search query to reduce unnecessary recalculations
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddButtonClick = useCallback(() => setDialogOpen(true), []);
  const handleDialogClose = useCallback(() => setDialogOpen(false), []);
  
  const handleDeleteClick = useCallback((plan: LocalPlan, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent expanding/collapsing the plan
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteConfirm = async () => {
    if (!planToDelete || deleteMutation.isPending) return;
    
    try {
      await deleteMutation.mutateAsync(planToDelete.id);
      // Success - close dialog and clear state
      // The list will automatically update via React Query invalidation
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      // Error is handled by the mutation, dialog will stay open
      // The error will be shown in the dialog via deleteMutation.isError
      console.error('Error deleting plan:', error);
    }
  };
  
  const handleDeleteCancel = () => {
    if (deleteMutation.isPending) return; // Prevent closing during deletion
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };
  
  // Context menu handlers
  const handleContextMenu = (event: React.MouseEvent, plan: LocalPlan) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
    setPlanForContextMenu(plan);
  };
  
  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setPlanForContextMenu(null);
  };
  
  const handleCopyPlanId = async () => {
    if (!planForContextMenu) return;
    
    try {
      await navigator.clipboard.writeText(planForContextMenu.id);
      setSnackbar({
        open: true,
        message: `ID del plan copiado: ${planForContextMenu.id}`,
      });
      handleCloseContextMenu();
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setSnackbar({
        open: true,
        message: "Error al copiar el ID del plan",
      });
    }
  };

  const handleCopyPlanIdDirect = useCallback(async (planId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent expanding/collapsing the plan
    
    try {
      await navigator.clipboard.writeText(planId);
      setSnackbar({
        open: true,
        message: `ID del plan copiado: ${planId}`,
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setSnackbar({
        open: true,
        message: "Error al copiar el ID del plan",
      });
    }
  }, []);
  
  const handleDialogSubmit = async (
    name: string,
    description: string,
    status: string,
    startDate: string,
    endDate: string,
    productId: string
  ) => {
    // Don't catch the error here - let it propagate to the dialog
    await createMutation.mutateAsync({
      name,
      owner: "Unassigned",
      startDate,
      endDate,
      status: status as PlanStatus,
      productId,
      description,
      phases: basePhases.map((bp) => ({
        name: bp.name,
        color: bp.color,
      })),
    });
    // Only close dialog if successful (no error thrown)
    setDialogOpen(false);
  };

  // Filter and sort plans - optimized with debounced search
  const filteredAndSortedPlans = useMemo(() => {
    let result = [...plans];

    // Search filter (using debounced query)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.metadata.name.toLowerCase().includes(query) ||
          p.metadata.description?.toLowerCase().includes(query) ||
          p.metadata.owner.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.metadata.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
        break;
      case "startDate":
        result.sort((a, b) =>
          a.metadata.startDate.localeCompare(b.metadata.startDate)
        );
        break;
      case "endDate":
        result.sort((a, b) =>
          b.metadata.endDate.localeCompare(a.metadata.endDate)
        );
        break;
      case "status":
        result.sort((a, b) =>
          a.metadata.status.localeCompare(b.metadata.status)
        );
        break;
      case "owner":
        result.sort((a, b) => a.metadata.owner.localeCompare(b.metadata.owner));
        break;
    }

    return result;
  }, [plans, debouncedSearchQuery, statusFilter, sortBy]);

  const handleExpandAll = () => {
    plans.forEach((p) => {
      dispatch(setPlanExpanded({ planId: p.id, expanded: true }));
    });
  };

  const handleCollapseAll = () => {
    plans.forEach((p) => {
      dispatch(setPlanExpanded({ planId: p.id, expanded: false }));
    });
  };

  // Get all expanded states at once
  const expandedStates = useAppSelector((s) => s.ui.planExpandedByPlanId ?? {});

  // Optimized click handler with useCallback - uses local state for instant UI feedback
  // Local state for optimistic UI updates (instant feedback)
  const [localExpandedStates, setLocalExpandedStates] = useState<Record<string, boolean>>({});

  // Sync local state with Redux state
  useEffect(() => {
    setLocalExpandedStates((prev) => {
      const newState = { ...prev };
      Object.keys(expandedStates).forEach((planId) => {
        if (expandedStates[planId] !== undefined) {
          newState[planId] = expandedStates[planId];
        }
      });
      return newState;
    });
  }, [expandedStates]);

  // Optimized toggle handler - updates local state immediately, then syncs with Redux
  const handlePlanToggle = useCallback(
    (planId: string) => {
      // Optimistic update - instant UI feedback
      setLocalExpandedStates((prev) => {
        const newExpanded = !prev[planId];
        
        // Dispatch to Redux asynchronously to avoid blocking
        // Use requestIdleCallback or setTimeout for non-blocking dispatch
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          requestIdleCallback(() => {
            dispatch(
              setPlanExpanded({
                planId,
                expanded: newExpanded,
              })
            );
          });
        } else {
          setTimeout(() => {
            dispatch(
              setPlanExpanded({
                planId,
                expanded: newExpanded,
              })
            );
          }, 0);
        }
        
        return {
          ...prev,
          [planId]: newExpanded,
        };
      });
    },
    [dispatch]
  );

  // Memoized status chip props to avoid recreating objects on each render
  const getStatusChipProps = useCallback((status: PlanStatus) => {
    switch (status) {
      case "planned":
        return {
          label: "Planificado",
          color: "info" as const,
        };
      case "in_progress":
        return {
          label: "En Progreso",
          color: "primary" as const,
        };
      case "done":
        return {
          label: "Completado",
          color: "success" as const,
        };
      case "paused":
        return {
          label: "Pausado",
          color: "warning" as const,
        };
      default:
        return { label: status, color: "default" as const };
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <PageLayout
        title="Release Planner"
        description="Gestiona y visualiza tus planes de release"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <LinearProgress sx={{ mb: 2 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={120}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout
        title="Release Planner"
        description="Gestiona y visualiza tus planes de release"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={handleAddButtonClick}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.8125rem",
              px: 2,
              py: 0.75,
              height: 32,
              borderRadius: 1.5,
              boxShadow: "none",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            New Plan
          </Button>
        }
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los planes: {error instanceof Error ? error.message : 'Error desconocido'}
        </Alert>
        <AddPlanDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      </PageLayout>
    );
  }

  if (!plans.length) {
    return (
      <PageLayout
        title="Release Planner"
        description="Gestiona y visualiza tus planes de release"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={handleAddButtonClick}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.8125rem",
              px: 2,
              py: 0.75,
              height: 32,
              borderRadius: 1.5,
              boxShadow: "none",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            New Plan
          </Button>
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            No hay planes de release disponibles
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Comienza creando tu primer plan de release
          </Typography>
        </Box>
        <AddPlanDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      </PageLayout>
    );
  }

  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "startDate", label: "Fecha Inicio" },
    { value: "endDate", label: "Fecha Fin" },
    { value: "status", label: "Estado" },
    { value: "owner", label: "Propietario" },
  ];

  return (
    <PageLayout
      title="Release Planner"
      description="Gestiona y visualiza tus planes de release"
      toolbar={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => {
              if (newMode !== null) setViewMode(newMode);
            }}
            aria-label="view mode"
            size="small"
            sx={{
              flexShrink: 0,
              "& .MuiToggleButton-root": {
                px: 1.25,
                py: 0.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                color: theme.palette.text.secondary,
                minWidth: 40,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              },
            }}
          >
            <Tooltip title="Vista de cuadrícula" arrow placement="top">
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Vista de lista" arrow placement="top">
              <ToggleButton value="list" aria-label="list view">
                <ListViewIcon fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>

          {/* Search Field */}
          <TextField
            size="small"
            placeholder="Buscar planes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 auto" },
              minWidth: { xs: "100%", md: 280 },
              maxWidth: { xs: "100%", md: 400 },
              order: { xs: 3, md: 0 },
              "& .MuiOutlinedInput-root": {
                height: 32,
                fontSize: "0.8125rem",
                backgroundColor: theme.palette.background.paper,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 1.5,
                },
              },
            }}
          />

          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              displayEmpty
              aria-label="Ordenar por"
              sx={{
                height: 32,
                fontSize: "0.8125rem",
                backgroundColor: theme.palette.background.paper,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.divider, 0.2),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 1.5,
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter - Inline when visible */}
          {showFilters && (
            <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }}>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as FilterStatus)
                }
                displayEmpty
                aria-label="Filtrar por estado"
                sx={{
                  height: 32,
                  fontSize: "0.8125rem",
                  backgroundColor: theme.palette.background.paper,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.divider, 0.2),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 1.5,
                  },
                }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="planned">Planificado</MenuItem>
                <MenuItem value="in_progress">En Progreso</MenuItem>
                <MenuItem value="paused">Pausado</MenuItem>
                <MenuItem value="done">Completado</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Action Buttons Group */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexShrink: 0,
              order: { xs: 4, md: 0 },
              ml: { xs: 0, md: "auto" },
            }}
          >
            <Tooltip title="Mostrar/Ocultar filtros" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? "primary" : "default"}
                sx={{
                  width: 32,
                  height: 32,
                  p: 0.75,
                  bgcolor: showFilters
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  "&:hover": {
                    bgcolor: showFilters
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.08),
                  },
                }}
              >
                <FilterIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Expandir todos" arrow placement="top">
              <IconButton
                size="small"
                onClick={handleExpandAll}
                sx={{
                  width: 32,
                  height: 32,
                  p: 0.75,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.action.hover, 0.08),
                  },
                }}
              >
                <ExpandIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Colapsar todos" arrow placement="top">
              <IconButton
                size="small"
                onClick={handleCollapseAll}
                sx={{
                  width: 32,
                  height: 32,
                  p: 0.75,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.action.hover, 0.08),
                  },
                }}
              >
                <CollapseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* New Plan Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={handleAddButtonClick}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.8125rem",
              px: 2,
              py: 0.75,
              height: 32,
              borderRadius: 1.5,
              boxShadow: "none",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: theme.palette.primary.main,
              flexShrink: 0,
              order: { xs: 2, md: 0 },
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            New Plan
          </Button>
        </Box>
      }
    >
      {/* Results count */}
      {filteredAndSortedPlans.length !== plans.length && (
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              fontSize: "0.6875rem",
            }}
          >
            Showing {filteredAndSortedPlans.length} of {plans.length} plans
          </Typography>
        </Box>
      )}

        {/* Plans List/Grid - 100% Responsive */}
        {filteredAndSortedPlans.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              width: "100%",
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
              {plans.length === 0 ? "No release plans configured" : "No release plans found"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                color: theme.palette.text.disabled,
              }}
            >
              {plans.length === 0
                ? "Start by adding your first release plan"
                : searchQuery || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "No release plans match your filters."}
            </Typography>
          </Paper>
        ) : viewMode === "list" ? (
          // Compact List View - Each plan as a single line - 100% Responsive
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 2,
              overflow: "hidden",
              width: "100%",
            }}
          >
            {filteredAndSortedPlans.map((p, index) => {
              // Use local state for instant UI feedback, fallback to Redux state
              const expanded = localExpandedStates[p.id] ?? expandedStates[p.id] ?? false;

              return (
                <PlanListItem
                  key={p.id}
                  plan={p}
                  index={index}
                  totalPlans={filteredAndSortedPlans.length}
                  expanded={expanded}
                  onToggle={handlePlanToggle}
                  onDelete={handleDeleteClick}
                  onCopyId={handleCopyPlanIdDirect}
                  onContextMenu={handleContextMenu}
                  getStatusChipProps={getStatusChipProps}
                />
              );
            })}
          </Paper>
        ) : (
          // Grid View - Full Cards - 100% Responsive
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(min(100%, 350px), 1fr))",
                md: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
                lg: "repeat(auto-fill, minmax(min(100%, 450px), 1fr))",
                xl: "repeat(auto-fill, minmax(min(100%, 500px), 1fr))",
              },
              gap: { xs: 1.5, sm: 2 },
              width: "100%",
            }}
          >
            {filteredAndSortedPlans.map((p) => (
              <Box
                key={p.id}
                sx={{
                  width: "100%",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <PlanCard plan={p} />
              </Box>
            ))}
          </Box>
        )}

      <AddPlanDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />

      {/* Delete Confirmation Dialog */}
      {planToDelete && (
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown={deleteMutation.isPending}
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          {/* Progress Bar */}
          {deleteMutation.isPending && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                borderRadius: "3px 3px 0 0",
              }}
            />
          )}

          <DialogTitle
            sx={{
              px: 3,
              pt: 3,
              pb: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              fontWeight: 600,
              fontSize: "1.25rem",
              color: theme.palette.error.main,
            }}
          >
            Eliminar Plan de Release
          </DialogTitle>

          <DialogContent sx={{ px: 3, pt: 4, pb: 2 }}>
            <Stack spacing={3}>
              {/* Error Alert */}
              {deleteMutation.isError && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 1.5,
                    "& .MuiAlert-message": {
                      fontSize: "0.875rem",
                    },
                  }}
                  onClose={() => deleteMutation.reset()}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Error al eliminar el plan
                  </Typography>
                  <Typography variant="body2">
                    {deleteMutation.error instanceof Error
                      ? deleteMutation.error.message
                      : "Ocurrió un error inesperado. Por favor, intenta nuevamente."}
                  </Typography>
                </Alert>
              )}

              <Alert
                severity="warning"
                sx={{
                  borderRadius: 1.5,
                  "& .MuiAlert-message": {
                    fontSize: "0.875rem",
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  Esta acción no se puede deshacer
                </Typography>
                <Typography variant="body2">
                  Se eliminará permanentemente el plan y todos sus datos relacionados
                  (fases, tareas, hitos, referencias, etc.).
                </Typography>
              </Alert>

              {/* Plan Info - Hidden during deletion */}
              {!deleteMutation.isPending && (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.04),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.12)}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: theme.palette.text.primary,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Plan a Eliminar
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {planToDelete.metadata.name}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                      <Chip
                        {...getStatusChipProps(planToDelete.metadata.status)}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        icon={<PersonIcon sx={{ fontSize: 14 }} />}
                        label={planToDelete.metadata.owner}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 24,
                          fontSize: "0.75rem",
                          borderColor: alpha(theme.palette.divider, 0.3),
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Chip
                        icon={<CalendarIcon sx={{ fontSize: 14 }} />}
                        label={`${formatCompactDate(
                          planToDelete.metadata.startDate
                        )} - ${formatCompactDate(planToDelete.metadata.endDate)}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 24,
                          fontSize: "0.75rem",
                          borderColor: alpha(theme.palette.divider, 0.3),
                          color: theme.palette.text.secondary,
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              )}

              {/* Progress indicator during deletion */}
              {deleteMutation.isPending && (
                <Box
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgress
                    size={48}
                    sx={{
                      color: theme.palette.error.main,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      textAlign: "center",
                    }}
                  >
                    Eliminando plan y todos sus datos relacionados...
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      textAlign: "center",
                    }}
                  >
                    Esto puede tomar unos momentos
                  </Typography>
                </Box>
              )}
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
              onClick={handleDeleteCancel}
              disabled={deleteMutation.isPending}
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
              onClick={handleDeleteConfirm}
              variant="contained"
              disabled={deleteMutation.isPending}
              sx={{
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: 1.5,
                fontWeight: 600,
                bgcolor: theme.palette.error.main,
                boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
                "&:hover": {
                  bgcolor: theme.palette.error.dark,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`,
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
                transition: "all 0.2s ease-in-out",
                minWidth: 120,
              }}
            >
              {deleteMutation.isPending ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                  <span>Eliminando...</span>
                </Box>
              ) : (
                "Eliminar Plan"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
            mt: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={handleCopyPlanId}
          sx={{
            py: 1.5,
            px: 2,
            gap: 1.5,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <CopyIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Copiar ID del Plan
          </Typography>
        </MenuItem>
      </Menu>

      {/* Snackbar for copy notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            borderRadius: 2,
            bgcolor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
            "& .MuiAlert-icon": {
              color: theme.palette.success.contrastText,
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {snackbar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </PageLayout>
  );
}
