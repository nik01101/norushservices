export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
};

export type Booking = {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  bookingDate: Date;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export type TimeSlot = {
  time: string;
  available: boolean;
};
