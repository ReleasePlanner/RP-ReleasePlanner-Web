/**
 * Base Phases API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface BasePhase {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBasePhaseDto {
  name: string;
  color: string;
}

export interface UpdateBasePhaseDto {
  name?: string;
  color?: string;
}

export const basePhasesService = {
  async getAll(): Promise<BasePhase[]> {
    return httpClient.get<BasePhase[]>(API_ENDPOINTS.BASE_PHASES);
  },

  async getById(id: string): Promise<BasePhase> {
    return httpClient.get<BasePhase>(`${API_ENDPOINTS.BASE_PHASES}/${id}`);
  },

  async create(data: CreateBasePhaseDto): Promise<BasePhase> {
    return httpClient.post<BasePhase>(API_ENDPOINTS.BASE_PHASES, data);
  },

  async update(id: string, data: UpdateBasePhaseDto): Promise<BasePhase> {
    return httpClient.put<BasePhase>(`${API_ENDPOINTS.BASE_PHASES}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.BASE_PHASES}/${id}`);
  },
};

