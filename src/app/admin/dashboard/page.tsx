
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MoreHorizontal, Check, X, Loader2, LogOut, ExternalLink, ShieldCheck, Mail, Trash2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { db, auth } from '@/firebaseConfig';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, setDoc, getDocs, getDoc, where, limit, startAfter, endBefore, limitToLast } from 'firebase/firestore';
import { sendBookingStatusConfirmationEmail, sendBookingCancellationEmail } from '@/lib/email';

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
  additionalInfo?: string;
  customerAddress: string; 
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}
interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/admin/login');
      } else {
        setCurrentUser(user);
        setIsAuthChecking(false);
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
      toast({ title: 'Signed out successfully' });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

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
  const allDocsRef = useRef<Map<string, Booking>>(new Map()); // tracks all loaded bookings across pagination switches
  const docsInViewRefs = useRef<import('firebase/firestore').DocumentReference[]>([]); // refs currently monitored by onSnapshot

  const [lastVisible, setLastVisible] = useState<any>(null); // Stores the last document of the current page
  const [firstVisible, setFirstVisible] = useState<any>(null); // Stores the first document of the current page
  const [paginationKey, setPaginationKey] = useState(0); // toggles to re-trigger subscription useEffect on pagination change
  const [page, setPage] = useState(1);
  const bookingsPerPage = 10;

  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [timeSlotsForReschedule, setTimeSlotsForReschedule] = useState<TimeSlot[]>([]);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | undefined>(undefined);

  const fetchBookings = (direction: 'next' | 'prev' | 'initial' = 'initial') => {
    setIsLoadingBookings(true);

    let q = query(
      collection(db, 'bookings'), 
      orderBy('bookingDate', 'asc')
    );

    if (direction === 'next' && lastVisible) {
      q = query(q, startAfter(lastVisible), limit(bookingsPerPage));
      setPage(prev => prev + 1);
    } else if (direction === 'prev' && firstVisible) {
      q = query(q, endBefore(firstVisible), limitToLast(bookingsPerPage));
      setPage(prev => prev - 1);
    } else { // Initial fetch or edge case
      q = query(q, limit(bookingsPerPage));
      setPage(1);
    }

    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setFirstVisible(firstDoc);
        setLastVisible(lastDoc);

        const docsInView = querySnapshot.docs.map(d => d.ref);
        docsInViewRefs.current = docsInView;

        const loaded: Booking[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), bookingDate: (doc.data().bookingDate as Timestamp).toDate() } as Booking));
        
        // merge into allDocsRef so real-time listener has fresh data to work with
        const updatedMap = new Map(allDocsRef.current);
        loaded.forEach(b => updatedMap.set(b.id, b));
        allDocsRef.current = updatedMap;

        setBookings(loaded);
        setPaginationKey(prev => prev + 1); // re-trigger subscription for new docs
      } else if (direction !== 'initial') {
        if (direction === 'next') setPage(prev => prev - 1);
        if (direction === 'prev') {
          const pageBeforeLast = page - 2 >= 1 ? page - 2 : 1;
          setPage(pageBeforeLast);
        }
        toast({ title: "No more bookings to show.", variant: 'destructive' });
      }
      setIsLoadingBookings(false);
    });
  };

  // Initial fetch + real-time subscription setup — runs on mount and when doc refs change during pagination
  useEffect(() => {
    if (page === 1 && !firstVisible) {
      allDocsRef.current.clear();
      fetchBookings('initial');
    }
  }, [page, firstVisible]);

  // Real-time subscription: keep current-view bookings live-updated via onSnapshot
  const subscriptionRefs = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    // Unsubscribe from all previously watched docs
    subscriptionRefs.current.forEach(unsub => unsub());
    subscriptionRefs.current.clear();

    // Attach listeners for each doc currently in view
    docsInViewRefs.current.forEach(ref => {
      const unsub = onSnapshot(ref, (docSnap) => {
        if (!docSnap.exists()) return;
        const booking: Booking = { id: docSnap.id, ...docSnap.data(), bookingDate: (docSnap.data().bookingDate as Timestamp).toDate() } as Booking;

        const updatedMap = new Map(allDocsRef.current);
        const wasExisting = updatedMap.has(booking.id);
        if (!wasExisting) {
          // Only visible doc arrived real-time — extend view
          docsInViewRefs.current.push(ref);
        }
        updatedMap.set(booking.id, booking);
        allDocsRef.current = updatedMap;

        setBookings(prev => prev.map(b => b.id === booking.id ? booking : b));
      });
      subscriptionRefs.current.set(ref.id, unsub);
    });

    return () => {
      // cleanup handled at top of effect
    };
  }, [docsInViewRefs, paginationKey]);


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


