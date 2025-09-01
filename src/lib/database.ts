// Mock Database Implementation for Booking SaaS
// In production, replace with actual database (PostgreSQL with Prisma)

import { 
  User, Provider, Customer, Subscription, Clinic, Service, 
  Booking, Payment, AvailabilityRule, BookingLink, DashboardStats 
} from './types';
import { SUBSCRIPTION_PLANS } from './constants';

// In-memory storage (replace with actual database)
const mockData = {
  users: [] as User[],
  subscriptions: [] as Subscription[],
  clinics: [] as Clinic[],
  services: [] as Service[],
  bookings: [] as Booking[],
  payments: [] as Payment[],
  availabilityRules: [] as AvailabilityRule[],
  bookingLinks: [] as BookingLink[]
};

// Initialize with sample data
function initializeMockData() {
  // Sample provider
  const providerId = 'provider-1';
  const provider: Provider = {
    id: providerId,
    email: 'doctor@clinic.com',
    name: 'Dr. Ahmed Hassan',
    role: 'provider',
    subscriptionId: 'sub-1',
    onboardingCompleted: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  };

  // Sample customer
  const customer: Customer = {
    id: 'customer-1',
    email: 'patient@example.com',
    name: 'Sarah Mohamed',
    role: 'customer',
    phone: '+201234567890',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  };

  // Sample subscription
  const subscription: Subscription = {
    id: 'sub-1',
    providerId: providerId,
    planId: 'clinic',
    status: 'active',
    currentPeriodStart: new Date('2024-01-01'),
    currentPeriodEnd: new Date('2024-02-01'),
    cancelAtPeriodEnd: false,
    stripeSubscriptionId: 'sub_stripe123'
  };

  // Sample clinic
  const clinicId = 'clinic-1';
  const clinic: Clinic = {
    id: clinicId,
    providerId: providerId,
    name: 'Hassan Medical Center',
    description: 'Comprehensive healthcare services with modern facilities',
    address: '123 Tahrir Square, Cairo, Egypt',
    phone: '+20212345678',
    email: 'info@hassanmedical.com',
    isActive: true,
    bookingSlug: 'hassan-medical',
    createdAt: new Date('2024-01-15')
  };

  // Sample services
  const services: Service[] = [
    {
      id: 'service-1',
      clinicId: clinicId,
      name: 'General Consultation',
      description: 'Comprehensive medical examination and consultation',
      duration: 30,
      price: 200,
      currency: 'EGP',
      isActive: true,
      bookingSlug: 'general-consultation'
    },
    {
      id: 'service-2',
      clinicId: clinicId,
      name: 'Cardiology Consultation',
      description: 'Specialized heart and cardiovascular consultation',
      duration: 45,
      price: 350,
      currency: 'EGP',
      isActive: true,
      bookingSlug: 'cardiology'
    }
  ];

  // Sample availability rules
  const availabilityRules: AvailabilityRule[] = [
    { id: 'avail-1', clinicId: clinicId, dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true }, // Monday
    { id: 'avail-2', clinicId: clinicId, dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true }, // Tuesday
    { id: 'avail-3', clinicId: clinicId, dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true }, // Wednesday
    { id: 'avail-4', clinicId: clinicId, dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true }, // Thursday
    { id: 'avail-5', clinicId: clinicId, dayOfWeek: 0, startTime: '10:00', endTime: '14:00', isActive: true }  // Sunday
  ];

  // Sample bookings
  const bookings: Booking[] = [
    {
      id: 'booking-1',
      serviceId: 'service-1',
      customerId: 'customer-1',
      customerName: 'Sarah Mohamed',
      customerEmail: 'patient@example.com',
      customerPhone: '+201234567890',
      scheduledAt: new Date('2024-01-25T10:00:00Z'),
      status: 'confirmed',
      paymentStatus: 'paid',
      remindersSent: { email: true, sms: false, whatsapp: true },
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'booking-2',
      serviceId: 'service-2',
      customerId: 'customer-1',
      customerName: 'Mohamed Ali',
      customerEmail: 'mohamed@example.com',
      scheduledAt: new Date('2024-01-26T14:30:00Z'),
      status: 'pending',
      paymentStatus: 'pending',
      remindersSent: { email: false, sms: false, whatsapp: false },
      createdAt: new Date('2024-01-21')
    }
  ];

  // Sample booking link
  const bookingLink: BookingLink = {
    id: 'link-1',
    clinicId: clinicId,
    slug: 'hassan-medical-booking',
    isActive: true,
    qrCodeUrl: 'https://placehold.co/200x200?text=QR+Code+for+Hassan+Medical+Center+Booking'
  };

  // Populate mock data
  mockData.users.push(provider, customer);
  mockData.subscriptions.push(subscription);
  mockData.clinics.push(clinic);
  mockData.services.push(...services);
  mockData.availabilityRules.push(...availabilityRules);
  mockData.bookings.push(...bookings);
  mockData.bookingLinks.push(bookingLink);
}

