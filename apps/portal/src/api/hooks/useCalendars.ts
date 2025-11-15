/**
 * Calendars React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  calendarsService,
  CreateCalendarDto,
  UpdateCalendarDto,
  CreateCalendarDayDto,
} from '../services/calendars.service';

const QUERY_KEYS = {
  all: ['calendars'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: () => [...QUERY_KEYS.lists()] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export function useCalendars(countryId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.list(), countryId || 'all'],
    queryFn: () => calendarsService.getAll(countryId),
    enabled: true, // Always enabled, but will filter by countryId if provided
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

// Note: Calendar days are managed through the calendar update endpoint
// To add/update/delete days, use useUpdateCalendar with the full days array

