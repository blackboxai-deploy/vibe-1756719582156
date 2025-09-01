import { SubscriptionPlan } from "./types";

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'EGP',
    interval: 'month',
    features: [
      '1 clinic location',
      'Up to 50 bookings per month',
      'Email confirmations',
      'Basic booking page',
      'Mobile responsive'
    ],
    limits: {
      clinics: 1,
      bookingsPerMonth: 50,
      hasWhatsAppReminders: false,
      hasAnalytics: false,
      hasCsvExport: false
    }
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 100,
    currency: 'EGP',
    interval: 'month',
    features: [
      '1 clinic location',
      'Unlimited bookings',
      'Email & WhatsApp reminders',
      'Custom booking page',
      'Basic analytics',
      'Priority support'
    ],
    limits: {
      clinics: 1,
      bookingsPerMonth: -1, // unlimited
      hasWhatsAppReminders: true,
      hasAnalytics: true,
      hasCsvExport: false
    }
  },
  {
    id: 'clinic',
    name: 'Clinic',
    price: 250,
    currency: 'EGP',
    interval: 'month',
    features: [
      'Multiple clinic locations',
      'Unlimited bookings',
      'All reminder types',
      'Advanced analytics',
      'CSV export',
      'Multi-calendar sync',
      'Team management'
    ],
    limits: {
      clinics: -1, // unlimited
      bookingsPerMonth: -1, // unlimited
      hasWhatsAppReminders: true,
      hasAnalytics: true,
      hasCsvExport: true
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 500,
    currency: 'EGP',
    interval: 'month',
    features: [
      'Everything in Clinic',
      'White-label domain',
      'Custom branding',
      'API access',
      'Advanced reporting',
      'Dedicated support',
      'Custom integrations'
    ],
    limits: {
      clinics: -1, // unlimited
      bookingsPerMonth: -1, // unlimited
      hasWhatsAppReminders: true,
      hasAnalytics: true,
      hasCsvExport: true
    }
  }
];

// API Configuration
export const API_CONFIG = {
  OPENROUTER_ENDPOINT: 'https://oi-server.onrender.com/chat/completions',
  HEADERS: {
    'customerId': 'ahmedollaek96@gmail.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  },
  DEFAULT_MODEL: 'openrouter/anthropic/claude-sonnet-4'
};

// Payment Methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYMOB: 'paymob',
  FAWRY: 'fawry'
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show'
} as const;

// Time Slots (in minutes)
export const TIME_SLOT_DURATION = 30;

// Default Working Hours
export const DEFAULT_WORKING_HOURS = {
  start: '09:00',
  end: '17:00'
};

// Days of Week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Notification Types
export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp'
} as const;

// App Configuration
export const APP_CONFIG = {
  name: 'BookingSaaS',
  description: 'Professional booking management platform for healthcare providers and consultants',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  supportEmail: 'support@bookingsaas.com',
  companyName: 'BookingSaaS Inc.'
};

// Feature Flags
export const FEATURE_FLAGS = {
  GOOGLE_CALENDAR_INTEGRATION: true,
  WHATSAPP_NOTIFICATIONS: true,
  PAYMOB_PAYMENTS: true,
  CSV_EXPORT: true,
  ANALYTICS_DASHBOARD: true,
  QR_CODE_GENERATION: true
};

// Email Templates
export const EMAIL_TEMPLATES = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  BOOKING_REMINDER: 'booking_reminder',
  BOOKING_CANCELLATION: 'booking_cancellation',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  WELCOME: 'welcome'
};

// Currency Formatting
export const CURRENCY_CONFIG = {
  EGP: {
    symbol: 'EGP',
    locale: 'ar-EG',
    position: 'after'
  },
  USD: {
    symbol: '$',
    locale: 'en-US', 
    position: 'before'
  }
};

// Google Calendar Configuration
export const GOOGLE_CALENDAR_CONFIG = {
  SCOPES: ['https://www.googleapis.com/auth/calendar'],
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  CLINIC_NAME_MAX_LENGTH: 100,
  SERVICE_NAME_MAX_LENGTH: 100,
  BOOKING_NOTES_MAX_LENGTH: 500,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Rate Limiting
export const RATE_LIMITS = {
  BOOKING_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // max attempts
  },
  API_REQUESTS: {
    windowMs: 60 * 1000, // 1 minute
    max: 100 // max requests
  }
};