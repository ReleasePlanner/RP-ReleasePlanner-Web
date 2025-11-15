/**
 * Release Plans API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface Plan {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  productId?: string;
  itOwner?: string;
  featureIds: string[];
  calendarIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanDto {
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status?: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  productId?: string;
  itOwner?: string;
  featureIds?: string[];
  calendarIds?: string[];
}

export interface UpdatePlanDto {
  name?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  status?: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  productId?: string;
  itOwner?: string;
  featureIds?: string[];
  calendarIds?: string[];
}

export const plansService = {
  async getAll(): Promise<Plan[]> {
    return httpClient.get<Plan[]>(API_ENDPOINTS.PLANS);
  },

  async getById(id: string): Promise<Plan> {
    return httpClient.get<Plan>(`${API_ENDPOINTS.PLANS}/${id}`);
  },

  async create(data: CreatePlanDto): Promise<Plan> {
    return httpClient.post<Plan>(API_ENDPOINTS.PLANS, data);
  },

  async update(id: string, data: UpdatePlanDto): Promise<Plan> {
    return httpClient.put<Plan>(`${API_ENDPOINTS.PLANS}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.PLANS}/${id}`);
  },
};

