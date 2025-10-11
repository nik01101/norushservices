
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MoreHorizontal, Check, X, LogOut, CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

// Mock Data
const mockBookings = [
  { bookingId: 1, name: 'John Doe', service: 'Furniture Assembly', bookingDate: '2024-07-28', bookingTime: '10:00 AM', status: 'Confirmed' },
  { bookingId: 2, name: 'Jane Smith', service: 'TV Mounting', bookingDate: '2024-07-29', bookingTime: '02:00 PM', status: 'Pending' },
  { bookingId: 3, name: 'Mike Johnson', service: 'Moving Assistance', bookingDate: '2024-07-30', bookingTime: '09:00 AM', status: 'Cancelled' },
];

const mockTimeSlots = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '01:00 PM', available: true },
  { time: '02:00 PM', available: false },
  { time: '03:00 PM', available: true },
];

const mockDisabledDates = [new Date('2024-07-25'), new Date('2024-08-01')];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState(mockBookings);
  const [timeSlots, setTimeSlots] = useState(mockTimeSlots);
  const [disabledDates, setDisabledDates] = useState(mockDisabledDates);
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [newDate, setNewDate] = useState(undefined);
  const [newTime, setNewTime] = useState(undefined);

  const handleUpdateStatus = (bookingId: number, status: string) => {
    setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status } : b));
    toast({ title: 'Booking status updated!', description: `Booking #${bookingId} has been ${status.toLowerCase()}.` });
  };

  const handleToggleDate = (date: Date, selected: any) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (selected) {
      setDisabledDates([...disabledDates, date]);
    } else {
      setDisabledDates(disabledDates.filter(d => format(d, 'yyyy-MM-dd') !== dateString));
    }
  };

  const handleToggleTimeSlot = (time: string) => {
    setTimeSlots(timeSlots.map(slot => slot.time === time ? { ...slot, available: !slot.available } : slot));
  };

  const openRescheduleDialog = (booking) => {
    setReschedulingBooking(booking);
    setNewDate(new Date(booking.bookingDate));
    setNewTime(booking.bookingTime);
  };

  const closeRescheduleDialog = () => {
    setReschedulingBooking(null);
    setNewDate(undefined);
    setNewTime(undefined);
  }

  const handleReschedule = () => {
    if (!reschedulingBooking || !newDate || !newTime) return;
    setBookings(bookings.map(b => 
      b.bookingId === reschedulingBooking.bookingId 
        ? { ...b, bookingDate: format(newDate, 'yyyy-MM-dd'), bookingTime: newTime }
        : b
    ));
    toast({ title: 'Booking Rescheduled!', description: `Booking #${reschedulingBooking.bookingId} has been moved.` });
    closeRescheduleDialog();
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex h-screen">
        <aside className="w-64 bg-background border-r p-6 hidden md:block">
          <nav className="flex flex-col space-y-4">
            <Link href="#" className="font-bold text-lg">Dashboard</Link>
            <Link href="#" className="text-muted-foreground">Bookings</Link>
            <Link href="#" className="text-muted-foreground">Availability</Link>
            <Link href="/" className="text-muted-foreground">Logout</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <div id="bookings" className="bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.bookingId}>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.bookingDate} at {booking.bookingTime}</TableCell>
                        <TableCell><Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Cancelled' ? 'destructive' : 'secondary'}>{booking.status}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateStatus(booking.bookingId, 'Confirmed')}><Check className="mr-2 h-4 w-4"/>Confirm</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(booking.bookingId, 'Cancelled')}><X className="mr-2 h-4 w-4"/>Cancel</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openRescheduleDialog(booking)}>Reschedule</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div id="availability" className="bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Calendar</h3>
                  <Calendar
                    mode="multiple"
                    selected={disabledDates}
                    onSelect={(dates) => setDisabledDates(dates || [])}
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Time Slots</h3>
                  <div className="space-y-2">
                    {timeSlots.map(slot => (
                      <div key={slot.time} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <Label htmlFor={`time-${slot.time}`}>{slot.time}</Label>
                        <Switch
                          id={`time-${slot.time}`}
                          checked={slot.available}
                          onCheckedChange={() => handleToggleTimeSlot(slot.time)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={!!reschedulingBooking} onOpenChange={closeRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>
              Select a new date and time for this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
              <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(date) => date < new Date() || disabledDates.some(d => d.toDateString() === date.toDateString())}
              />
              <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                  {timeSlots.map((slot) => (
                      <Button
                          key={slot.time}
                          variant={newTime === slot.time ? 'default' : 'secondary'}
                          onClick={() => setNewTime(slot.time)}
                          disabled={!slot.available}
                      >
                          {slot.time}
                      </Button>
                  ))}
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRescheduleDialog}>Cancel</Button>
            <Button onClick={handleReschedule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
