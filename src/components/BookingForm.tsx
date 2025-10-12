
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Service, TimeSlot } from '@/lib/types';
import { db } from '@/firebaseConfig'; 
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface BookingFormProps {
  service: Service & { id: string }; 
  timeSlots: TimeSlot[];
  disabledDates: Date[];
}

export function BookingForm({ service, timeSlots, disabledDates }: BookingFormProps) {
const router = useRouter();
const { toast } = useToast();

const [date, setDate] = useState<Date | undefined>(new Date());
const [selectedTime, setSelectedTime] = useState<string | undefined>();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [address, setAddress] = useState('');
const [isBooking, setIsBooking] = useState(false);

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

  setIsBooking(true);

  try {
    const bookingDateTime = new Date(date);
    const [time, period] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    bookingDateTime.setHours(hours, minutes, 0, 0);

    const newBookingData = {
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      bookingDate: Timestamp.fromDate(bookingDateTime),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const bookingsCollectionRef = collection(db, 'bookings');
    await addDoc(bookingsCollectionRef, newBookingData);

    toast({
      title: 'Booking Submitted!',
      description: "We've received your request and will confirm shortly.",
      className: 'bg-accent text-accent-foreground',
    });
    router.push('/booking-confirmation');

  } catch (error) {
    console.error("Error creating booking:", error);
    toast({
      title: 'Booking Failed',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsBooking(false);
  }
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
            <Button type="submit" className="w-full h-12 text-lg" disabled={isBooking}>
              {isBooking ? 'Booking...' : `Book for $${service.price}/hr`}
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
