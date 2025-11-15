import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureCategoriesService, type FeatureCategory, type CreateFeatureCategoryDto, type UpdateFeatureCategoryDto } from '../services/featureCategories.service';

const QUERY_KEY = ['feature-categories'] as const;

export function useFeatureCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => featureCategoriesService.getAll(),
  });
}

export function useFeatureCategory(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => featureCategoriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFeatureCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeatureCategoryDto) => featureCategoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateFeatureCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureCategoryDto }) =>
      featureCategoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteFeatureCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureCategoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

