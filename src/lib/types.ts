
import { StaticImageData } from 'next/image';

export type Service = {
  id: number;
  serviceId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | StaticImageData;
  imageHint: string;
  extraFee?: string;
};

export type User = {
    userId: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
}

export type Booking = {
  bookingId: number;
  userId: number;
  serviceId: string;
  bookingDate: string; // ISO date string
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // ISO datetime string
  customerName: string,
  customerEmail: string,
  customerPhone: string | null,
  serviceName: string
};

export type TimeSlot = {
  __typename: 'TimeSlots',
  time: string;
  available: boolean;
};

export type DisabledDate = {
    date: string; // ISO date string
}
