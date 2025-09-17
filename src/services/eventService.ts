import {  } from "@/types";
import { apiClient} from "@/lib/api";
import { apiRequest } from "@/lib/request";

class EventService {
  
    async getEvents(page = 1): Promise<PaginatedResponse<Event>> {
        return this.request<PaginatedResponse<Event>>(`/events?page=${page}`, {
          method: 'GET',
        });
    }
    
    async getEvent(id: number): Promise<Event> {
        return this.request<Event>(`/events/${id}`, {
          method: 'GET',
        });
    }
    
    async createEvent(data: EventFormData): Promise<Event> {
        return this.request<Event>('/events', {
          method: 'POST',
          body: JSON.stringify(data),
        });
    }
    
    async updateEvent(id: number, data: Partial<EventFormData>): Promise<Event> {
        return this.request<Event>(`/events/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
    }
    
    async deleteEvent(id: number): Promise<void> {
        return this.request<void>(`/events/${id}`, {
          method: 'DELETE',
        });
    }
    
    async toggleEvent(id: number): Promise<Event> {
        return this.request<Event>(`/events/${id}/toggle`, {
          method: 'PATCH',
        });
    }
    
    async getPublicEvent(username: string, slug: string): Promise<Event> {
        return apiRequest(() =>
          apiClient.get<{ data: Event }>(`/public/events/${username}/${slug}`)
        ).then(response => response.data);
    }
}