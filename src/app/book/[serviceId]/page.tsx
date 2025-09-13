import '../.././globals.css';
import { services, timeSlots, disabledDates } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';

export default function BookingPage({ params }: { params: { serviceId: string } }) {
  const service = services.find((s) => s.id === params.serviceId);

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
          <Card className="mb-8 bg-[#00D6A8]">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-[black]">{service.name}</CardTitle>
              <CardDescription className="text-[black]">{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[black]">${service.price}</p>
            </CardContent>
          </Card>
          <BookingForm service={service} timeSlots={timeSlots} disabledDates={disabledDates} />
        </div>
      </div>
    </div>
  );
}
