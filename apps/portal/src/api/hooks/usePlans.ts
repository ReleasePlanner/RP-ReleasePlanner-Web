/**
 * Release Plans React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService, CreatePlanDto, UpdatePlanDto } from '../services/plans.service';

const QUERY_KEYS = {
  all: ['plans'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => plansService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists longer (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Use cached data if available
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => plansService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanDto) => plansService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanDto }) =>
      plansService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.list() });
      
      // Snapshot previous value
      const previousPlans = queryClient.getQueryData(QUERY_KEYS.list());
      
      // Optimistically update cache - merge data into plan object (API format is flat)
      queryClient.setQueryData(QUERY_KEYS.list(), (old: any) => {
        if (!old) return old;
        return old.map((plan: any) => 
          plan.id === id ? { ...plan, ...data } : plan
        );
      });
      
      return { previousPlans };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPlans) {
        queryClient.setQueryData(QUERY_KEYS.list(), context.previousPlans);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plansService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

