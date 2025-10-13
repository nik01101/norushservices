
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MoreHorizontal, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Mail, Trash2, CheckCircle } from 'lucide-react'; // Add some new icons
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Import Card components
// 1. Import Firebase
import { db } from '@/firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: Date;
}
// 2. Define Types (or import them)
interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  bookingDate: Date; // We will work with Date objects on the client
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}
interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // 3. Initialize state with empty arrays and loading flags
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | undefined>(undefined);

  // 4. Fetch Bookings in real-time
  useEffect(() => {
    const bookingsQuery = query(collection(db, 'bookings'), orderBy('bookingDate', 'asc'));
    
    const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        bookingDate: (doc.data().bookingDate as Timestamp).toDate(), // Convert Firestore Timestamp to JS Date
      } as Booking));
      setBookings(bookingsData);
      setIsLoadingBookings(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // 5. Fetch Availability in real-time
  useEffect(() => {
    const availabilityDocRef = doc(db, 'availability', 'settings');

    const unsubscribe = onSnapshot(availabilityDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTimeSlots(data.timeSlots || []);
        setDisabledDates(data.disabledDates.map((d: string) => new Date(d)) || []); // Convert strings to Dates
      }
      setIsLoadingAvailability(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const messagesQuery = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp).toDate(),
        } as ContactMessage));
        setMessages(messagesData);
        setIsLoadingMessages(false);
    });

    return () => unsubscribe(); // Cleanup listener
}, []);

const handleMarkAsRead = async (messageId: string) => {
    const messageDocRef = doc(db, 'contact_messages', messageId);
    try {
        await updateDoc(messageDocRef, { status: 'read' });
        toast({ title: 'Success!', description: 'Message marked as read.' });
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to update message.', variant: 'destructive' });
    }
};

  // --- Rewritten Handler Functions to use Firestore ---

  const handleUpdateStatus = async (bookingId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    try {
      await updateDoc(bookingDocRef, { status });
      toast({ title: 'Success!', description: `Booking status updated to ${status}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update booking status.', variant: 'destructive' });
    }
  };

  const handleUpdateAvailability = async (updates: { timeSlots?: TimeSlot[], disabledDates?: string[] }) => {
    const availabilityDocRef = doc(db, 'availability', 'settings');
    try {
      await updateDoc(availabilityDocRef, updates);
      toast({ title: 'Success!', description: 'Availability has been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update availability.', variant: 'destructive' });
    }
  };

  const handleToggleTimeSlot = (time: string) => {
    const newTimeSlots = timeSlots.map(slot => 
      slot.time === time ? { ...slot, available: !slot.available } : slot
    );
    setTimeSlots(newTimeSlots); // Optimistic UI update
    handleUpdateAvailability({ timeSlots: newTimeSlots });
  };

  const handleDateSelection = (selectedDates: Date[] | undefined) => {
    const newDisabledDates = selectedDates || [];
    setDisabledDates(newDisabledDates); // Optimistic UI update
    const dateStrings = newDisabledDates.map(d => d.toISOString());
    handleUpdateAvailability({ disabledDates: dateStrings });
  };

  const openRescheduleDialog = (booking: Booking) => {
    setReschedulingBooking(booking);
    setNewDate(new Date(booking.bookingDate));
    const timeString = format(booking.bookingDate, 'hh:mm a');
    setNewTime(timeString);
  };

  const closeRescheduleDialog = () => {
    setReschedulingBooking(null);
    setNewDate(undefined);
    setNewTime(undefined);
  }

  const handleReschedule = async () => {
    if (!reschedulingBooking || !newDate || !newTime) return;

    const bookingDocRef = doc(db, 'bookings', reschedulingBooking.id);
    const combinedDateTime = new Date(newDate);
    const [time, period] = newTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    combinedDateTime.setHours(hours, minutes, 0, 0);

    try {
      await updateDoc(bookingDocRef, { bookingDate: Timestamp.fromDate(combinedDateTime) });
      toast({ title: 'Booking Rescheduled!', description: `Booking for ${reschedulingBooking.customerName} has been moved.` });
      closeRescheduleDialog();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reschedule booking.', variant: 'destructive' });
    }
  };

  // --- JSX with Loading States ---

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex h-screen">
        {/* ... (aside/nav remains the same) ... */}

        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div id="messages" className="bg-background p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Mail /> Inbox
              </h2>
              {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {messages.map(msg => (
                          <Card key={msg.id} className={msg.status === 'unread' ? 'border-primary' : ''}>
                              <CardHeader className="flex flex-row items-center justify-between pb-2">
                                  <CardTitle className="text-sm font-medium">
                                      From: {msg.name} ({msg.email})
                                  </CardTitle>
                                  <span className="text-xs text-muted-foreground">
                                      {format(msg.createdAt, 'MMM d, p')}
                                  </span>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-sm text-foreground">{msg.message}</p>
                                  {msg.status === 'unread' && (
                                      <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2"
                                          onClick={() => handleMarkAsRead(msg.id)}
                                      >
                                          <CheckCircle className="mr-2 h-4 w-4" /> Mark as Read
                                      </Button>
                                  )}
                              </CardContent>
                          </Card>
                      ))}
                  </div>
              )}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div id="bookings" className="bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
              {isLoadingBookings ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>{/* ... */}</TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell>{format(booking.bookingDate, 'MMM d, yyyy')} at {format(booking.bookingDate, 'p')}</TableCell>
                          <TableCell><Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Cancelled' ? 'destructive' : 'secondary'}>{booking.status}</Badge></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}><Check className="mr-2 h-4 w-4"/>Confirm</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}><X className="mr-2 h-4 w-4"/>Cancel</DropdownMenuItem>
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
              )}
            </div>

            <div id="availability" className="bg-background p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
              {isLoadingAvailability ? (
                 <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Block off Dates</h3>
                    <Calendar
                      mode="multiple"
                      selected={disabledDates}
                      onSelect={handleDateSelection}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Time Slots</h3>
                    <div className="space-y-2">
                      {timeSlots.map(slot => (
                        <div key={slot.time} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <Label htmlFor={`time-${slot.time}`}>{slot.time}</Label>
                          <Switch id={`time-${slot.time}`} checked={slot.available} onCheckedChange={() => handleToggleTimeSlot(slot.time)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