// Initialize data on module load
initializeMockData();

// User operations
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const user: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockData.users.push(user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return mockData.users.find(user => user.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  return mockData.users.find(user => user.id === id) || null;
}

// Subscription operations
export async function getSubscriptionByProviderId(providerId: string): Promise<Subscription | null> {
  return mockData.subscriptions.find(sub => sub.providerId === providerId) || null;
}

export async function createSubscription(subscriptionData: Omit<Subscription, 'id'>): Promise<Subscription> {
  const subscription: Subscription = {
    ...subscriptionData,
    id: `sub-${Date.now()}`
  };
  
  mockData.subscriptions.push(subscription);
  return subscription;
}

// Clinic operations
export async function getClinicsByProviderId(providerId: string): Promise<Clinic[]> {
  return mockData.clinics.filter(clinic => clinic.providerId === providerId);
}

export async function getClinicBySlug(slug: string): Promise<Clinic | null> {
  return mockData.clinics.find(clinic => clinic.bookingSlug === slug) || null;
}

export async function createClinic(clinicData: Omit<Clinic, 'id' | 'createdAt'>): Promise<Clinic> {
  const clinic: Clinic = {
    ...clinicData,
    id: `clinic-${Date.now()}`,
    createdAt: new Date()
  };
  
  mockData.clinics.push(clinic);
  return clinic;
}

// Service operations
export async function getServicesByClinicId(clinicId: string): Promise<Service[]> {
  return mockData.services.filter(service => service.clinicId === clinicId && service.isActive);
}

export async function getServiceById(id: string): Promise<Service | null> {
  return mockData.services.find(service => service.id === id) || null;
}

export async function createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
  const service: Service = {
    ...serviceData,
    id: `service-${Date.now()}`
  };
  
  mockData.services.push(service);
  return service;
}

// Booking operations
export async function getBookingsByProviderId(providerId: string): Promise<Booking[]> {
  const providerClinics = await getClinicsByProviderId(providerId);
  const clinicIds = providerClinics.map(clinic => clinic.id);
  
  return mockData.bookings.filter(booking => {
    const service = mockData.services.find(s => s.id === booking.serviceId);
    return service && clinicIds.includes(service.clinicId);
  });
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  const booking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}`,
    createdAt: new Date()
  };
  
  mockData.bookings.push(booking);
  return booking;
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<boolean> {
  const booking = mockData.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    return true;
  }
  return false;
}

// Availability operations
export async function getAvailabilityRules(clinicId: string): Promise<AvailabilityRule[]> {
  return mockData.availabilityRules.filter(rule => rule.clinicId === clinicId && rule.isActive);
}

// Dashboard stats
export async function getDashboardStats(providerId: string): Promise<DashboardStats> {
  const bookings = await getBookingsByProviderId(providerId);
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const thisMonthBookings = bookings.filter(b => b.createdAt >= thisMonth);
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const noShowBookings = bookings.filter(b => b.status === 'no_show');
  const upcomingBookings = bookings.filter(b => 
    b.scheduledAt > new Date() && ['confirmed', 'pending'].includes(b.status)
  );

  // Mock revenue calculation
  const totalRevenue = bookings.length * 200; // Average price
  const thisMonthRevenue = thisMonthBookings.length * 200;

  return {
    totalBookings: bookings.length,
    thisMonthBookings: thisMonthBookings.length,
    totalRevenue,
    thisMonthRevenue,
    upcomingBookings: upcomingBookings.length,
    completionRate: completedBookings.length / Math.max(bookings.length, 1) * 100,
    noShowRate: noShowBookings.length / Math.max(bookings.length, 1) * 100
  };
}

// Booking link operations
export async function getBookingLinkBySlug(slug: string): Promise<BookingLink | null> {
  return mockData.bookingLinks.find(link => link.slug === slug && link.isActive) || null;
}

export async function createBookingLink(linkData: Omit<BookingLink, 'id'>): Promise<BookingLink> {
  const link: BookingLink = {
    ...linkData,
    id: `link-${Date.now()}`
  };
  
  mockData.bookingLinks.push(link);
  return link;
}

// Export mock data for testing
export { mockData };
export { SUBSCRIPTION_PLANS };