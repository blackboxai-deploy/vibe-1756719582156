'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { getBookingLinkBySlug, getServicesByClinicId, createBooking } from "@/lib/database";
import { Clinic, Service, BookingFormData } from "@/lib/types";
import { mockData } from "@/lib/database";

interface BookingPageProps {
  params: {
    slug: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    selectedDate: '',
    selectedTime: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Available time slots (mock data)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    async function loadBookingData() {
      try {
        const bookingLink = await getBookingLinkBySlug(params.slug);
        if (!bookingLink) {
          setError('Booking page not found');
          return;
        }

        // Find clinic from mock data
        const clinicData = mockData.clinics.find(c => c.id === bookingLink.clinicId);
        if (!clinicData) {
          setError('Clinic not found');
          return;
        }

        setClinic(clinicData);
        
        // Load services for this clinic
        const clinicServices = await getServicesByClinicId(bookingLink.clinicId);
        setServices(clinicServices);
        
        if (clinicServices.length > 0) {
          setSelectedService(clinicServices[0]);
        }
      } catch (err) {
        setError('Failed to load booking page');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookingData();
  }, [params.slug]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Please select a service, date, and time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const scheduledAt = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      await createBooking({
        serviceId: selectedService.id,
        customerId: 'temp-customer', // In real app, create customer first
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        scheduledAt,
        status: 'pending',
        paymentStatus: 'pending',
        remindersSent: { email: false, sms: false, whatsapp: false },
        notes: formData.notes
      });

      setSuccess(true);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white">📅</span>
          </div>
          <p>Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (error && !clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild>
              <a href="/">Go Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your appointment has been scheduled successfully. You will receive a confirmation email shortly.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-medium">{selectedService?.name}</p>
              <p className="text-sm text-gray-600">
                {selectedDate?.toLocaleDateString()} at {selectedTime}
              </p>
              <p className="text-sm text-gray-600">{clinic?.name}</p>
            </div>
            <Button asChild>
              <a href="/">Book Another Appointment</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Schedule your visit with {clinic?.name}
          </p>
        </div>

        {/* Clinic Info */}
        {clinic && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{clinic.name}</h2>
                  {clinic.description && (
                    <p className="text-gray-600 mt-1">{clinic.description}</p>
                  )}
                  {clinic.address && (
                    <p className="text-sm text-gray-500 mt-2">📍 {clinic.address}</p>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  {clinic.phone && (
                    <p className="text-sm text-gray-600">📞 {clinic.phone}</p>
                  )}
                  {clinic.email && (
                    <p className="text-sm text-gray-600">✉️ {clinic.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedService?.id === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              ⏱️ {service.duration} min
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              💰 {service.price} {service.currency}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date & Time Selection + Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium mb-3 block">Choose Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 5 || date.getDay() === 6} // Disable past dates and Fri/Sat
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label className="text-base font-medium mb-3 block">Available Times</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="justify-center"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="+20123456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any specific requirements or information..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary & Submit */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {selectedDate?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{selectedService?.duration} minutes</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{selectedService?.price} {selectedService?.currency}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isSubmitting || !selectedService || !selectedDate || !selectedTime}
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    By booking, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}