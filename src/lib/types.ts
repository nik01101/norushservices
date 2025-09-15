export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  extraFee?: string;
};

export type Booking = {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  bookingDate: Date;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export type TimeSlot = {
  time: string;
  available: boolean;
};
