import { useMemo, useState, useEffect, useCallback, lazy, Suspense } from "react";
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
} from "@mui/icons-material";
import AddPlanDialog from "../features/releasePlans/components/AddPlanDialog";
import {
  addPlan,
  replaceAllPlansPhasesWithBase,
} from "../features/releasePlans/slice";
import type { Plan, PlanStatus } from "../features/releasePlans/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
// Lazy load PlanCard for better performance - only load when expanded
const PlanCard = lazy(() => import("../features/releasePlans/components/PlanCard/PlanCard"));
import { setPlanExpanded } from "../store/store";

type ViewMode = "grid" | "list";
type SortOption = "name" | "startDate" | "endDate" | "status" | "owner";
type FilterStatus = PlanStatus | "all";

export default function ReleasePlanner() {
  const theme = useTheme();
  const plans = useAppSelector((s) => s.releasePlans.plans);
  const basePhases = useAppSelector((s) => s.basePhases.phases);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  // View and filter state
  const [viewMode, setViewMode] = useState<ViewMode>("list"); // Default to compact list view
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Replace all existing plans' phases with base phases on mount
  useEffect(() => {
    if (basePhases.length > 0 && plans.length > 0) {
      dispatch(replaceAllPlansPhasesWithBase({ basePhases }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount to replace existing phases with base phases

  const handleAddButtonClick = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogSubmit = (name: string, description: string) => {
    // Use UTC dates for storage
    const nowUTC = getCurrentDateUTC();
    const year = parseInt(nowUTC.split("-")[0]);
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = {
      id,
      metadata: {
        id,
        name,
        owner: "Unassigned",
        startDate: `${year}-01-01`, // UTC format
        endDate: `${year}-12-31`, // UTC format
        status: "planned",
        description,
        // phases will be loaded from basePhases in the reducer
      },
      tasks: [],
    };
    // Pass basePhases to load them by default
    dispatch(addPlan({ plan: newPlan, basePhases }));
    setDialogOpen(false);
  };

  // Filter and sort plans
  const filteredAndSortedPlans = useMemo(() => {
    let result = [...plans];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
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
  }, [plans, searchQuery, statusFilter, sortBy]);

  const handleExpandAll = () => {
    plans.forEach((p) =>
      dispatch(setPlanExpanded({ planId: p.id, expanded: true }))
    );
  };

  const handleCollapseAll = () => {
    plans.forEach((p) =>
      dispatch(setPlanExpanded({ planId: p.id, expanded: false }))
    );
  };

  // Get all expanded states at once
  const expandedStates = useAppSelector((s) => s.ui.planExpandedByPlanId ?? {});

  // Optimized click handler with useCallback - immediate dispatch for instant feedback
  const handlePlanToggle = useCallback(
    (planId: string, currentExpanded: boolean) => {
      // Dispatch immediately for instant UI feedback
      dispatch(
        setPlanExpanded({
          planId,
          expanded: !currentExpanded,
        })
      );
    },
    [dispatch]
  );

  const getStatusChipProps = (status: PlanStatus) => {
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
  };

  if (!plans.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          px: { xs: 2, sm: 3 },
          py: 4,
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          No hay planes de release disponibles
        </Typography>
        <Fab
          color="primary"
          aria-label="Crear nuevo plan de release"
          onClick={handleAddButtonClick}
          sx={{ mt: 2 }}
        >
          <AddIcon />
        </Fab>
        <AddPlanDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 },
          maxWidth: "100%",
        }}
      >
        {/* Header Toolbar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.paper, 0.9),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            {/* Left: Search and Filters */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ flex: 1, minWidth: 0 }}
            >
              <TextField
                size="small"
                placeholder="Buscar planes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: { xs: 1, sm: "0 1 300px" },
                  "& .MuiOutlinedInput-root": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.5)
                        : "background.paper",
                  },
                }}
              />

              {showFilters && (
                <>
                  <FormControl
                    size="small"
                    sx={{ minWidth: { xs: "100%", sm: 140 } }}
                  >
                    <InputLabel id="status-filter-label">Estado</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      value={statusFilter}
                      label="Estado"
                      onChange={(e) =>
                        setStatusFilter(e.target.value as FilterStatus)
                      }
                    >
                      <MenuItem value="all">Todos</MenuItem>
                      <MenuItem value="planned">Planificado</MenuItem>
                      <MenuItem value="in_progress">En Progreso</MenuItem>
                      <MenuItem value="paused">Pausado</MenuItem>
                      <MenuItem value="done">Completado</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ minWidth: { xs: "100%", sm: 140 } }}
                  >
                    <InputLabel id="sort-label">Ordenar por</InputLabel>
                    <Select
                      labelId="sort-label"
                      value={sortBy}
                      label="Ordenar por"
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                      <MenuItem value="name">Nombre</MenuItem>
                      <MenuItem value="startDate">Fecha Inicio</MenuItem>
                      <MenuItem value="endDate">Fecha Fin</MenuItem>
                      <MenuItem value="status">Estado</MenuItem>
                      <MenuItem value="owner">Propietario</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </Stack>

            {/* Right: Actions */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              <Tooltip title="Mostrar/Ocultar filtros">
                <IconButton
                  size="small"
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? "primary" : "default"}
                  sx={{
                    bgcolor: showFilters
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                  }}
                >
                  <FilterIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    px: 1.5,
                    py: 0.75,
                  },
                }}
              >
                <ToggleButton value="grid" aria-label="Vista de cuadrícula">
                  <GridViewIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="list" aria-label="Vista de lista">
                  <ListViewIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              <Tooltip title="Expandir todos">
                <IconButton size="small" onClick={handleExpandAll}>
                  <ExpandIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Colapsar todos">
                <IconButton size="small" onClick={handleCollapseAll}>
                  <CollapseIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Crear nuevo plan de release">
                <Fab
                  size="small"
                  color="primary"
                  aria-label="Crear nuevo plan de release"
                  onClick={handleAddButtonClick}
                  sx={{
                    ml: 1,
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </Fab>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Results count */}
          {filteredAndSortedPlans.length !== plans.length && (
            <Box
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Mostrando {filteredAndSortedPlans.length} de {plans.length}{" "}
                planes
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Plans List/Grid */}
        {filteredAndSortedPlans.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.5)
                  : alpha(theme.palette.background.paper, 0.7),
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No se encontraron planes que coincidan con los filtros
            </Typography>
          </Paper>
        ) : viewMode === "list" ? (
          // Compact List View - Each plan as a single line
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {filteredAndSortedPlans.map((p, index) => {
              const expanded = expandedStates[p.id] ?? false;
              const phasesCount = p.metadata.phases?.length ?? 0;
              const tasksCount = p.tasks?.length ?? 0;

              return (
                <Box key={p.id}>
                  <ListItemButton
                    onClick={() => handlePlanToggle(p.id, expanded)}
                    sx={{
                      px: 2,
                      py: 1,
                      minHeight: 48,
                      borderBottom:
                        index < filteredAndSortedPlans.length - 1
                          ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
                          : "none",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.action.hover, 0.04),
                      },
                    }}
                  >
                    {/* Expand/Collapse Icon */}
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <IconButton
                        size="small"
                        sx={{
                          p: 0.5,
                          color: theme.palette.text.secondary,
                          transform: expanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      >
                        <ExpandMore fontSize="small" />
                      </IconButton>
                    </ListItemIcon>

                    {/* Plan Name */}
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {p.metadata.name}
                        </Typography>
                      }
                      secondary={
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ mt: 0.5, flexWrap: "wrap", gap: 1 }}
                        >
                          {/* Status Chip */}
                          <Chip
                            {...getStatusChipProps(p.metadata.status)}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              fontWeight: 500,
                            }}
                          />

                          {/* Owner */}
                          <Chip
                            icon={<PersonIcon sx={{ fontSize: 12 }} />}
                            label={p.metadata.owner}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              borderColor: alpha(theme.palette.divider, 0.3),
                              color: theme.palette.text.secondary,
                            }}
                          />

                          {/* Date Range */}
                          <Chip
                            icon={<CalendarIcon sx={{ fontSize: 12 }} />}
                            label={`${formatCompactDate(
                              p.metadata.startDate
                            )} - ${formatCompactDate(p.metadata.endDate)}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: "0.6875rem",
                              borderColor: alpha(theme.palette.divider, 0.3),
                              color: theme.palette.text.secondary,
                            }}
                          />

                          {/* Phases Count */}
                          {phasesCount > 0 && (
                            <Chip
                              icon={<TimelineIcon sx={{ fontSize: 12 }} />}
                              label={`${phasesCount} ${
                                phasesCount === 1 ? "fase" : "fases"
                              }`}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: "0.6875rem",
                                borderColor: alpha(theme.palette.divider, 0.3),
                                color: theme.palette.text.secondary,
                              }}
                            />
                          )}

                          {/* Tasks Count */}
                          {tasksCount > 0 && (
                            <Chip
                              icon={<TaskIcon sx={{ fontSize: 12 }} />}
                              label={`${tasksCount} ${
                                tasksCount === 1 ? "tarea" : "tareas"
                              }`}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: "0.6875rem",
                                borderColor: alpha(theme.palette.divider, 0.3),
                                color: theme.palette.text.secondary,
                              }}
                            />
                          )}
                        </Stack>
                      }
                      secondaryTypographyProps={{
                        component: "div",
                      }}
                      sx={{ my: 0 }}
                    />
                  </ListItemButton>

                  {/* Expanded Content - Lazy loaded for performance */}
                  {expanded && (
                    <Box
                      sx={{
                        borderTop: `1px solid ${alpha(
                          theme.palette.divider,
                          0.08
                        )}`,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.background.default, 0.5)
                            : alpha(theme.palette.background.default, 0.3),
                      }}
                    >
                      <Suspense
                        fallback={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 400,
                              color: "text.secondary",
                            }}
                          >
                            <Typography variant="body2">Cargando plan...</Typography>
                          </Box>
                        }
                      >
                        <PlanCard plan={p} />
                      </Suspense>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Paper>
        ) : (
          // Grid View - Full Cards
          <Stack
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(400px, 1fr))",
                lg: "repeat(auto-fill, minmax(500px, 1fr))",
              },
              gap: 2,
            }}
          >
            {filteredAndSortedPlans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </Stack>
        )}
      </Box>

      <AddPlanDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
}