const handleUpdateStatus = async (booking: Booking, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
  const bookingDocRef = doc(db, 'bookings', booking.id); 

  try {
    await updateDoc(bookingDocRef, { status });
    toast({ title: 'Success!', description: `Booking status updated to ${status}.` });

    // Send customer email when booking is confirmed or cancelled
    const date = booking.bookingDate instanceof Date 
      ? booking.bookingDate 
      : (booking.bookingDate as Timestamp).toDate();
    
    if (status === 'Confirmed') {
      sendBookingStatusConfirmationEmail({
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: booking.serviceName,
        formattedDate: format(date, 'EEEE, MMMM d, yyyy'),
        formattedTime: format(date, 'hh:mm a'),
        customerAddress: booking.customerAddress,
        additionalInfo: booking.additionalInfo,
      }).catch((err) => console.warn('[EMAIL WARNING] Failed to send confirmation email:', err));
    }

    if (status === 'Cancelled') {
      sendBookingCancellationEmail({
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: booking.serviceName,
        formattedDate: format(date, 'EEEE, MMMM d, yyyy'),
        formattedTime: format(date, 'hh:mm a'),
        customerAddress: booking.customerAddress,
        additionalInfo: booking.additionalInfo,
      }).catch((err) => console.warn('[EMAIL WARNING] Failed to send cancellation email:', err));
    }

  } catch (error) {
    console.error("Error updating status or sending email:", error);
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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Verifying administrator session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex h-screen">

        <main className="flex-1 p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Authenticated as: <span className="font-medium text-foreground">{currentUser?.email || 'Admin'}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  View Live Site
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>
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
                    <TableHeader>
                      <TableRow className="hidden md:table-row">
                        <TableHead>Customer & Contact</TableHead>
                        <TableHead>Service & Address</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow 
                          key={booking.id} 
                          className="block md:table-row border-b md:border-b-0 mb-4 md:mb-0"
                        >

                          <TableCell className="block md:table-cell">
                            <span className="font-bold md:hidden">Customer: </span>
                            <div className="font-medium inline md:block">{booking.customerName}</div>
                            <div className="text-sm text-muted-foreground pl-4 md:pl-0">
                              <div>{booking.customerEmail}</div>
                              <div>{booking.customerPhone}</div>
                            </div>
                          </TableCell>

                          <TableCell className="block md:table-cell">
                            <span className="font-bold md:hidden">Service: </span>
                            <div className="font-medium inline md:block">{booking.serviceName}</div>
                            <div className="text-sm text-muted-foreground pl-4 md:pl-0">
                              <div>{booking.customerAddress}</div> 
                              {booking.additionalInfo && (
                                <p className="text-xs italic mt-1">"{booking.additionalInfo}"</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="block md:table-cell">
                            <span className="font-bold md:hidden">When: </span>
                            <span className="text-sm">
                              {format(booking.bookingDate, 'MMM d, yyyy')} at {format(booking.bookingDate, 'p')}
                            </span>
                          </TableCell>
                          <TableCell className="block md:table-cell">
                            <span className="font-bold md:hidden mr-2">Status: </span>
                            <Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="block md:table-cell text-right pr-2 md:pr-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUpdateStatus(booking, 'Confirmed')}>
                                  <Check className="mr-2 h-4 w-4"/>Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(booking, 'Cancelled')}>
                                  <X className="mr-2 h-4 w-4"/>Cancel
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openRescheduleDialog(booking)}>
                                  Reschedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="flex items-center justify-end space-x-2 py-4">
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchBookings('prev')}
                  disabled={page <= 1} 
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchBookings('next')}
                  disabled={bookings.length < bookingsPerPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
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
