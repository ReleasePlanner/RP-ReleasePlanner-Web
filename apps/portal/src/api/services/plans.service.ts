/**
 * Release Plans API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface PlanPhase {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanTask {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanMilestone {
  id: string;
  date: string;
  name: string;
  description?: string;
  phaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanReference {
  id: string;
  type: 'link' | 'document' | 'note' | 'comment' | 'file' | 'milestone';
  title: string;
  url?: string;
  description?: string;
  date?: string;
  phaseId?: string;
  milestoneColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GanttCellComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface GanttCellFile {
  id: string;
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GanttCellLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GanttCellData {
  id: string;
  phaseId?: string;
  date: string;
  isMilestone?: boolean;
  milestoneColor?: string;
  comments?: GanttCellComment[];
  files?: GanttCellFile[];
  links?: GanttCellLink[];
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  phases?: PlanPhase[];
  productId?: string;
  itOwner?: string;
  featureIds: string[];
  components: Array<{ componentId: string; finalVersion: string }>;
  calendarIds: string[];
  milestones?: PlanMilestone[];
  references?: PlanReference[];
  cellData?: GanttCellData[];
  tasks?: PlanTask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanPhaseDto {
  name: string;
  startDate?: string;
  endDate?: string;
  color?: string;
}

export interface CreatePlanDto {
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  status?: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  phases?: CreatePlanPhaseDto[];
  productId?: string;
  itOwner?: string;
  featureIds?: string[];
  calendarIds?: string[];
}

export interface UpdatePlanPhaseDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
}

export interface UpdatePlanTaskDto {
  title?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
}

export interface UpdatePlanMilestoneDto {
  name?: string;
  date?: string;
  description?: string;
}

export interface UpdateGanttCellCommentDto {
  text?: string;
  author?: string;
}

export interface UpdateGanttCellFileDto {
  name?: string;
  url?: string;
  size?: number;
  mimeType?: string;
}

export interface UpdateGanttCellLinkDto {
  title?: string;
  url?: string;
  description?: string;
}

export interface UpdateGanttCellDataDto {
  phaseId?: string;
  date?: string;
  isMilestone?: boolean;
  milestoneColor?: string;
  comments?: UpdateGanttCellCommentDto[];
  files?: UpdateGanttCellFileDto[];
  links?: UpdateGanttCellLinkDto[];
}

export interface UpdatePlanReferenceDto {
  type?: 'link' | 'document' | 'note' | 'comment' | 'file' | 'milestone';
  title?: string;
  url?: string;
  description?: string;
  date?: string;
  phaseId?: string;
  milestoneColor?: string;
}

export interface UpdatePlanDto {
  name?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  status?: 'planned' | 'in_progress' | 'done' | 'paused';
  description?: string;
  phases?: UpdatePlanPhaseDto[];
  tasks?: UpdatePlanTaskDto[];
  milestones?: UpdatePlanMilestoneDto[];
  references?: UpdatePlanReferenceDto[];
  cellData?: UpdateGanttCellDataDto[];
  productId?: string;
  itOwner?: string;
  featureIds?: string[];
  calendarIds?: string[];
  components?: Array<{ componentId: string; finalVersion: string }>;
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

