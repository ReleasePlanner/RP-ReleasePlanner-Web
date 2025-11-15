/**
 * Component Types React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { componentTypesService, CreateComponentTypeDto, UpdateComponentTypeDto } from '../services/componentTypes.service';

const QUERY_KEYS = {
  all: ['componentTypes'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useComponentTypes() {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => componentTypesService.getAll(),
  });
}

export function useComponentType(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => componentTypesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateComponentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComponentTypeDto) => componentTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

export function useUpdateComponentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComponentTypeDto }) =>
      componentTypesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteComponentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => componentTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

