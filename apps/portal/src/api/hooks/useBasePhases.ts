/**
 * Base Phases React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { basePhasesService, CreateBasePhaseDto, UpdateBasePhaseDto } from '../services/basePhases.service';

const QUERY_KEYS = {
  all: ['basePhases'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useBasePhases() {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => basePhasesService.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - base phases change rarely
    gcTime: 60 * 60 * 1000, // 1 hour - cache persists longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useBasePhase(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => basePhasesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBasePhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBasePhaseDto) => basePhasesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

export function useUpdateBasePhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBasePhaseDto }) =>
      basePhasesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteBasePhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => basePhasesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

