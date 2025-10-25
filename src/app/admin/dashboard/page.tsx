
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Mail, Trash2, CheckCircle } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { db } from '@/firebaseConfig';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, setDoc,getDoc, where } from 'firebase/firestore';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: Date;
}
interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;  
  customerPhone: string;
  serviceName: string;
  bookingDate: Date; 
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlotsForDay, setTimeSlotsForDay] = useState<TimeSlot[]>([]);
  const [defaultTimeSlots, setDefaultTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isDayBlocked, setIsDayBlocked] = useState(false);
  const [dateForEditing, setDateForEditing] = useState<Date | undefined>();
  const [fullyBlockedDates, setFullyBlockedDates] = useState<Date[]>([]);


  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [timeSlotsForReschedule, setTimeSlotsForReschedule] = useState<TimeSlot[]>([]);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    const bookingsQuery = query(collection(db, 'bookings'), orderBy('bookingDate', 'asc'));
    
    const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        customerEmail: doc.data().customerEmail, 
        customerPhone: doc.data().customerPhone,
        ...doc.data(),
        bookingDate: (doc.data().bookingDate as Timestamp).toDate(), 
      } as Booking));
      setBookings(bookingsData);
      setIsLoadingBookings(false);
    });

    return () => unsubscribe(); 
  }, []);

   useEffect(() => {
    const unsub = onSnapshot(doc(db, 'availability', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        setDefaultTimeSlots(docSnap.data().timeSlots || []);
      }
      setIsLoadingAvailability(false); 
    });
    return () => unsub();
  }, []);

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    setDateForEditing(date); 
    setIsModalOpen(true);
    setIsLoadingSlots(true);
  
    const dateId = format(date, 'yyyy-MM-dd');
    const dayDocRef = doc(db, 'daily_availability', dateId);
    const docSnap = await getDoc(dayDocRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      setTimeSlotsForDay(data.timeSlots);
      setIsDayBlocked(data.isBlocked || false); 
    } else {
      setTimeSlotsForDay(defaultTimeSlots);
      setIsDayBlocked(false);
    }
    setIsLoadingSlots(false);
  };

  const handleToggleTimeSlotInModal = (time: string) => {
    const updatedSlots = timeSlotsForDay.map(slot =>
      slot.time === time ? { ...slot, available: !slot.available } : slot
    );
    setTimeSlotsForDay(updatedSlots);
  };

  const handleSaveChanges = async () => {
    if (!selectedDate) return;
  
    const dateId = format(selectedDate, 'yyyy-MM-dd');
    const dayDocRef = doc(db, 'daily_availability', dateId);
  
    try {
      await setDoc(dayDocRef, {
        timeSlots: timeSlotsForDay,
        isBlocked: isDayBlocked, 
        date: Timestamp.fromDate(selectedDate)
      }, { merge: true });
  
      toast({ title: 'Success!', description: `Availability for ${dateId} has been saved.` });
      setIsModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    const dailyAvailabilityRef = collection(db, 'daily_availability');
    const q = query(dailyAvailabilityRef, where('isBlocked', '==', true));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const blockedDates = querySnapshot.docs.map(doc => 
        (doc.data().date as Timestamp).toDate()
      );
      setFullyBlockedDates(blockedDates);
    });
  
    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (!newDate) return;
  
    const fetchAvailabilityForReschedule = async () => {
      const dateId = format(newDate, 'yyyy-MM-dd');
      const dayDocRef = doc(db, 'daily_availability', dateId);
      const docSnap = await getDoc(dayDocRef);
      
      if (docSnap.exists()) {
        setTimeSlotsForReschedule(docSnap.data().timeSlots);
      } else {
        setTimeSlotsForReschedule(defaultTimeSlots);
      }
    };
  
    fetchAvailabilityForReschedule();
  }, [newDate, defaultTimeSlots]);

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

    return () => unsubscribe(); 
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


  const handleUpdateStatus = async (bookingId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    const bookingDocRef = doc(db, 'bookings', bookingId);
    try {
      await updateDoc(bookingDocRef, { status });
      toast({ title: 'Success!', description: `Booking status updated to ${status}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update booking status.', variant: 'destructive' });
    }
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

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return date < today;
  };

  const calendarModifiers = {
    blocked: fullyBlockedDates,
  };

  const calendarModifiersClassNames = {
    blocked: 'bg-muted text-muted-foreground !line-through opacity-50',
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex h-screen">

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
                              <CardHeader className="flex flex-row items-start justify-between pb-2">
                                  <div>
                                      <CardTitle className="text-base font-medium">
                                          From: {msg.name}
                                      </CardTitle>
                                      <div className="text-sm text-muted-foreground">{msg.email}</div>
                                      {msg.phone && (
                                          <div className="text-sm text-muted-foreground">{msg.phone}</div>
                                      )}
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                      {msg.status === 'unread' ? (
                                          <Badge>Unread</Badge>
                                      ) : (
                                          <Badge variant="secondary">Read</Badge>
                                      )}
                                      <span className="text-xs text-muted-foreground">
                                          {format(msg.createdAt, 'MMM d, p')}
                                      </span>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
                                  {msg.status === 'unread' && (
                                      <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-4"
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
                    <TableHeader></TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground hidden md:block">
                              {booking.customerEmail}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {booking.customerPhone}
                            </div>
                          </TableCell>
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
              <h2 className="text-2xl font-bold mb-4">Manage Daily Availability</h2>
                {isLoadingAvailability ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Click a date on the calendar below to manage its specific time slots.
                  </p>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={dateForEditing} 
                      onSelect={(date) => date && handleDateClick(date)}
                      modifiers={calendarModifiers}
                      modifiersClassNames={calendarModifiersClassNames}
                      disabled={isDateInPast}
                      initialFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Manage Availability for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
            <DialogDescription>
              Toggle time slots on or off for this specific day.
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingSlots ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto pr-6">
              <h4 className="font-medium text-muted-foreground">Individual Time Slots</h4>
              {timeSlotsForDay.map(slot => (
                <div key={slot.time} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <Label htmlFor={`time-modal-${slot.time}`}>{slot.time}</Label>
                  <Switch
                    id={`time-modal-${slot.time}`}
                    checked={slot.available}
                    onCheckedChange={() => handleToggleTimeSlotInModal(slot.time)}
                  />
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reschedulingBooking} onOpenChange={closeRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>
              Select a new date and time. Available times for the selected date are shown below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4 max-h-[75vh] overflow-y-auto pr-6">
          
              <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              />

              <div className="w-full max-w-sm pt-4">
                <h4 className="font-semibold text-center mb-2">Select a New Time</h4>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlotsForReschedule.map((slot) => (
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
