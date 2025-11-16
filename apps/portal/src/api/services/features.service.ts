/**
 * Features API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface FeatureCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOwner {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  isoCode?: string;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'assigned';
  createdBy: ProductOwner;
  technicalDescription: string;
  businessDescription: string;
  productId: string;
  country?: Country;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureCategoryDto {
  name: string;
}

export interface CreateProductOwnerDto {
  name: string;
}

export interface CreateFeatureDto {
  name: string;
  description: string;
  categoryId?: string;
  category?: CreateFeatureCategoryDto;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'assigned';
  createdBy: CreateProductOwnerDto;
  technicalDescription: string;
  businessDescription: string;
  productId: string;
  countryId?: string;
}

export interface UpdateFeatureCategoryDto {
  name: string;
}

export interface UpdateProductOwnerDto {
  name: string;
}

export interface UpdateFeatureDto {
  name?: string;
  description?: string;
  categoryId?: string;
  category?: UpdateFeatureCategoryDto;
  status?: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'assigned';
  createdBy?: UpdateProductOwnerDto;
  technicalDescription?: string;
  businessDescription?: string;
  countryId?: string;
}

export const featuresService = {
  async getAll(productId?: string): Promise<Feature[]> {
    const url = productId
      ? `${API_ENDPOINTS.FEATURES}?productId=${productId}`
      : API_ENDPOINTS.FEATURES;
    return httpClient.get<Feature[]>(url);
  },

  async getById(id: string): Promise<Feature> {
    return httpClient.get<Feature>(`${API_ENDPOINTS.FEATURES}/${id}`);
  },

  async create(data: CreateFeatureDto): Promise<Feature> {
    return httpClient.post<Feature>(API_ENDPOINTS.FEATURES, data);
  },

  async update(id: string, data: UpdateFeatureDto): Promise<Feature> {
    return httpClient.put<Feature>(`${API_ENDPOINTS.FEATURES}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.FEATURES}/${id}`);
  },
};

