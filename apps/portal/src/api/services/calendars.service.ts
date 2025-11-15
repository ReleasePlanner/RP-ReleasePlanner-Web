/**
 * Calendars API Service
 */
import { httpClient } from '../httpClient';
import { API_ENDPOINTS } from '../config';

export interface CalendarDay {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  type: 'holiday' | 'special';
  description?: string;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  isoCode?: string;
  region?: string;
}

export interface Calendar {
  id: string;
  name: string;
  description?: string;
  country?: Country;
  days: CalendarDay[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarDayDto {
  name: string;
  date: string;
  type: 'holiday' | 'special';
  description?: string;
  recurring: boolean;
}

export interface CreateCalendarDto {
  name: string;
  description?: string;
  days?: CreateCalendarDayDto[];
  countryId?: string;
}

export interface UpdateCalendarDto {
  name?: string;
  description?: string;
  days?: CreateCalendarDayDto[];
  countryId?: string;
}

export const calendarsService = {
  async getAll(countryId?: string): Promise<Calendar[]> {
    const url = countryId 
      ? `${API_ENDPOINTS.CALENDARS}?countryId=${countryId}`
      : API_ENDPOINTS.CALENDARS;
    return httpClient.get<Calendar[]>(url);
  },

  async getById(id: string): Promise<Calendar> {
    return httpClient.get<Calendar>(`${API_ENDPOINTS.CALENDARS}/${id}`);
  },

  async create(data: CreateCalendarDto): Promise<Calendar> {
    return httpClient.post<Calendar>(API_ENDPOINTS.CALENDARS, data);
  },

  async update(id: string, data: UpdateCalendarDto): Promise<Calendar> {
    return httpClient.put<Calendar>(`${API_ENDPOINTS.CALENDARS}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`${API_ENDPOINTS.CALENDARS}/${id}`);
  },

  // Note: Calendar days are managed through the calendar update endpoint
  // To add/update/delete days, update the calendar with the full days array
};

