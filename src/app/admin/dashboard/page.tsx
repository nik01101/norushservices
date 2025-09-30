
'use client';

import { useState, useEffect } from 'react';
import type { Booking, TimeSlot, Service, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MoreHorizontal, Check, X, LogOut, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

type EnrichedBooking = Booking & {
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    serviceName: string;
};

// Placeholder Data
const placeholderBookings: EnrichedBooking[] = [
    { bookingId: 1, userId: 1, serviceId: 1, bookingDate: '2024-08-15', bookingTime: '10:00 AM', status: 'pending', createdAt: '2024-08-01T10:00:00Z', customerName: 'John Doe', customerEmail: 'john@example.com', customerPhone: '123-456-7890', serviceName: 'Furniture Assembly'},
    { bookingId: 2, userId: 2, serviceId: 2, bookingDate: '2024-08-16', bookingTime: '02:00 PM', status: 'confirmed', createdAt: '2024-08-02T11:00:00Z', customerName: 'Jane Smith', customerEmail: 'jane@example.com', customerPhone: '987-654-3210', serviceName: 'TV Mounting' },
];

const placeholderTimeSlots: TimeSlot[] = [
    { id: 1, time: '09:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: false },
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>(placeholderBookings);
  const [disabledDates, setDisabledDates] = useState<Date[]>([new Date('2024-08-25')]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(placeholderTimeSlots);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState<EnrichedBooking | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
    // fetchData(); // Temporarily disabled
  }, []);

  const fetchData = async () => {
    // Data fetching logic will be re-implemented here
    toast({ title: 'Info', description: 'Backend functionality is being rebuilt.', variant: 'default' });
  };


  const handleStatusChange = async (bookingId: number, status: 'confirmed' | 'cancelled') => {
    toast({ title: 'In Progress', description: `Backend action for status change is being rebuilt.`, });
  };
  
  const handleDateToggle = async (date: Date | undefined) => {
    if (!date) return;
    toast({ title: 'In Progress', description: `Backend action for date toggle is being rebuilt.`, });
  };

  const handleToggleTimeSlot = async (time: string) => {
    toast({ title: 'In Progress', description: `Backend action for time slot toggle is being rebuilt.`, });
  };
  
  const openRescheduleDialog = (booking: EnrichedBooking) => {
    setReschedulingBooking(booking);
    setNewDate(new Date(booking.bookingDate));
    setNewTime(booking.bookingTime);
  };
  
  const closeRescheduleDialog = () => {
    setReschedulingBooking(null);
    setNewDate(undefined);
    setNewTime(undefined);
  }

  const handleReschedule = async () => {
    if (!reschedulingBooking || !newDate || !newTime) return;
    toast({ title: 'In Progress', description: `Backend action for rescheduling is being rebuilt.`, });
    closeRescheduleDialog();
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-bold font-headline">Admin Dashboard</h1>
          <Link href="/admin/login">
            <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 md:px-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Pending Bookings</CardTitle>
                <CardDescription>Review and manage incoming service requests.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                        <TableCell>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                            <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                        </TableCell>
                        <TableCell>{booking.serviceName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {isClient ? format(new Date(booking.bookingDate), 'MM/dd/yyyy') : ''} at {booking.bookingTime}
                        </TableCell>
                        <TableCell>
                            <Badge variant={booking.status === 'pending' ? 'secondary' : booking.status === 'confirmed' ? 'default' : 'destructive'}
                             className={booking.status === 'confirmed' ? 'bg-accent text-accent-foreground' : ''}>
                                {booking.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.bookingId, 'confirmed')}>
                                <Check className="mr-2 h-4 w-4" /> Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openRescheduleDialog(booking)}>
                                  <CalendarIcon className="mr-2 h-4 w-4" /> Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.bookingId, 'cancelled')} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <X className="mr-2 h-4 w-4" /> Cancel
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Availability</CardTitle>
                    <CardDescription>Disable dates that are not available for booking.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="multiple"
                        selected={disabledDates}
                        onSelect={(dates) => handleDateToggle(dates?.[dates.length - 1])}
                        className="p-0"
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Time Slots</CardTitle>
                    <CardDescription>Enable or disable specific time slots for all days.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {timeSlots.map(slot => (
                        <div key={slot.time} className="flex items-center justify-between">
                            <Label htmlFor={`time-${slot.time}`} className={!slot.available ? 'text-muted-foreground line-through' : ''}>{slot.time}</Label>
                            <Switch
                                id={`time-${slot.time}`}
                                checked={slot.available}
                                onCheckedChange={() => handleToggleTimeSlot(slot.time)}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </main>
      <Dialog open={!!reschedulingBooking} onOpenChange={(isOpen) => !isOpen && closeRescheduleDialog()}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>
              Select a new date and time for the booking for {reschedulingBooking?.customerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-8 py-4">
            <div>
              <h3 className="font-semibold mb-4 text-center">Select New Date</h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || disabledDates.some(disabledDate => disabledDate.toDateString() === d.toDateString())}
                  initialFocus
                  className="p-0"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-center">Select New Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot: TimeSlot) => (
                  <Button
                    key={slot.time}
                    variant={newTime === slot.time ? 'default' : 'outline'}
                    disabled={!slot.available}
                    onClick={() => setNewTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRescheduleDialog}>Cancel</Button>
            <Button onClick={handleReschedule} disabled={!newDate || !newTime}>Update Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
