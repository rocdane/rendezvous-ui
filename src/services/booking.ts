import { apiClient, apiRequest } from '@/lib/api';
import { Booking, BookingFormData, PaginatedResponse, TimeSlot } from '@/types';

export const bookingService = {
  async getBookings(page = 1): Promise<PaginatedResponse<Booking>> {
    return apiRequest(() =>
      apiClient.get<PaginatedResponse<Booking>>(`/bookings?page=${page}`)
    );
  },

  async createBooking(eventId: number, data: BookingFormData): Promise<Booking> {
    return apiRequest(() =>
      apiClient.post<{ data: Booking }>(`/events/${eventId}/book`, data)
    ).then(response => response.data);
  },

  async cancelBooking(id: number): Promise<void> {
    return apiRequest(() =>
      apiClient.patch(`/bookings/${id}/cancel`)
    );
  },

  async getAvailableSlots(username: string, eventSlug: string, date: string): Promise<TimeSlot[]> {
    return apiRequest(() =>
      apiClient.get<{ data: TimeSlot[] }>(`/public/availability/${username}/${eventSlug}/${date}`)
    ).then(response => response.data);
  },

  async rescheduleBooking(id: number, data: { start_time: string; timezone: string }): Promise<Booking> {
    return apiRequest(() =>
      apiClient.patch<{ data: Booking }>(`/bookings/${id}/reschedule`, data)
    ).then(response => response.data);
  },
};