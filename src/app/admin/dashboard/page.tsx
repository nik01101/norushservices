
'use client';

import { useState, useEffect } from 'react';
import { useBookings, useAvailability } from '@/dataconnect-generated/react';
import { updateBookingStatus, updateAvailability } from '../../../../dataconnect/connector/mutations';
import type { TimeSlot, Booking } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';


export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const { data: availabilityData, isLoading: availabilityLoading, error: availabilityError } = useAvailability();

  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const bookings = bookingsData?.bookings || [];
  const timeSlots = availabilityData?.timeSlots || [];
  const disabledDates = availabilityData?.disabledDates.map(d => new Date(d.date)) || [];


  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast({
        title: 'Success',
        description: 'The operation was completed successfully.',
        className: 'bg-accent text-accent-foreground',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  };

  const statusMutation = useMutation({
    mutationFn: (variables: { bookingId: number, status: 'confirmed' | 'cancelled' }) => 
        updateBookingStatus({ bookingId: variables.bookingId, status: variables.status }),
    ...mutationOptions
  });

  const availabilityMutation = useMutation({
    mutationFn: (variables: { dates?: string[], timeSlots?: { time: string; available: boolean }[] }) =>
      updateAvailability(variables),
    ...mutationOptions
  });

  const rescheduleMutation = useMutation({
    mutationFn: (variables: { bookingId: number, bookingDate: string, bookingTime: string }) =>
      updateBookingStatus({ bookingId: variables.bookingId, bookingDate: variables.bookingDate, bookingTime: variables.bookingTime }),
    ...mutationOptions,
    onSuccess: () => {
        mutationOptions.onSuccess();
        closeRescheduleDialog();
    }
  })

  const handleStatusChange = (bookingId: number, status: 'confirmed' | 'cancelled') => {
    statusMutation.mutate({ bookingId, status });
  };
  
  const handleDateToggle = (date: Date | undefined) => {
    if (!date) return;
    const dateString = date.toISOString().split('T')[0];
    const newDisabledDates = disabledDates.some(d => d.toISOString().split('T')[0] === dateString)
      ? disabledDates.filter(d => d.toISOString().split('T')[0] !== dateString)
      : [...disabledDates, date];

    availabilityMutation.mutate({ dates: newDisabledDates.map(d => d.toISOString().split('T')[0]) });
  };

  const handleToggleTimeSlot = (time: string) => {
    const newTimeSlots = timeSlots.map(slot => 
      slot.time === time ? { ...slot, available: !slot.available } : slot
    );
    availabilityMutation.mutate({ timeSlots: newTimeSlots.map(({__typename, ...rest}) => rest )});
  };
  
  const openRescheduleDialog = (booking: Booking) => {
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
    rescheduleMutation.mutate({
        bookingId: reschedulingBooking.bookingId,
        bookingDate: newDate.toISOString().split('T')[0],
        bookingTime: newTime,
    });
  };

  const isLoading = bookingsLoading || availabilityLoading;
  const error = bookingsError || availabilityError;

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
                <CardTitle>Incoming Bookings</CardTitle>
                <CardDescription>Review and manage incoming service requests.</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center text-destructive">
                        <p>Failed to load data.</p>
                        <p className="text-sm">{error.message}</p>
                    </div>
                ) : (
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
                        {bookings.map((booking: Booking) => (
                            <TableRow key={booking.bookingId}>
                            <TableCell>
                                <div className="font-medium">{booking.customerName}</div>
                                <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                                <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                            </TableCell>
                            <TableCell>{booking.serviceName}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {isClient ? format(new Date(booking.bookingDate), 'PP') : ''} at {booking.bookingTime}
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
                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.bookingId, 'confirmed')} disabled={statusMutation.isPending && statusMutation.variables?.bookingId === booking.bookingId}>
                                    <Check className="mr-2 h-4 w-4" /> Confirm
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openRescheduleDialog(booking)}>
                                      <CalendarIcon className="mr-2 h-4 w-4" /> Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleStatusChange(booking.bookingId, 'cancelled')} className="text-destructive focus:bg-destructive/10 focus:text-destructive" disabled={statusMutation.isPending && statusMutation.variables?.bookingId === booking.bookingId}>
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                )}
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
                    {availabilityLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> :
                        <Calendar
                            mode="multiple"
                            selected={disabledDates}
                            onSelect={(dates) => handleDateToggle(dates?.[dates.length - 1])}
                            disabled={availabilityMutation.isPending}
                            className="p-0"
                        />
                    }
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Time Slots</CardTitle>
                    <CardDescription>Enable or disable specific time slots for all days.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {availabilityLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> :
                    timeSlots.map((slot: TimeSlot) => (
                        <div key={slot.time} className="flex items-center justify-between">
                            <Label htmlFor={`time-${slot.time}`} className={!slot.available ? 'text-muted-foreground line-through' : ''}>{slot.time}</Label>
                            <Switch
                                id={`time-${slot.time}`}
                                checked={slot.available}
                                onCheckedChange={() => handleToggleTimeSlot(slot.time)}
                                disabled={availabilityMutation.isPending}
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
            <Button onClick={handleReschedule} disabled={!newDate || !newTime || rescheduleMutation.isPending}>
                {rescheduleMutation.isPending ? 'Updating...' : 'Update Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    