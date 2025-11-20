import { memo, useCallback, useRef, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  Chip,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
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

  const handleToggle = useCallback(() => {
    onToggle(plan.id);
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
      <Box
        onClick={handleToggle}
        onContextMenu={handleContextMenu}
        sx={{
          px: 2,
          py: 1.5,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Expand/Collapse Icon */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          sx={{
            fontSize: 16,
            p: 0.75,
            color: theme.palette.text.secondary,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ExpandMore fontSize="inherit" />
        </IconButton>

        {/* Plan Name and Info */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
          }}
        >
          {/* Plan Name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.8125rem",
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {plan.metadata.name}
          </Typography>

          {/* Info Chips - Simple, no icons */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {/* Status Chip */}
            <Chip
              {...getStatusChipProps(plan.metadata.status)}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.625rem",
                fontWeight: 500,
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />

            {/* Owner - Simple text */}
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.secondary,
                display: { xs: "none", sm: "block" },
              }}
            >
              {plan.metadata.owner}
            </Typography>

            {/* Date Range - Simple text */}
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.secondary,
              }}
            >
              {formatCompactDate(plan.metadata.startDate)} - {formatCompactDate(plan.metadata.endDate)}
            </Typography>

            {/* Phases Count - Simple text */}
            {phasesCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6875rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {phasesCount} {phasesCount === 1 ? "phase" : "phases"}
              </Typography>
            )}

            {/* Tasks Count - Simple text */}
            {tasksCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6875rem",
                  color: theme.palette.text.secondary,
                  display: { xs: "none", md: "block" },
                }}
              >
                {tasksCount} {tasksCount === 1 ? "task" : "tasks"}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Action Buttons: Save, Info (Copy ID) and Delete */}
        <Stack
          direction="row"
          spacing={0.25}
          sx={{
            ml: "auto",
            flexShrink: 0,
          }}
        >
          {expanded && (
            <Tooltip title="Save plan changes">
              <span>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving || !hasPendingChanges}
                  sx={{
                    fontSize: 16,
                    p: 0.75,
                    color: hasPendingChanges ? theme.palette.success.main : theme.palette.text.disabled,
                    "&:hover:not(:disabled)": {
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                    },
                  }}
                >
                  {isSaving ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <SaveIcon fontSize="inherit" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Copy plan ID">
            <IconButton
              size="small"
              onClick={handleCopyId}
              sx={{
                fontSize: 16,
                p: 0.75,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <InfoIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete plan">
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                fontSize: 16,
                p: 0.75,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      
      {index < totalPlans - 1 && (
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
      )}

      {/* Expanded Content - Lazy loaded for performance */}
      {expanded && (
        <Box
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <CircularProgress size={24} />
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

