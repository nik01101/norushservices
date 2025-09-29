export type Service = {
  id: number;
  serviceId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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
  serviceId: number;
  bookingDate: string; // ISO date string
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // ISO datetime string
};

export type TimeSlot = {
  id: number;
  time: string;
  available: boolean;
};

export type DisabledDate = {
    id: number;
    date: string; // ISO date string
}
