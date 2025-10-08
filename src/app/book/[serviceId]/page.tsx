
'use client';

import '../.././globals.css';
import { notFound } from 'next/navigation';
import { useServiceById, useAvailability } from '@/dataconnect-generated/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';
import type { Service } from '@/lib/types';


export default function BookingPage({ params }: { params: { serviceId: string } }) {
  const { data: serviceData, isLoading: serviceLoading, error: serviceError } = useServiceById({ serviceId: params.serviceId });
  const { data: availabilityData, isLoading: availabilityLoading, error: availabilityError } = useAvailability();

  const service = serviceData?.service;
  const timeSlots = availabilityData?.timeSlots || [];
  const disabledDates = availabilityData?.disabledDates.map(d => new Date(d.date)) || [];
  
  const isLoading = serviceLoading || availabilityLoading;
  const error = serviceError || availabilityError;

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center text-destructive">
        <p>Failed to load booking information.</p>
        <p className="text-sm">{error.message}</p>
        <Button variant="outline" asChild className="mt-4">
            <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
            </Link>
        </Button>
      </div>
     )
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Card className="mb-8 bg-secondary text-secondary-foreground">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{service.name}</CardTitle>
              <CardDescription className="text-secondary-foreground/80">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">${service.price}/hr</p>
               {service.extraFee && (
                <p className="mt-2 text-sm text-secondary-foreground/80">{service.extraFee}</p>
              )}
            </CardContent>
          </Card>
          <BookingForm service={service as Service} timeSlots={timeSlots} disabledDates={disabledDates} />
        </div>
      </div>
    </div>
  );
}
