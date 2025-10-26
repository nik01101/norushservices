
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Service, TimeSlot } from '@/lib/types';
import { db } from '@/firebaseConfig'; 
import { collection, addDoc, serverTimestamp, Timestamp, getDoc, doc } from 'firebase/firestore';
import { Info, Loader2 } from 'lucide-react';
import { AddressAutocompleteInput } from '@/components/ui/AddressAutocompleteInput';
import { format } from 'date-fns';

interface BookingFormProps {
  service: Service & { id: string }; 
  defaultTimeSlots: TimeSlot[]; 
  disabledDates: Date[];
  googleMapsApiKey: string | null;
}

export function BookingForm({ service, defaultTimeSlots, disabledDates, googleMapsApiKey}: BookingFormProps) {
const router = useRouter();
const { toast } = useToast();

const [date, setDate] = useState<Date | undefined>(); 
const [selectedTime, setSelectedTime] = useState<string | undefined>();
const [timeSlotsForSelectedDay, setTimeSlotsForSelectedDay] = useState<TimeSlot[]>(defaultTimeSlots);
const [additionalInfo, setAdditionalInfo] = useState('');
const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [address, setAddress] = useState('');
const [isBooking, setIsBooking] = useState(false);

const handleAddressSelect = (selectedAddress: string) => {
  setAddress(selectedAddress);
};

const handleDateSelect = (selectedDate: Date | undefined) => {
  if (selectedDate) {
    setDate(selectedDate);
  }
};

const modifiersClassNames = {
  unavailable: 'bg-muted text-muted-foreground !line-through opacity-50 cursor-not-allowed',
};

useEffect(() => {
  setDate(new Date());
}, []);

useEffect(() => {
  if (!date) return;

  const fetchAvailabilityForDate = async () => {
    setIsLoadingTimeSlots(true);
    setSelectedTime(undefined); 

    const dateId = format(date, 'yyyy-MM-dd');
    const dayDocRef = doc(db, 'daily_availability', dateId);
    const docSnap = await getDoc(dayDocRef);

    if (docSnap.exists() && !docSnap.data().isBlocked) {
      setTimeSlotsForSelectedDay(docSnap.data().timeSlots);
    } else {
      setTimeSlotsForSelectedDay(defaultTimeSlots);
    }
    setIsLoadingTimeSlots(false);
  };

  fetchAvailabilityForDate();
}, [date, defaultTimeSlots]);

const isDateUnavailable = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  return date < today || disabledDates.some(disabledDate => {
    return new Date(disabledDate).toDateString() === date.toDateString();
  });
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
      additionalInfo: additionalInfo,
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

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <form className="space-y-6">
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
                <AddressAutocompleteInput onAddressSelect={handleAddressSelect} apiKey={googleMapsApiKey}/>
            </div>

            <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information (optional)</Label>
                <Textarea 
                    id="additional-info" 
                    placeholder="e.g., specific IKEA model numbers, parking instructions, 2nd floor walk-up, etc." 
                    value={additionalInfo} 
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={4}
                />
            </div>

            <div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>
                Please note: This is a booking request. We will contact you via phone or email to confirm the final appointment details and availability.
              </p>
            </div>
            
            <Button type="submit" className="w-full h-12 text-lg" disabled={isBooking}>
              {isBooking ? 'Booking...' : `Book for ${service.price}`}
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
                  onSelect={handleDateSelect} 
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
            {isLoadingTimeSlots ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlotsForSelectedDay.map((slot: TimeSlot) => (
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
            )}
            </div>
          </div>
        </div>
  );
}
