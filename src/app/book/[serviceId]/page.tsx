// This remains a Server Component (no 'use client')

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';
import type { Service, AvailabilitySettings, TimeSlot } from '@/lib/types';
import { getGoogleMapsApiKey } from '@/lib/server-utils';

// Import all necessary Firestore functions
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';

// --- Helper function to fetch the service by its custom 'serviceId' field ---
async function getServiceByServiceId(serviceId: string): Promise<Service> {
  const servicesCollectionRef = collection(db, 'services');
  // Create a query to find the document where the 'serviceId' field matches
  const q = query(servicesCollectionRef, where('serviceId', '==', serviceId), limit(1));
  
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // If no document is found, trigger the 404 page
    notFound();
  }

  const serviceDoc = querySnapshot.docs[0];
  return {
    id: serviceDoc.id, // The actual Firestore document ID
    ...serviceDoc.data(),
  } as Service;
}

// --- Helper function to fetch availability settings ---
async function getAvailability(): Promise<{ timeSlots: TimeSlot[], disabledDates: Date[] }> {
  const settingsDocRef = doc(db, 'availability', 'settings');
  const settingsDocSnap = await getDoc(settingsDocRef);

  if (!settingsDocSnap.exists()) {
    // If settings don't exist, something is wrong with the setup.
    // We'll throw an error to be caught by Next.js's error boundary.
    throw new Error("Availability settings not found in the database.");
  }
  
  const settingsData = settingsDocSnap.data() as AvailabilitySettings;
  
  // Convert the date strings from Firestore into Date objects for the Calendar component
  const disabledDates = settingsData.disabledDates.map(dateStr => new Date(dateStr));
  
  return {
    timeSlots: settingsData.timeSlots,
    disabledDates: disabledDates,
  };
}

// --- The Main Page Component ---
export default async function BookingPage({ params }: { params: { serviceId: string } }) {
  console.log(
    "[SERVER LOG] Checking Google Maps API Key:", 
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );
  const [service, availability, googleMapsApiKey] = await Promise.all([
    getServiceByServiceId(params.serviceId),
    getAvailability(),
    getGoogleMapsApiKey() // Fetch the API key from Secret Manager
  ]);
  
  if (!googleMapsApiKey) {
    // Handle the case where the key couldn't be fetched
    // You could show an error message or disable the address input.
    console.error("CRITICAL: Google Maps API key is missing. Address input will not work.");
  }

  return (
    <div className="bodybg min-h-screen">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/#services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center bg-muted p-6">
            <CardTitle className="text-3xl font-bold font-headline">{service.name}</CardTitle>
            <CardDescription className="text-lg">{service.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <BookingForm 
              service={service} 
              timeSlots={availability.timeSlots} 
              disabledDates={availability.disabledDates}
              googleMapsApiKey={googleMapsApiKey}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}