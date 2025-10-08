
import {pgTable, varchar, serial, text, integer, real, timestamp, boolean, date} from 'drizzle-orm/pg-core';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool);

export const Services = pgTable('services', {
    serviceId: varchar('service_id', {length: 50}).primaryKey(),
    name: varchar('name', {length: 100}).notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    imageUrl: varchar('image_url', {length: 255}),
    imageHint: varchar('image_hint', {length: 255}),
    extraFee: varchar('extra_fee', {length: 255}),
});

export const Users = pgTable('users', {
    userId: serial('user_id').primaryKey(),
    name: varchar('name', {length: 100}).notNull(),
    email: varchar('email', {length: 100}).notNull().unique(),
    phone: varchar('phone', {length: 20}),
    address: text('address'),
    createdAt: varchar("created_at").notNull(),
});

export const Bookings = pgTable('bookings', {
    bookingId: serial('booking_id').primaryKey(),
    userId: integer('user_id').references(() => Users.userId).notNull(),
    serviceId: varchar('service_id', {length: 50}).references(() => Services.serviceId).notNull(),
    bookingDate: varchar('booking_date').notNull(),
    bookingTime: varchar('booking_time').notNull(),
    status: varchar('status', {length: 20}).default('pending').notNull(),
    createdAt: varchar("created_at").notNull(),
});

export const TimeSlots = pgTable('time_slots', {
    time: varchar('time', {length: 20}).primaryKey(),
    available: boolean('available').default(true).notNull(),
});

export const DisabledDates = pgTable('disabled_dates', {
    date: varchar('date').primaryKey(),
});

