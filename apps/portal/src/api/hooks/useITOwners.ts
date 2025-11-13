/**
 * IT Owners React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itOwnersService, CreateITOwnerDto, UpdateITOwnerDto } from '../services/itOwners.service';

const QUERY_KEYS = {
  all: ['itOwners'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useITOwners() {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => itOwnersService.getAll(),
  });
}

export function useITOwner(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => itOwnersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateITOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateITOwnerDto) => itOwnersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

export function useUpdateITOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateITOwnerDto }) =>
      itOwnersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteITOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itOwnersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

