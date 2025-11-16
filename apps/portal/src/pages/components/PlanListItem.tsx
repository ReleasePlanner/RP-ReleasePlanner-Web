import { memo, useCallback, useRef, useState, useEffect, startTransition } from "react";
import {
  Box,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  Chip,
  ListItemButton,
  ListItemIcon,
  useTheme,
  alpha,
} from "@mui/material";
import { keyframes } from "@mui/system";
import {
  ExpandMore,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  Assignment as TaskIcon,
  InfoOutlined as InfoIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { lazy, Suspense } from "react";
import type { Plan as LocalPlan, PlanStatus } from "@/features/releasePlans/types";
import { formatCompactDate } from "@/features/releasePlans/lib/date";
import { getUserErrorMessage } from "@/api/resilience/ErrorHandler";

// Lazy load PlanCard only when needed
const PlanCard = lazy(() => import("@/features/releasePlans/components/PlanCard/PlanCard"));
import type { PlanCardHandle } from "@/features/releasePlans/components/PlanCard/PlanCard";

// ⚡ Elegant shimmer animation for loading state
const shimmerAnimation = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

type PlanListItemProps = {
  plan: LocalPlan;
  index: number;
  totalPlans: number;
  expanded: boolean;
  onToggle: (planId: string) => void;
  onDelete: (plan: LocalPlan, event: React.MouseEvent) => void;
  onCopyId: (planId: string, event: React.MouseEvent) => void;
  onContextMenu: (event: React.MouseEvent, plan: LocalPlan) => void;
  getStatusChipProps: (status: PlanStatus) => {
    label: string;
    color: "info" | "primary" | "success" | "warning" | "default";
  };
};

// Memoized component to prevent unnecessary re-renders
const PlanListItem = memo(function PlanListItem({
  plan,
  index,
  totalPlans,
  expanded,
  onToggle,
  onDelete,
  onCopyId,
  onContextMenu,
  getStatusChipProps,
}: PlanListItemProps) {
  const theme = useTheme();
  const phasesCount = plan.metadata.phases?.length ?? 0;
  const tasksCount = plan.tasks?.length ?? 0;
  const planCardRef = useRef<PlanCardHandle>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ⚡ Advanced optimization: Use startTransition to mark expansion as non-urgent
  // This allows React to prioritize the UI update and defer heavy rendering
  const handleToggle = useCallback(() => {
    // Mark the toggle as a transition (non-urgent update)
    // This allows React to keep the UI responsive while preparing the heavy content
    startTransition(() => {
      onToggle(plan.id);
    });
  }, [plan.id, onToggle]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      onDelete(plan, e);
    },
    [plan, onDelete]
  );

  const handleCopyId = useCallback(
    (e: React.MouseEvent) => {
      onCopyId(plan.id, e);
    },
    [plan.id, onCopyId]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      onContextMenu(e, plan);
    },
    [plan, onContextMenu]
  );

  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent expanding/collapsing
      if (!planCardRef.current) return;
      
      setIsSaving(true);
      try {
        await planCardRef.current.saveAll();
      } catch (error: any) {
        console.error('Error saving plan:', error);
        // Use advanced error handling to show user-friendly message
        const userMessage = getUserErrorMessage(error);
        // You could show a toast notification here instead of alert
        alert(userMessage);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Use state to track pending changes
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Check for pending changes periodically (when expanded)
  useEffect(() => {
    if (!expanded) {
      setHasPendingChanges(false);
      return;
    }
    
    const interval = setInterval(() => {
      if (planCardRef.current) {
        setHasPendingChanges(planCardRef.current.hasPendingChanges());
      }
    }, 500); // Check every 500ms
    
    return () => clearInterval(interval);
  }, [expanded]);

  return (
    <Box sx={{ width: "100%" }}>
      <ListItemButton
        onClick={handleToggle}
        onContextMenu={handleContextMenu}
        sx={{
          px: { xs: 1, sm: 1.5, md: 2 },
          py: { xs: 0.75, sm: 1 },
          minHeight: 48,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          borderBottom:
            index < totalPlans - 1
              ? `1px solid ${alpha(theme.palette.divider, 0.08)}`
              : "none",
          "&:hover": {
            bgcolor: alpha(theme.palette.action.hover, 0.04),
          },
        }}
      >
        {/* Expand/Collapse Icon */}
        <ListItemIcon
          sx={{
            minWidth: 32,
            mr: 0,
          }}
        >
          <IconButton
            size="small"
            sx={{
              p: 0.5,
              color: theme.palette.text.secondary,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <ExpandMore fontSize="small" />
          </IconButton>
        </ListItemIcon>

        {/* Plan Name and Info - All in one line */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          {/* Plan Name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flexShrink: { xs: 1, sm: 0 },
              minWidth: 0,
              maxWidth: { xs: "100%", sm: "180px", md: "250px", lg: "300px" },
            }}
          >
            {plan.metadata.name}
          </Typography>

          {/* Chips - Inline with name */}
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75 }}
            alignItems="center"
            sx={{
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 0.75 },
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
              minWidth: 0,
            }}
          >
            {/* Status Chip */}
            <Chip
              {...getStatusChipProps(plan.metadata.status)}
              size="small"
              sx={{
                height: { xs: 18, sm: 20 },
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                fontWeight: 500,
                "& .MuiChip-label": {
                  px: { xs: 0.75, sm: 1 },
                },
              }}
            />

            {/* Owner */}
            <Chip
              icon={<PersonIcon sx={{ fontSize: { xs: 10, sm: 12 } }} />}
              label={plan.metadata.owner}
              size="small"
              variant="outlined"
              sx={{
                height: { xs: 18, sm: 20 },
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                borderColor: alpha(theme.palette.divider, 0.3),
                color: theme.palette.text.secondary,
                display: { xs: "none", sm: "flex" },
                "& .MuiChip-label": {
                  px: { xs: 0.75, sm: 1 },
                },
              }}
            />

            {/* Date Range */}
            <Chip
              icon={<CalendarIcon sx={{ fontSize: { xs: 10, sm: 12 } }} />}
              label={`${formatCompactDate(plan.metadata.startDate)} - ${formatCompactDate(
                plan.metadata.endDate
              )}`}
              size="small"
              variant="outlined"
              sx={{
                height: { xs: 18, sm: 20 },
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                borderColor: alpha(theme.palette.divider, 0.3),
                color: theme.palette.text.secondary,
                "& .MuiChip-label": {
                  px: { xs: 0.75, sm: 1 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: { xs: 120, sm: "none" },
                },
              }}
            />

            {/* Phases Count */}
            {phasesCount > 0 && (
              <Chip
                icon={<TimelineIcon sx={{ fontSize: { xs: 10, sm: 12 } }} />}
                label={`${phasesCount} ${phasesCount === 1 ? "fase" : "fases"}`}
                size="small"
                variant="outlined"
                sx={{
                  height: { xs: 18, sm: 20 },
                  fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                  borderColor: alpha(theme.palette.divider, 0.3),
                  color: theme.palette.text.secondary,
                  "& .MuiChip-label": {
                    px: { xs: 0.75, sm: 1 },
                  },
                }}
              />
            )}

            {/* Tasks Count */}
            {tasksCount > 0 && (
              <Chip
                icon={<TaskIcon sx={{ fontSize: { xs: 10, sm: 12 } }} />}
                label={`${tasksCount} ${tasksCount === 1 ? "tarea" : "tareas"}`}
                size="small"
                variant="outlined"
                sx={{
                  height: { xs: 18, sm: 20 },
                  fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                  borderColor: alpha(theme.palette.divider, 0.3),
                  color: theme.palette.text.secondary,
                  display: { xs: "none", md: "flex" },
                  "& .MuiChip-label": {
                    px: { xs: 0.75, sm: 1 },
                  },
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Action Buttons: Save, Info (Copy ID) and Delete */}
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {expanded && (
            <Tooltip title="Guardar cambios del plan" arrow placement="top">
              <span>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving || !hasPendingChanges}
                  sx={{
                    p: { xs: 0.5, sm: 0.75 },
                    color: theme.palette.success.main,
                    opacity: hasPendingChanges ? 1 : 0.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover:not(:disabled)": {
                      opacity: 1,
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                      transform: "scale(1.1)",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Copiar ID del plan" arrow placement="top">
            <IconButton
              size="small"
              onClick={handleCopyId}
              sx={{
                p: { xs: 0.5, sm: 0.75 },
                color: theme.palette.info.main,
                opacity: 0.7,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  opacity: 1,
                  bgcolor: alpha(theme.palette.info.main, 0.08),
                  transform: "scale(1.1)",
                },
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar plan" arrow placement="top">
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                p: { xs: 0.5, sm: 0.75 },
                color: theme.palette.error.main,
                opacity: 0.7,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  opacity: 1,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  transform: "scale(1.1)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </ListItemButton>

      {/* Expanded Content - Lazy loaded for performance */}
      {expanded && (
        <Box
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.default, 0.5)
                : alpha(theme.palette.background.default, 0.3),
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  minHeight: 200,
                }}
              >
                {/* ⚡ Minimalist and elegant progress animation */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    zIndex: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        ${alpha(theme.palette.primary.main, 0.3)} 25%,
                        ${theme.palette.primary.main} 50%,
                        ${alpha(theme.palette.primary.main, 0.3)} 75%,
                        transparent 100%)`,
                      backgroundSize: "200% 100%",
                      animation: `${shimmerAnimation} 1.5s ease-in-out infinite`,
                    }}
                  />
                </Box>
              </Box>
            }
          >
            <Box sx={{ width: "100%", minWidth: 0 }}>
              <PlanCard ref={planCardRef} plan={plan} />
            </Box>
          </Suspense>
        </Box>
      )}
    </Box>
  );
});

export default PlanListItem;

