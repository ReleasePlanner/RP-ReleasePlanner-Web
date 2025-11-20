import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { Feature } from "@/features/feature/types";
import { FeaturesTable } from "@/features/feature/components/FeaturesTable";
import { SelectFeaturesDialog } from "./SelectFeaturesDialog.tsx";
import { useFeatures, useUpdateFeature } from "@/api/hooks";
import { useUpdatePlan } from "@/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { createPartialUpdateDto } from "../../../lib/planConverters";
import { categorizeError, getUserErrorMessage, ErrorCategory } from "@/api/resilience/ErrorHandler";
import type { Plan } from "../../../types";

export type PlanFeaturesTabProps = {
  productId?: string;
  featureIds?: string[];
  planId?: string; // ID of the current plan being edited
  planUpdatedAt?: string | Date; // Plan updatedAt for optimistic locking
  plan?: Plan; // Full plan object for optimistic locking
  onFeatureIdsChange?: (featureIds: string[]) => void;
};

export function PlanFeaturesTab({
  productId,
  featureIds = [],
  planId,
  planUpdatedAt,
  plan,
  onFeatureIdsChange,
}: PlanFeaturesTabProps) {
  const theme = useTheme();
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // API hooks
  // With refetchOnMount: false, React Query will show cached data immediately if available
  // while refetching in the background, reducing perceived loading time
  const { data: allProductFeatures = [], isLoading: isLoadingFeatures, isFetching } = useFeatures(productId);
  const updateFeatureMutation = useUpdateFeature();
  const updatePlanMutation = useUpdatePlan();
  const queryClient = useQueryClient();

  // Get features that are in the plan (filtered by featureIds)
  const planFeatures = useMemo(() => {
    if (!productId || featureIds.length === 0) return [];
    return allProductFeatures.filter((f) => featureIds.includes(f.id));
  }, [allProductFeatures, featureIds, productId]);

  // Get product name from features
  const productName = useMemo(() => {
    if (allProductFeatures.length === 0) return "";
    return allProductFeatures[0]?.productId || "";
  }, [allProductFeatures]);

  // Handle remove feature - transactional, atomic, with optimistic locking
  const handleDeleteFeature = useCallback(async (featureId: string) => {
    if (!planId || !plan || !planUpdatedAt) {
      // Fallback to local state update only if plan info not available
      if (onFeatureIdsChange) {
        onFeatureIdsChange(featureIds.filter((id) => id !== featureId));
      }
      return;
    }

    setIsRemoving(featureId);
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    // Get the feature to restore its status
    const feature = allProductFeatures.find((f) => f.id === featureId);
    if (!feature) {
      setIsRemoving(null);
      return;
    }

    const newFeatureIds = featureIds.filter((id) => id !== featureId);

    while (retryCount < maxRetries) {
      try {
        // Step 1: Update plan - remove featureId from plan (atomic with optimistic locking)
        const updatedPlan = await updatePlanMutation.mutateAsync({
          id: planId,
          data: createPartialUpdateDto(
            plan,
            { featureIds: newFeatureIds },
            planUpdatedAt // Pass original updatedAt for optimistic locking
          ),
        });

        // Step 2: Update feature status to "completed" (atomic with optimistic locking)
        await updateFeatureMutation.mutateAsync({
          id: featureId,
          data: {
            status: "completed",
            updatedAt: feature.updatedAt, // Pass original updatedAt for optimistic locking
          },
        });

        // Step 3: Invalidate queries to ensure fresh data
        await queryClient.invalidateQueries({ queryKey: ['plans'] });
        await queryClient.invalidateQueries({ queryKey: ['features'] });
        
        // Step 4: Wait for refetch to complete
        await queryClient.refetchQueries({ queryKey: ['plans'] });
        await queryClient.refetchQueries({ queryKey: ['features'] });

        // Step 5: Update local state
        if (onFeatureIdsChange) {
          onFeatureIdsChange(newFeatureIds);
        }

        setIsRemoving(null);
        return; // Success
      } catch (error: any) {
        lastError = error;
        
        // Use advanced error categorization
        const errorContext = categorizeError(error);
        
        // Check if it's a concurrency conflict or retryable error
        if (
          errorContext.category === ErrorCategory.CONFLICT ||
          errorContext.category === ErrorCategory.RATE_LIMIT ||
          (errorContext.retryable && retryCount < maxRetries - 1)
        ) {
          retryCount++;
          if (retryCount < maxRetries) {
            // Calculate delay based on error type
            let delay = 500;
            if (errorContext.category === ErrorCategory.RATE_LIMIT) {
              delay = Math.min(2000 * Math.pow(2, retryCount), 10000);
            } else if (errorContext.category === ErrorCategory.CONFLICT) {
              delay = Math.min(500 * (retryCount + 1), 2000);
            } else {
              delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Invalidate queries to refresh data before retry
            await queryClient.invalidateQueries({ queryKey: ['plans'] });
            await queryClient.invalidateQueries({ queryKey: ['features'] });
            
            // Wait a bit more for the refetch to complete
            await new Promise(resolve => setTimeout(resolve, 200));
            continue;
          } else {
            // Max retries reached - throw a user-friendly error
            setIsRemoving(null);
            throw new Error(errorContext.userMessage || 'Error removing feature. Please try again.');
          }
        } else {
          // Not a retryable error, throw immediately with user-friendly message
          setIsRemoving(null);
          throw new Error(errorContext.userMessage || error?.message || 'Error removing feature.');
        }
      }
    }

    // If we exhausted retries, throw the last error
    setIsRemoving(null);
    throw lastError || new Error('Error removing feature.');
  }, [planId, plan, planUpdatedAt, featureIds, allProductFeatures, updatePlanMutation, updateFeatureMutation, queryClient, onFeatureIdsChange]);

  // Handle add features - transactional, atomic, with optimistic locking
  const handleAddFeatures = useCallback(async (newFeatureIds: string[]) => {
    if (!planId || !plan || !planUpdatedAt) {
      // Fallback to local state update only if plan info not available
      if (onFeatureIdsChange) {
        const uniqueNewIds = newFeatureIds.filter((id) => !featureIds.includes(id));
        if (uniqueNewIds.length > 0) {
          onFeatureIdsChange([...featureIds, ...uniqueNewIds]);
        }
      }
      setSelectDialogOpen(false);
      return;
    }

    setIsAdding(true);
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    // Filter out duplicates
    const uniqueNewIds = newFeatureIds.filter((id) => !featureIds.includes(id));
    if (uniqueNewIds.length === 0) {
      setIsAdding(false);
      setSelectDialogOpen(false);
      return;
    }

    const updatedFeatureIds = [...featureIds, ...uniqueNewIds];

    // Get features to update their status
    const featuresToUpdate = allProductFeatures.filter((f) => uniqueNewIds.includes(f.id));

    while (retryCount < maxRetries) {
      try {
        // Step 1: Update plan - add featureIds to plan (atomic with optimistic locking)
        const updatedPlan = await updatePlanMutation.mutateAsync({
          id: planId,
          data: createPartialUpdateDto(
            plan,
            { featureIds: updatedFeatureIds },
            planUpdatedAt // Pass original updatedAt for optimistic locking
          ),
        });

        // Step 2: Update all features status to "assigned" (atomic with optimistic locking)
        await Promise.all(
          featuresToUpdate.map((feature) =>
            updateFeatureMutation.mutateAsync({
              id: feature.id,
              data: {
                status: "assigned" as const,
                updatedAt: feature.updatedAt, // Pass original updatedAt for optimistic locking
              },
            }).catch((error) => {
              console.error(`Error updating feature ${feature.id} status to assigned:`, error);
              throw error;
            })
          )
        );

        // Step 3: Invalidate queries to ensure fresh data
        await queryClient.invalidateQueries({ queryKey: ['plans'] });
        await queryClient.invalidateQueries({ queryKey: ['features'] });
        
        // Step 4: Wait for refetch to complete
        await queryClient.refetchQueries({ queryKey: ['plans'] });
        await queryClient.refetchQueries({ queryKey: ['features'] });

        // Step 5: Update local state
        if (onFeatureIdsChange) {
          onFeatureIdsChange(updatedFeatureIds);
        }

        setIsAdding(false);
        setSelectDialogOpen(false);
        return; // Success
      } catch (error: any) {
        lastError = error;
        
        // Use advanced error categorization
        const errorContext = categorizeError(error);
        
        // Check if it's a concurrency conflict or retryable error
        if (
          errorContext.category === ErrorCategory.CONFLICT ||
          errorContext.category === ErrorCategory.RATE_LIMIT ||
          (errorContext.retryable && retryCount < maxRetries - 1)
        ) {
          retryCount++;
          if (retryCount < maxRetries) {
            // Calculate delay based on error type
            let delay = 500;
            if (errorContext.category === ErrorCategory.RATE_LIMIT) {
              delay = Math.min(2000 * Math.pow(2, retryCount), 10000);
            } else if (errorContext.category === ErrorCategory.CONFLICT) {
              delay = Math.min(500 * (retryCount + 1), 2000);
            } else {
              delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Invalidate queries to refresh data before retry
            await queryClient.invalidateQueries({ queryKey: ['plans'] });
            await queryClient.invalidateQueries({ queryKey: ['features'] });
            
            // Wait a bit more for the refetch to complete
            await new Promise(resolve => setTimeout(resolve, 200));
            continue;
          } else {
            // Max retries reached - throw a user-friendly error
            setIsAdding(false);
            throw new Error(errorContext.userMessage || 'Error adding features. Please try again.');
          }
        } else {
          // Not a retryable error, throw immediately with user-friendly message
          setIsAdding(false);
          throw new Error(errorContext.userMessage || error?.message || 'Error adding features.');
        }
      }
    }

    // If we exhausted retries, throw the last error
    setIsAdding(false);
    throw lastError || new Error('Error adding features.');
  }, [planId, plan, planUpdatedAt, featureIds, allProductFeatures, updatePlanMutation, updateFeatureMutation, queryClient, onFeatureIdsChange]);

  if (!productId) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          Please select a product in the Common Data tab to manage features.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack spacing={1} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            flexShrink: 0,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: "0.625rem", sm: "0.6875rem" },
              color: theme.palette.text.primary,
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          >
            Features ({planFeatures.length})
          </Typography>
          <Tooltip title="Add product features" arrow placement="top">
            <Button
              variant="outlined"
              size="small"
              startIcon={isAdding ? <CircularProgress size={14} /> : <AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => setSelectDialogOpen(true)}
              disabled={isAdding || !productId}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                fontWeight: 500,
                px: { xs: 1, sm: 1.25 },
                py: 0.5,
                borderRadius: 1,
                minHeight: 26,
                borderColor: alpha(theme.palette.primary.main, 0.5),
                color: theme.palette.primary.main,
                flexShrink: 0,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {isAdding ? "Adding..." : "Add"}
            </Button>
          </Tooltip>
        </Box>

        {/* Features Table */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: "hidden", 
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {!productId ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                Please select a product in the Common Data tab to manage features.
              </Typography>
            </Box>
          ) : isLoadingFeatures && allProductFeatures.length === 0 ? (
            // Only show loading spinner if we don't have cached data
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 1,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : planFeatures.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography 
                variant="body2"
                sx={{ fontSize: "0.6875rem" }}
              >
                No features added to this plan. Click "Add" to
                select features from the product.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: "hidden", minHeight: 0, display: "flex", flexDirection: "column", width: "100%" }}>
              <FeaturesTable
                features={planFeatures}
                onDeleteFeature={handleDeleteFeature}
                isRemoving={isRemoving}
              />
            </Box>
          )}
        </Box>
      </Stack>

      {/* Select Features Dialog */}
      <SelectFeaturesDialog
        open={selectDialogOpen}
        productId={productId}
        selectedFeatureIds={featureIds}
        currentPlanId={planId}
        onClose={() => setSelectDialogOpen(false)}
        onAddFeatures={handleAddFeatures}
      />
    </Box>
  );
}
