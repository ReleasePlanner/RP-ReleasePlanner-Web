import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { countriesService, type Country, type CreateCountryDto, type UpdateCountryDto } from '../services/countries.service';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => countriesService.getAll(),
  });
}

export function useCountry(id: string) {
  return useQuery({
    queryKey: ['countries', id],
    queryFn: () => countriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCountryDto) => countriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
}

export function useUpdateCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCountryDto }) =>
      countriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
}

export function useDeleteCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => countriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
  });
}

