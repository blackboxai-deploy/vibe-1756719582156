// Core Types for Booking SaaS Platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'provider' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Provider extends User {
  role: 'provider';
  subscriptionId?: string;
  onboardingCompleted: boolean;
}

export interface Customer extends User {
  role: 'customer';
  phone?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    clinics: number;
    bookingsPerMonth: number;
    hasWhatsAppReminders: boolean;
    hasAnalytics: boolean;
    hasCsvExport: boolean;
  };
}

export interface Subscription {
  id: string;
  providerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  paymobSubscriptionId?: string;
}

export interface Clinic {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  bookingSlug: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  isActive: boolean;
  bookingSlug: string;
}

export interface AvailabilityRule {
  id: string;
  clinicId: string;
  dayOfWeek: number; // 0-6, Sunday to Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  scheduledAt: Date;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'no_show';
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  remindersSent: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId?: string;
  subscriptionId?: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paymob' | 'fawry';
  stripePaymentIntentId?: string;
  paymobTransactionId?: string;
  createdAt: Date;
}

export interface BookingLink {
  id: string;
  clinicId: string;
  serviceId?: string;
  slug: string;
  qrCodeUrl?: string;
  isActive: boolean;
  expiresAt?: Date;
}

export interface Notification {
  id: string;
  bookingId: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'pending' | 'sent' | 'failed';
  content: string;
  sentAt?: Date;
}

export interface DashboardStats {
  totalBookings: number;
  thisMonthBookings: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  upcomingBookings: number;
  completionRate: number;
  noShowRate: number;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  selectedDate: string;
  selectedTime: string;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'provider' | 'customer') => Promise<void>;
  logout: () => void;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  meetingLink?: string;
}