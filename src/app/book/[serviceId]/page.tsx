
import '../.././globals.css';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';
import type { Service } from '@/lib/types';
import furnitureImage from '@/img/landing/1.png';
import mountingImage from '@/img/landing/2.png';
import trashImage from '@/img/landing/3.png';
import movingImage from '@/img/landing/4.png';


const placeholderServices: Omit<Service, 'imageUrl'> & { imageUrl: any }[] = [
    { id: 1, serviceId: 'furniture-assembly', name: 'Furniture Assembly', description: 'Expert assembly for your flat-pack furniture. Quick, reliable, and hassle-free.', price: 50, imageUrl: furnitureImage, imageHint: 'furniture assembly', extraFee: 'The minimum service time is 2 hours.'},
    { id: 2, serviceId: 'tv-mounting', name: 'Mounting', description: 'Secure and professional mounting services for any wall type.', price: 50, imageUrl: mountingImage, imageHint: 'living room'},
    { id: 3, serviceId: 'trash-removal', name: 'Trash Removal Furniture', description: 'Efficient removal of unwanted furniture and trash. Extra fee may apply based on weight.', price: 50, imageUrl: trashImage, imageHint: 'trash furniture removal', extraFee: 'Extra fee depending on weight'},
    { id: 4, serviceId: 'local-moving', name: 'Moving', description: 'Efficient and careful moving services for your home or office within the city.', price: 80, imageUrl: movingImage, imageHint: 'moving boxes'},
];

const placeholderTimeSlots = [
    { id: 1, time: '09:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: true },
    { id: 4, time: '12:00 PM', available: true },
    { id: 5, time: '01:00 PM', available: false },
    { id: 6, time: '02:00 PM', available: true },
    { id: 7, time: '03:00 PM', available: true },
    { id: 8, time: '04:00 PM', available: true },
];

const placeholderDisabledDates = [new Date('2024-08-25')];


export default async function BookingPage({ params }: { params: { serviceId: string } }) {
  const service = placeholderServices.find(s => s.serviceId === params.serviceId);

  if (!service) {
    notFound();
  }

  const timeSlots = placeholderTimeSlots;
  const disabledDates = placeholderDisabledDates;

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
              <p className="text-4xl font-bold text-primary">${service.price}/hr</p>
               {service.extraFee && (
                <p className="mt-2 text-sm text-secondary-foreground">{service.extraFee}</p>
              )}
            </CardContent>
          </Card>
          <BookingForm service={service as Service} timeSlots={timeSlots} disabledDates={disabledDates} />
        </div>
      </div>
    </div>
  );
}

