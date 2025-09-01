import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata = {
  title: "BookingSaaS - Professional Booking Management Platform",
  description: "Complete booking management solution for healthcare providers, consultants, and service professionals. Manage appointments, accept payments, and grow your practice.",
  keywords: "booking system, appointment scheduling, healthcare, consultation, saas, clinic management",
  authors: [{ name: "BookingSaaS Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "BookingSaaS - Professional Booking Management",
    description: "Complete booking management solution for healthcare providers and consultants",
    url: "https://bookingsaas.com",
    siteName: "BookingSaaS",
    images: [
      {
        url: "https://placehold.co/1200x630?text=BookingSaaS+Professional+Booking+Management+Platform",
        width: 1200,
        height: 630,
        alt: "BookingSaaS Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BookingSaaS - Professional Booking Management",
    description: "Complete booking management solution for healthcare providers and consultants",
    images: ["https://placehold.co/1200x630?text=BookingSaaS+Twitter+Card"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster 
            richColors
            position="top-right"
            duration={4000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}