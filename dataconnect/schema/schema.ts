
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  boolean,
  date,
} from 'drizzle-orm/pg-core';
import {createConnector, pgDB} from '@firebase/data-connect/connector';

export const db = pgDB();

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
]);

export const Services = pgTable('services', {
  id: serial('id').primaryKey(),
  serviceId: text('service_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  imageUrl: text('image_url').notNull(),
  imageHint: text('image_hint').notNull(),
  extraFee: text('extra_fee'),
});

export const Users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
});

export const Bookings = pgTable('bookings', {
  bookingId: serial('booking_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.userId),
  serviceId: integer('service_id')
    .notNull()
    .references(() => Services.id),
  bookingDate: date('booking_date').notNull(),
  bookingTime: text('booking_time').notNull(),
  status: bookingStatusEnum('status').notNull().default(BookingStatus.PENDING),
  createdAt: timestamp('created_at').defaultNow(),
});

export const TimeSlots = pgTable('time_slots', {
  id: serial('id').primaryKey(),
  time: text('time').notNull().unique(),
  available: boolean('available').notNull().default(true),
});

export const DisabledDates = pgTable('disabled_dates', {
  id: serial('id').primaryKey(),
  date: date('date').notNull().unique(),
});

export default createConnector({
  database: db,
  models: {
    Services,
    Users,
    Bookings,
    TimeSlots,
    DisabledDates,
  },
});
