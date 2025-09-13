export interface SocialRedirectResponse {
  redirect_url: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  timezone: string;
  slug: string;
  avatar?: string;
  providers?: string[];
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface OAuthProvider {
  id: number;
  user_id: number;
  provider: 'google' | 'microsoft' | 'github';
  provider_id: string;
  provider_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  slug: string;
  duration: number; // en minutes
  buffer_time: number; // en minutes
  is_active: boolean;
  user_id: number;
  user?: User;
  bookings_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  event_id: number;
  guest_name: string;
  guest_email: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  event?: Event;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: number;
  user_id: number;
  day_of_week: number; // 0 = Dimanche, 1 = Lundi, etc.
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_available: boolean;
}

export interface TimeSlot {
  time: string; // HH:mm format
  datetime: string; // ISO string
  available: boolean;
}

export interface BookingFormData {
  guest_name: string;
  guest_email: string;
  notes?: string;
  start_time: string;
  timezone: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  duration: number;
  buffer_time?: number;
  is_active?: boolean;
}

export interface AvailabilityFormData {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  timezone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetData {
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  timezone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Calendar types
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    booking: Booking;
    guest_name: string;
    guest_email: string;
    status: string;
  };
}

// UI Component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

// Store types
export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export interface EventStore {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  createEvent: (data: EventFormData) => Promise<Event>;
  updateEvent: (id: number, data: Partial<EventFormData>) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
  setCurrentEvent: (event: Event | null) => void;
}

// Utility types
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeeklyAvailability {
  [key: number]: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
}