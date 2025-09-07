'use client';

import { useState } from 'react';
import { bookings as initialBookings, services, timeSlots as initialTimeSlots, disabledDates as initialDisabledDates } from '@/lib/data';
import type { Booking, TimeSlot } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [disabledDates, setDisabledDates] = useState<Date[]>(initialDisabledDates);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const { toast } = useToast();

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || 'Unknown Service';
  };

  const handleStatusChange = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setBookings(currentBookings =>
      currentBookings.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
    toast({
      title: 'Booking Updated',
      description: `Booking has been ${status}.`,
      className: 'bg-accent text-accent-foreground',
    });
  };
  
  const handleDateToggle = (date: Date | undefined) => {
    if (!date) return;
    setDisabledDates(prev => {
        const dateString = date.toDateString();
        const isAlreadyDisabled = prev.some(d => d.toDateString() === dateString);
        if (isAlreadyDisabled) {
            return prev.filter(d => d.toDateString() !== dateString);
        } else {
            return [...prev, date];
        }
    });
  };

  const toggleTimeSlot = (time: string) => {
    setTimeSlots(prev => prev.map(slot => slot.time === time ? {...slot, available: !slot.available} : slot));
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
                        <TableRow key={booking.id}>
                        <TableCell>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                        </TableCell>
                        <TableCell>{getServiceName(booking.serviceId)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                            {format(booking.bookingDate, 'MM/dd/yyyy')} at {booking.bookingTime}
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
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                                <Check className="mr-2 h-4 w-4" /> Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
                                onCheckedChange={() => toggleTimeSlot(slot.time)}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
