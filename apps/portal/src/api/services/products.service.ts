/**
 * Products API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface ComponentVersion {
  id: string;
  type: 'web' | 'services' | 'mobile' | string;
  currentVersion: string;
  previousVersion: string;
  name?: string;
  componentTypeId?: string;
  componentType?: {
    id: string;
    name: string;
    code?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  components: ComponentVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateComponentVersionDto {
  type: 'web' | 'services' | 'mobile';
  currentVersion: string;
  previousVersion: string;
}

export interface CreateProductDto {
  name: string;
  components?: CreateComponentVersionDto[];
}

export interface UpdateComponentVersionDto {
  id?: string;
  name?: string;
  type?: 'web' | 'services' | 'mobile' | string;
  componentTypeId?: string;
  currentVersion?: string;
  previousVersion?: string;
}

export interface UpdateProductDto {
  name?: string;
  components?: UpdateComponentVersionDto[];
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  },

  async getById(id: string): Promise<Product> {
    return httpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },

  async create(data: CreateProductDto): Promise<Product> {
    return httpClient.post<Product>(API_ENDPOINTS.PRODUCTS, data);
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    return httpClient.put<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },
};

