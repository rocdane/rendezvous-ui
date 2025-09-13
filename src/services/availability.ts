import { apiClient, apiRequest } from '@/lib/api';
import { Availability, AvailabilityFormData, WeeklyAvailability } from '@/types';

export const availabilityService = {
  async getAvailability(): Promise<Availability[]> {
    return apiRequest(() =>
      apiClient.get<{ data: Availability[] }>('/availability')
    ).then(response => response.data);
  },

  async updateAvailability(availabilities: AvailabilityFormData[]): Promise<void> {
    return apiRequest(() =>
      apiClient.post('/availability', { availabilities })
    );
  },

  async getWeeklyAvailability(): Promise<WeeklyAvailability> {
    return apiRequest(() =>
      apiClient.get<{ data: WeeklyAvailability }>('/availability/weekly')
    ).then(response => response.data);
  },

  async updateWeeklyAvailability(data: WeeklyAvailability): Promise<void> {
    return apiRequest(() =>
      apiClient.post('/availability/weekly', data)
    );
  },
};