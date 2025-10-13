
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Service, TimeSlot } from '@/lib/types';
import { db } from '@/firebaseConfig'; 
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { AddressAutocompleteInput } from '@/components/ui/AddressAutocompleteInput';


interface BookingFormProps {
  service: Service & { id: string }; 
  timeSlots: TimeSlot[];
  disabledDates: Date[];
}

export function BookingForm({ service, timeSlots, disabledDates }: BookingFormProps) {
const router = useRouter();
const { toast } = useToast();

const [date, setDate] = useState<Date | undefined>(); 
const [selectedTime, setSelectedTime] = useState<string | undefined>();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [address, setAddress] = useState('');
const [isBooking, setIsBooking] = useState(false);

const handleAddressSelect = (selectedAddress: string) => {
  setAddress(selectedAddress);
};

const modifiersClassNames = {
  unavailable: 'bg-muted text-muted-foreground !line-through opacity-50 cursor-not-allowed',
};

useEffect(() => {
  setDate(new Date());
}, []);

const isDateUnavailable = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  return date < today || disabledDates.some(disabledDate => 
    disabledDate.toDateString() === date.toDateString()
  );
}

const modifiers = {
  unavailable: isDateUnavailable,
};

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

if (!date) {
  // Render a skeleton or a simple loading message for the calendar part
  // while the client-side `useEffect` runs.
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <form className="space-y-6">
        {/* ... you can show a skeleton of the form here ... */}
      </form>
      <div className="space-y-8 animate-pulse">
          <div>
            <h2 className="font-bold text-xl mb-4 font-headline">1. Select a Date</h2>
            <div className="bg-muted rounded-lg h-[290px]"></div>
          </div>
           <div>
            <h2 className="font-bold text-xl mb-4 font-headline">2. Select a Time</h2>
            <div className="bg-muted rounded-lg h-[100px]"></div>
          </div>
      </div>
    </div>
  );
}


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
                <AddressAutocompleteInput onAddressSelect={handleAddressSelect} />
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
                 initialFocus
                 disabled={isDateUnavailable}
                 modifiers={modifiers}
                 modifiersClassNames={modifiersClassNames}
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
