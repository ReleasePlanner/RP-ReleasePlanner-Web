import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface Country {
  id: string;
  name: string;
  code: string;
  isoCode?: string;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryDto {
  name: string;
  code: string;
  isoCode?: string;
  region?: string;
}

export interface UpdateCountryDto {
  name?: string;
  code?: string;
  isoCode?: string;
  region?: string;
}

export const countriesService = {
  getAll: async (): Promise<Country[]> => {
    return httpClient.get<Country[]>(API_ENDPOINTS.COUNTRIES);
  },

  getById: async (id: string): Promise<Country> => {
    return httpClient.get<Country>(`${API_ENDPOINTS.COUNTRIES}/${id}`);
  },

  create: async (data: CreateCountryDto): Promise<Country> => {
    return httpClient.post<Country>(API_ENDPOINTS.COUNTRIES, data);
  },

  update: async (id: string, data: UpdateCountryDto): Promise<Country> => {
    return httpClient.put<Country>(`${API_ENDPOINTS.COUNTRIES}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`${API_ENDPOINTS.COUNTRIES}/${id}`);
  },
};

