import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface FeatureCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureCategoryDto {
  name: string;
}

export interface UpdateFeatureCategoryDto {
  name?: string;
}

export const featureCategoriesService = {
  getAll: async (): Promise<FeatureCategory[]> => {
    return httpClient.get<FeatureCategory[]>(API_ENDPOINTS.FEATURE_CATEGORIES);
  },

  getById: async (id: string): Promise<FeatureCategory> => {
    return httpClient.get<FeatureCategory>(`${API_ENDPOINTS.FEATURE_CATEGORIES}/${id}`);
  },

  create: async (data: CreateFeatureCategoryDto): Promise<FeatureCategory> => {
    return httpClient.post<FeatureCategory>(API_ENDPOINTS.FEATURE_CATEGORIES, data);
  },

  update: async (id: string, data: UpdateFeatureCategoryDto): Promise<FeatureCategory> => {
    return httpClient.put<FeatureCategory>(`${API_ENDPOINTS.FEATURE_CATEGORIES}/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`${API_ENDPOINTS.FEATURE_CATEGORIES}/${id}`);
  },
};

