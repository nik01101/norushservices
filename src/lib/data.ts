import type { Service, Booking, TimeSlot } from './types';

export const services: Service[] = [
  {
    id: 'furniture-assembly',
    name: 'Furniture Assembly',
    description: 'Expert assembly for your flat-pack furniture. Quick, reliable, and hassle-free.',
    price: 50,
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'furniture assembly',
  },
  {
    id: 'tv-mounting',
    name: 'Mounting',
    description: 'Secure and professional mounting services for any wall type.',
    price: 120,
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'living room',
  },
  {
    id: 'shelf-installation',
    name: 'Trash Removal Furniture',
    description: 'Perfectly level and securely installed shelves to organize your space.',
    price: 60,
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'shelf wall',
  },
  {
    id: 'local-moving',
    name: 'Moving',
    description: 'Efficient and careful moving services for your home or office within the city.',
    price: 350,
    imageUrl: 'https://picsum.photos/600/400',
    imageHint: 'moving boxes',
  },
];

export const bookings: Booking[] = [
  {
    id: 'booking-1',
    serviceId: 'furniture-assembly',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '(123) 456-7890',
    customerAddress: '123 Main St, Anytown, USA',
    bookingDate: new Date('2024-08-15'),
    bookingTime: '10:00 AM',
    status: 'pending',
  },
  {
    id: 'booking-2',
    serviceId: 'tv-mounting',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '(234) 567-8901',
    customerAddress: '456 Oak Ave, Anytown, USA',
    bookingDate: new Date('2024-08-16'),
    bookingTime: '2:00 PM',
    status: 'confirmed',
  },
  {
    id: 'booking-3',
    serviceId: 'local-moving',
    customerName: 'Peter Jones',
    customerEmail: 'peter.jones@example.com',
    customerPhone: '(345) 678-9012',
    customerAddress: '789 Pine Ln, Anytown, USA',
    bookingDate: new Date('2024-08-18'),
    bookingTime: '9:00 AM',
    status: 'pending',
  },
];

export const timeSlots: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '01:00 PM', available: false },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '04:00 PM', available: true },
];

export const disabledDates: Date[] = [
    new Date(new Date().setDate(new Date().getDate() + 5)),
    new Date(new Date().setDate(new Date().getDate() + 10)),
];
