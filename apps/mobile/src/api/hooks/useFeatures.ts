/**
 * Features React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featuresService, CreateFeatureDto, UpdateFeatureDto } from '../services/features.service';

const QUERY_KEYS = {
  all: ['features'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (productId?: string) => [...QUERY_KEYS.lists(), productId] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useFeatures(productId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.list(productId),
    queryFn: () => featuresService.getAll(productId),
  });
}

export function useFeature(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => featuresService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeatureDto) => featuresService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureDto }) =>
      featuresService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featuresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

