/**
 * IT Owners API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface ITOwner {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateITOwnerDto {
  name: string;
}

export interface UpdateITOwnerDto {
  name?: string;
}

export const itOwnersService = {
  async getAll(): Promise<ITOwner[]> {
    return httpClient.get<ITOwner[]>(API_ENDPOINTS.IT_OWNERS);
  },

  async getById(id: string): Promise<ITOwner> {
    return httpClient.get<ITOwner>(`${API_ENDPOINTS.IT_OWNERS}/${id}`);
  },

  async create(data: CreateITOwnerDto): Promise<ITOwner> {
    return httpClient.post<ITOwner>(API_ENDPOINTS.IT_OWNERS, data);
  },

  async update(id: string, data: UpdateITOwnerDto): Promise<ITOwner> {
    return httpClient.put<ITOwner>(`${API_ENDPOINTS.IT_OWNERS}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.IT_OWNERS}/${id}`);
  },
};

