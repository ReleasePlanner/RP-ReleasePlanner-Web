/**
 * Component Types API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface ComponentType {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComponentTypeDto {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateComponentTypeDto {
  name?: string;
  code?: string;
  description?: string;
}

export const componentTypesService = {
  async getAll(): Promise<ComponentType[]> {
    return httpClient.get<ComponentType[]>(API_ENDPOINTS.COMPONENT_TYPES || '/api/component-types');
  },

  async getById(id: string): Promise<ComponentType> {
    return httpClient.get<ComponentType>(`${API_ENDPOINTS.COMPONENT_TYPES || '/api/component-types'}/${id}`);
  },

  async create(data: CreateComponentTypeDto): Promise<ComponentType> {
    return httpClient.post<ComponentType>(API_ENDPOINTS.COMPONENT_TYPES || '/api/component-types', data);
  },

  async update(id: string, data: UpdateComponentTypeDto): Promise<ComponentType> {
    return httpClient.put<ComponentType>(`${API_ENDPOINTS.COMPONENT_TYPES || '/api/component-types'}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.COMPONENT_TYPES || '/api/component-types'}/${id}`);
  },
};

