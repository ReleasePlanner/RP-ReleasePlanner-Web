/**
 * Calendars React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarsService, CreateCalendarDto, UpdateCalendarDto } from '../services/calendars.service';

const QUERY_KEYS = {
  all: ['calendars'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useCalendars() {
  return useQuery({
    queryKey: QUERY_KEYS.list(),
    queryFn: () => calendarsService.getAll(),
  });
}

export function useCalendar(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => calendarsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarDto) => calendarsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

export function useUpdateCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCalendarDto }) =>
      calendarsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.list() });
    },
  });
}

