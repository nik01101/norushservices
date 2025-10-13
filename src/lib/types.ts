// The 'export' keyword is essential!
export interface Service {
  id: string; 
  serviceId: string;
  name: string;
  description: string;
  price: number;
}

export interface AvailabilitySettings {
  timeSlots: TimeSlot[];
  disabledDates: string[];
}
import { Timestamp } from 'firebase/firestore';

export interface Booking {
  id: string; // The Firestore document ID
  customerName: string;
  serviceName: string;
  bookingDate: Timestamp | Date; // Comes as Timestamp, we'll convert to Date
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface TimeSlot {
  time: string;
  available: boolean;
}