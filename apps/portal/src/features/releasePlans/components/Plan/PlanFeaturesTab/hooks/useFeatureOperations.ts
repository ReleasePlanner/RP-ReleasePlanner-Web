import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdateFeature,
  useUpdatePlan,
} from "../../../../../../api/hooks";
import { createPartialUpdateDto } from "../../../../lib/planConverters";
import type { Plan } from "../../../../types";
import type { Feature } from "../../../../feature/types";
import { useFeatureRetry } from "./useFeatureRetry";

export function useFeatureOperations(
  planId?: string,
  plan?: Plan,
  planUpdatedAt?: string | Date,
  featureIds: string[] = [],
  allProductFeatures: Feature[] = [],
  onFeatureIdsChange?: (featureIds: string[]) => void
) {
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const updateFeatureMutation = useUpdateFeature();
  const updatePlanMutation = useUpdatePlan();
  const queryClient = useQueryClient();
  const { handleRetryError } = useFeatureRetry();

  // Helper: Execute delete operation
  const executeDeleteOperation = useCallback(
    async (featureId: string, newFeatureIds: string[]): Promise<void> => {
      if (!planId || !plan || !planUpdatedAt) {
        return;
      }

      // Step 1: Update plan - remove featureId from plan (atomic with optimistic locking)
      await updatePlanMutation.mutateAsync({
        id: planId,
        data: createPartialUpdateDto(
          plan,
          { featureIds: newFeatureIds },
          planUpdatedAt
        ),
      });

      // Step 2: Update feature status to "completed" (atomic with optimistic locking)
      await updateFeatureMutation.mutateAsync({
        id: featureId,
        data: {
          status: "completed",
        },
      });

      // Step 3: Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ["plans"] });
      await queryClient.invalidateQueries({ queryKey: ["features"] });
      await queryClient.refetchQueries({ queryKey: ["plans"] });
      await queryClient.refetchQueries({ queryKey: ["features"] });
    },
    [
      planId,
      plan,
      planUpdatedAt,
      updatePlanMutation,
      updateFeatureMutation,
      queryClient,
    ]
  );

  // Helper: Execute add operation
  const executeAddOperation = useCallback(
    async (
      updatedFeatureIds: string[],
      featuresToUpdate: Feature[]
    ): Promise<void> => {
      if (!planId || !plan || !planUpdatedAt) {
        return;
      }

      // Step 1: Update plan - add featureIds to plan (atomic with optimistic locking)
      await updatePlanMutation.mutateAsync({
        id: planId,
        data: createPartialUpdateDto(
          plan,
          { featureIds: updatedFeatureIds },
          planUpdatedAt
        ),
      });

      // Step 2: Update all features status to "assigned" (atomic with optimistic locking)
      await Promise.all(
        featuresToUpdate.map((feature) =>
          updateFeatureMutation
            .mutateAsync({
              id: feature.id,
              data: {
                status: "assigned" as const,
              },
            })
            .catch((error: unknown) => {
              console.error(
                `Error updating feature ${feature.id} status to assigned:`,
                error
              );
              throw error;
            })
        )
      );

      // Step 3: Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ["plans"] });
      await queryClient.invalidateQueries({ queryKey: ["features"] });
      await queryClient.refetchQueries({ queryKey: ["plans"] });
      await queryClient.refetchQueries({ queryKey: ["features"] });
    },
    [
      planId,
      plan,
      planUpdatedAt,
      updatePlanMutation,
      updateFeatureMutation,
      queryClient,
    ]
  );

  // Handle remove feature - transactional, atomic, with optimistic locking
  const handleDeleteFeature = useCallback(
    async (featureId: string) => {
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
      const feature = allProductFeatures.find(
        (f: Feature) => f.id === featureId
      );
      if (!feature) {
        setIsRemoving(null);
        return;
      }

      const newFeatureIds = featureIds.filter((id) => id !== featureId);

      while (retryCount < maxRetries) {
        try {
          await executeDeleteOperation(featureId, newFeatureIds);

          // Update local state
          if (onFeatureIdsChange) {
            onFeatureIdsChange(newFeatureIds);
          }

          setIsRemoving(null);
          return; // Success
        } catch (error: unknown) {
          lastError = error as Error;
          retryCount++;

          const shouldContinue = await handleRetryError(
            error,
            retryCount,
            maxRetries,
            (errorContext) => {
              setIsRemoving(null);
              throw new Error(
                errorContext.userMessage ||
                  "Error removing feature. Please try again."
              );
            },
            (errorContext, errorMessage) => {
              setIsRemoving(null);
              throw new Error(
                errorContext.userMessage ||
                  errorMessage ||
                  "Error removing feature."
              );
            }
          );

          if (shouldContinue) {
            continue;
          }
          break;
        }
      }

      // If we exhausted retries, throw the last error
      setIsRemoving(null);
      throw lastError || new Error("Error removing feature.");
    },
    [
      planId,
      plan,
      planUpdatedAt,
      featureIds,
      allProductFeatures,
      executeDeleteOperation,
      handleRetryError,
      onFeatureIdsChange,
    ]
  );

  // Handle add features - transactional, atomic, with optimistic locking
  const handleAddFeatures = useCallback(
    async (newFeatureIds: string[]) => {
      if (!planId || !plan || !planUpdatedAt) {
        // Fallback to local state update only if plan info not available
        if (onFeatureIdsChange) {
          const uniqueNewIds = newFeatureIds.filter(
            (id) => !featureIds.includes(id)
          );
          if (uniqueNewIds.length > 0) {
            onFeatureIdsChange([...featureIds, ...uniqueNewIds]);
          }
        }
        return;
      }

      setIsAdding(true);
      const maxRetries = 3;
      let retryCount = 0;
      let lastError: Error | null = null;

      // Filter out duplicates
      const uniqueNewIds = newFeatureIds.filter(
        (id) => !featureIds.includes(id)
      );
      if (uniqueNewIds.length === 0) {
        setIsAdding(false);
        return;
      }

      const updatedFeatureIds = [...featureIds, ...uniqueNewIds];

      // Get features to update their status
      const featuresToUpdate = allProductFeatures.filter((f: Feature) =>
        uniqueNewIds.includes(f.id)
      );

      while (retryCount < maxRetries) {
        try {
          await executeAddOperation(updatedFeatureIds, featuresToUpdate);

          // Update local state
          if (onFeatureIdsChange) {
            onFeatureIdsChange(updatedFeatureIds);
          }

          setIsAdding(false);
          return; // Success
        } catch (error: unknown) {
          lastError = error as Error;
          retryCount++;

          const shouldContinue = await handleRetryError(
            error,
            retryCount,
            maxRetries,
            (errorContext) => {
              setIsAdding(false);
              throw new Error(
                errorContext.userMessage ||
                  "Error adding features. Please try again."
              );
            },
            (errorContext, errorMessage) => {
              setIsAdding(false);
              throw new Error(
                errorContext.userMessage ||
                  errorMessage ||
                  "Error adding features."
              );
            }
          );

          if (shouldContinue) {
            continue;
          }
          break;
        }
      }

      // If we exhausted retries, throw the last error
      setIsAdding(false);
      throw lastError || new Error("Error adding features.");
    },
    [
      planId,
      plan,
      planUpdatedAt,
      featureIds,
      allProductFeatures,
      executeAddOperation,
      handleRetryError,
      onFeatureIdsChange,
    ]
  );

  return {
    isRemoving,
    isAdding,
    handleDeleteFeature,
    handleAddFeatures,
  };
}

