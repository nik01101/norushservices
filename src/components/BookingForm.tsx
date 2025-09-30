
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    toast({ title: 'In Progress', description: 'Backend for booking is being rebuilt.' });
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    router.push('/booking-confirmation');
    
    setIsLoading(false);
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
            <Button type="submit" className="w-full h-12 text-lg bg-[black] text-white" disabled={isLoading}>
              {isLoading ? 'Booking...' : `Book for $${service.price}/hr`}
            </Button>
        </form>

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
              {timeSlots.map((slot: TimeSlot) => (
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
  );
}
