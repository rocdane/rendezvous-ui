import { apiClient, apiRequest } from '@/lib/api';
import { Event, EventFormData, PaginatedResponse } from '@/types';

export const eventService = {
  async getEvents(page = 1): Promise<PaginatedResponse<Event>> {
    return apiRequest(() =>
      apiClient.get<PaginatedResponse<Event>>(`/events?page=${page}`)
    );
  },

  async getEvent(id: number): Promise<Event> {
    return apiRequest(() =>
      apiClient.get<{ data: Event }>(`/events/${id}`)
    ).then(response => response.data);
  },

  async createEvent(data: EventFormData): Promise<Event> {
    return apiRequest(() =>
      apiClient.post<{ data: Event }>('/events', data)
    ).then(response => response.data);
  },

  async updateEvent(id: number, data: Partial<EventFormData>): Promise<Event> {
    return apiRequest(() =>
      apiClient.put<{ data: Event }>(`/events/${id}`, data)
    ).then(response => response.data);
  },

  async deleteEvent(id: number): Promise<void> {
    return apiRequest(() =>
      apiClient.delete(`/events/${id}`)
    );
  },

  async toggleEvent(id: number): Promise<Event> {
    return apiRequest(() =>
      apiClient.patch<{ data: Event }>(`/events/${id}/toggle`)
    ).then(response => response.data);
  },

  async getPublicEvent(username: string, slug: string): Promise<Event> {
    return apiRequest(() =>
      apiClient.get<{ data: Event }>(`/public/events/${username}/${slug}`)
    ).then(response => response.data);
  },
};