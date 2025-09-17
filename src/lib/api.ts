
import { User, ResetData, RegisterData, LoginData, AuthResponse, 
  Availability, AvailabilityFormData, WeeklyAvailability, 
  Booking, BookingFormData, PaginatedResponse, TimeSlot, Event, EventFormData} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Récupérer le token depuis le localStorage côté client
    if (typeof window !== 'undefined') {
      
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Méthodes d'authentification
  async reset(data: ResetData) {
    return this.request<AuthResponse>('/api/auth/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData) {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData) {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async me() {
    return this.request<{ user: User }>('/api/auth/me');
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // OAuth
  async getOAuthRedirectUrl(provider: string) {
    return this.request<{ redirect_url: string }>(`/api/auth/${provider}/redirect`);
  }

  /**
   * Méthodes génériques pour les requêtes API - Disponibilité
   * */ 

  async getAvailability(): Promise<Availability[]> {
    return this.request<Availability[]>('/availability', {
      method: 'GET',
    });
  }

  async updateAvailability(availabilities: AvailabilityFormData[]): Promise<void> {
    return this.request<void>('/availability', {
      method: 'POST',
      body: JSON.stringify({ availabilities }),
    });
  }

  async getWeeklyAvailability(): Promise<WeeklyAvailability> {
    return this.request<WeeklyAvailability>('/availability/weekly', {
      method: 'GET',
    });
  }

  async updateWeeklyAvailability(data: WeeklyAvailability): Promise<void> {
    return this.request<void>('/availability/weekly', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Méthodes génériques pour les requêtes API - Rendez-vous
   * */ 
  async getBookings(page = 1): Promise<PaginatedResponse<Booking>> {
    return this.request<PaginatedResponse<Booking>>(`/bookings?page=${page}`, {
      method: 'GET',
    });
  }

  async createBooking(eventId: number, data: BookingFormData): Promise<Booking> {
    return this.request<Booking>(`/events/${eventId}/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: number): Promise<void> {
    return this.request<void>(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async getAvailableSlots(username: string, eventSlug: string, date: string): Promise<TimeSlot[]> {
    return this.request<TimeSlot[]>(`/public/availability/${username}/${eventSlug}/${date}`, {
      method: 'GET',
    });
  }

  async rescheduleBooking(id: number, data: { start_time: string; timezone: string }): Promise<Booking> {
    return this.request<Booking>(`/bookings/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Méthodes génériques pour les requêtes API - Rendez-vous
   * */ 
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
    return this.request<Event>(`/public/events/${username}/${slug}`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);