
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../../dataconnect/connector/mutations';
import type { Service, TimeSlot } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BookingFormProps {
    service: Service;
    timeSlots: TimeSlot[];
    disabledDates: Date[];
}

export function BookingForm({ service, timeSlots, disabledDates }: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Booking Submitted!',
        description: "We've received your request and will confirm shortly.",
        className: 'bg-accent text-accent-foreground',
      });
      router.push('/booking-confirmation');
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Could not save your booking. Please try again.',
        variant: 'destructive',
      });
    },
  });

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

    mutation.mutate({
      serviceId: service.serviceId,
      bookingDate: format(date, 'yyyy-MM-dd'),
      bookingTime: selectedTime,
      name,
      email,
      phone,
      address,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
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
            <Button type="submit" className="w-full h-12 text-lg" disabled={mutation.isPending}>
              {mutation.isPending ? 'Booking...' : `Book for $${service.price}/hr`}
            </Button>
        </form>

        <div className="space-y-8">
          <div>
            <h2 className="font-bold text-xl mb-4 font-headline">1. Select a Date</h2>
            <Card>
              <CardContent className="p-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || disabledDates.some(disabledDate => disabledDate.toDateString() === d.toDateString())}
                  initialFocus
                />
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="font-bold text-xl mb-4 font-headline">2. Select a Time</h2>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot: TimeSlot) => (
                <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "secondary"}
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
              >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
