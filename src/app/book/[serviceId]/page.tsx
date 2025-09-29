
import '../.././globals.css';
import { getServiceById, getAvailability } from '@/../dataconnect/connector/queries';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';

export default async function BookingPage({ params }: { params: { serviceId: string } }) {
  const { data: service, error: serviceError } = await getServiceById({ serviceId: params.serviceId });
  const { data: availability, error: availabilityError } = await getAvailability({});

  if (serviceError || availabilityError) {
    console.error(serviceError || availabilityError);
    // You could render a specific error page here
    return <p>Error loading booking information.</p>;
  }

  if (!service) {
    notFound();
  }

  const timeSlots = availability?.timeSlots ?? [];
  const disabledDates = availability?.disabledDates.map(d => new Date(d.date)) ?? [];

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
          <Card className="mb-8 bg-[#00D6A8]">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-[black]">{service.name}</CardTitle>
              <CardDescription className="text-[black]">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[black]">${service.price}/hr</p>
               {service.extraFee && (
                <p className="mt-2 text-sm text-black">{service.extraFee}</p>
              )}
            </CardContent>
          </Card>
          <BookingForm service={service} timeSlots={timeSlots} disabledDates={disabledDates} />
        </div>
      </div>
    </div>
  );
}
