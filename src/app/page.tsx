'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export default function HomePage() {
  const [billingCycle] = useState<'month' | 'year'>('month');

  const features = [
    {
      icon: "📅",
      title: "Smart Scheduling",
      description: "Intelligent booking system that prevents double bookings and optimizes your calendar"
    },
    {
      icon: "👥",
      title: "Customer Management", 
      description: "Keep track of customer information, booking history, and preferences"
    },
    {
      icon: "💳",
      title: "Payment Processing",
      description: "Accept payments online with Stripe, Paymob, and Fawry integration"
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Track bookings, revenue, and performance with detailed reports"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📅</span>
            </div>
            <span className="text-xl font-bold">BookingSaaS</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <a href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </a>
            <a href="/auth/register">
              <Button size="sm">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              ✨ Now with AI-powered features
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Professional Booking Management 
              <span className="text-blue-600"> Made Simple</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Complete booking solution for healthcare providers, consultants, and service professionals. 
              Manage appointments, accept payments, and grow your practice with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </a>
              <a href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">50M+</div>
                <div className="text-sm text-muted-foreground">Bookings Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage bookings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for healthcare providers and service professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that fits your practice. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.id === 'clinic' ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
                {plan.id === 'clinic' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? 'Free' : `${plan.price} ${plan.currency}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/{billingCycle}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs mt-1 mr-2 flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a href="/auth/register" className="block w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.id === 'clinic' ? 'default' : 'outline'}
                    >
                      {plan.price === 0 ? 'Start Free' : 'Choose Plan'}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your booking process?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who trust BookingSaaS to manage their appointments and grow their practice.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white">📅</span>
              </div>
              <span className="text-xl font-bold">BookingSaaS</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional booking management platform for healthcare providers and consultants.
            </p>
            
            <Separator className="my-8 bg-gray-700" />
            
            <div className="text-sm text-gray-400">
              <p>&copy; 2024 BookingSaaS. All rights reserved.</p>
              <div className="mt-2">
                <span>🇪🇬 Made in Egypt</span>
                <span className="mx-2">•</span>
                <span>Trusted by 10K+ professionals</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}