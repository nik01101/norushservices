import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';
import type { Service, AvailabilitySettings, TimeSlot } from '@/lib/types';
import { getGoogleMapsApiKey } from '@/lib/server-utils';

import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, limit, Timestamp } from 'firebase/firestore';

async function getServiceByServiceId(serviceId: string): Promise<Service> {
  const servicesCollectionRef = collection(db, 'services');
  const q = query(servicesCollectionRef, where('serviceId', '==', serviceId), limit(1));
  
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    notFound();
  }

  const serviceDoc = querySnapshot.docs[0];
  return {
    id: serviceDoc.id, 
    ...serviceDoc.data(),
  } as Service;
}

async function getAvailability() {
  const settingsDocRef = doc(db, 'availability', 'settings');
  const settingsDocSnap = await getDoc(settingsDocRef);
  
  if (!settingsDocSnap.exists()) {
    throw new Error("Availability settings not found in the database.");
  }
  const settingsData = settingsDocSnap.data();
  
  const dailyAvailabilityRef = collection(db, 'daily_availability');
  const q = query(dailyAvailabilityRef, where('isBlocked', '==', true));
  const querySnapshot = await getDocs(q);
  
  const globallyDisabledDates = (settingsData.disabledDates || []).map((dateStr: string) => new Date(dateStr));
  const dailyBlockedDates = querySnapshot.docs.map(doc => (doc.data().date as Timestamp).toDate());
  const allDisabledDates = [...globallyDisabledDates, ...dailyBlockedDates];
  
  return {
    defaultTimeSlots: settingsData.timeSlots,
    disabledDates: allDisabledDates,
  };
}


export default async function BookingPage({ params }: { params: { serviceId: string } }) {
  console.log(
    "[SERVER LOG] Checking Google Maps API Key:", 
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  );
  const [service, availability, googleMapsApiKey] = await Promise.all([
    getServiceByServiceId(params.serviceId),
    getAvailability(),
    getGoogleMapsApiKey() 
  ]);
  
  if (!googleMapsApiKey) {
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
              defaultTimeSlots={availability.defaultTimeSlots} 
              disabledDates={availability.disabledDates}
              googleMapsApiKey={googleMapsApiKey}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}