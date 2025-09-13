'use client';

import '../.././globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { services, timeSlots as availableTimeSlots, disabledDates } from '@/lib/data';
import type { Service, TimeSlot } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function BookingPage({ params }: { params: { serviceId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const service = services.find((s) => s.id === params.serviceId);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime || !name || !email || !address || !phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to complete your booking.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // In a real app, this would be a server action.
    try {
        console.log('Booking submitted:', {
            serviceId: service?.id,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerAddress: address,
            bookingDate: date,
            bookingTime: selectedTime,
        });

        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'Booking Submitted!',
            description: 'We will confirm your booking shortly via email.',
            variant: 'default',
            className: 'bg-accent text-accent-foreground',
        });
        
        router.push('/booking-confirmation');
    } catch (error) {
        toast({
            title: 'Booking Failed',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="text-muted-foreground">The service you are looking for does not exist.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
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
           <form onSubmit={handleBooking} className="space-y-6">
            <h2 className="font-bold text-xl mb-4 font-headline">Enter Your Details</h2>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(123) 456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St, Anytown" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-[black] text-white" disabled={isLoading}>
              {isLoading ? 'Booking...' : `Book for $${service.price}`}
            </Button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-bold text-xl mb-4 font-headline">1. Select a Date</h2>
            <Card>
              <CardContent className="p-2 flex justify-center bg-[#faf9f2]">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || disabledDates.some(disabledDate => disabledDate.toDateString() === d.toDateString())}
                  initialFocus
                  classNames={{
                    day_selected: "bg-[black] text-white focus:bg-[black]",
                    day_outside: "text-gray-900 opacity-100",
                    day_today: "bg-[red] text-white",
                    day_disabled: "text-gray-900 opacity-100",
                    nav_button: "text-[black]",
                    head_cell: "text-[black]",
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="font-bold text-xl mb-4 font-headline">2. Select a Time</h2>
            <div className="grid grid-cols-3 gap-2">
              {availableTimeSlots.map((slot: TimeSlot) => (
                <Button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={
                  selectedTime === slot.time
                    ? "bg-[#00D6A8] text-white hover:bg-[#00D6A8] hover:text-white"
                    : "bg-[black] text-white hover:bg-[#00D6A8] hover:text-white"
                }
              >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
