import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookingsByProviderId } from '@/lib/database';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET /api/bookings - Get bookings for authenticated provider
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'provider') {
      return NextResponse.json({ error: 'Invalid token or insufficient permissions' }, { status: 403 });
    }

    const bookings = await getBookingsByProviderId(payload.userId);
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      scheduledAt,
      notes
    } = body;

    // Basic validation
    if (!serviceId || !customerName || !customerEmail || !scheduledAt) {
      return NextResponse.json({ 
        error: 'Missing required fields: serviceId, customerName, customerEmail, scheduledAt' 
      }, { status: 400 });
    }

    // Create booking
    const booking = await createBooking({
      serviceId,
      customerId: 'temp-customer', // In production, create/find customer first
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      scheduledAt: new Date(scheduledAt),
      status: 'pending',
      paymentStatus: 'pending',
      remindersSent: { email: false, sms: false, whatsapp: false },
      notes: notes || undefined
    });

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}