'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/providers/auth-provider";
import { getDashboardStats, getBookingsByProviderId, getSubscriptionByProviderId } from "@/lib/database";
import { DashboardStats, Booking, Subscription } from "@/lib/types";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user || user.role !== 'provider') return;

      try {
        const [dashboardStats, bookings, subData] = await Promise.all([
          getDashboardStats(user.id),
          getBookingsByProviderId(user.id),
          getSubscriptionByProviderId(user.id)
        ]);

        setStats(dashboardStats);
        setRecentBookings(bookings.slice(0, 5)); // Get recent 5 bookings
        setSubscription(subData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  const currentPlan = subscription ? SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.planId) : SUBSCRIPTION_PLANS[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s what&apos;s happening with your practice today.
            </p>
          </div>
          <div className="text-right">
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
              {currentPlan?.name} Plan
            </Badge>
            <p className="text-sm text-gray-500 mt-1">
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <span className="text-2xl">📅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.thisMonthBookings} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue} EGP</div>
              <p className="text-xs text-muted-foreground">
                {stats.thisMonthRevenue} EGP this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <span className="text-2xl">⏰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">
                Appointments scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
              <Progress value={stats.completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Bookings
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/bookings">View All</a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(booking.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      booking.status === 'canceled' ? 'destructive' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Share your booking link to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/dashboard/services">
                <span className="mr-2">⚙️</span>
                Manage Services & Availability
              </a>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/dashboard/bookings">
                <span className="mr-2">📋</span>
                View All Bookings
              </a>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/dashboard/reports">
                <span className="mr-2">📊</span>
                Generate Reports
              </a>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/booking/hassan-medical-booking">
                <span className="mr-2">🔗</span>
                View Public Booking Page
              </a>
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Share Your Booking Link</h4>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  📋 Copy Link
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  📱 QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Usage */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Plan Usage - {currentPlan.name}
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/settings">Manage Plan</a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Bookings</span>
                  <span className="text-sm text-gray-500">
                    {stats?.thisMonthBookings || 0} / {currentPlan.limits.bookingsPerMonth === -1 ? '∞' : currentPlan.limits.bookingsPerMonth}
                  </span>
                </div>
                <Progress 
                  value={currentPlan.limits.bookingsPerMonth === -1 ? 0 : 
                    ((stats?.thisMonthBookings || 0) / currentPlan.limits.bookingsPerMonth) * 100
                  } 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Clinics</span>
                  <span className="text-sm text-gray-500">
                    1 / {currentPlan.limits.clinics === -1 ? '∞' : currentPlan.limits.clinics}
                  </span>
                </div>
                <Progress value={currentPlan.limits.clinics === -1 ? 0 : (1 / currentPlan.limits.clinics) * 100} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Features</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentPlan.limits.hasWhatsAppReminders && <Badge variant="secondary" className="text-xs">WhatsApp</Badge>}
                  {currentPlan.limits.hasAnalytics && <Badge variant="secondary" className="text-xs">Analytics</Badge>}
                  {currentPlan.limits.hasCsvExport && <Badge variant="secondary" className="text-xs">CSV Export</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}