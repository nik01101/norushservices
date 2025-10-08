
'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import { createMutation } from '@firebase/data-connect/server';
import { and, eq, gte, lte, inArray } from 'drizzle-orm';

export const createBooking = createMutation(
    'createBooking',
    async (
        {serviceId, bookingDate, bookingTime, name, email, phone, address}:
        {serviceId: string, bookingDate: string, bookingTime: string, name: string, email: string, phone: string, address: string}
    ) => {
        const [user] = await db.insert(Users).values({
            name,
            email,
            phone,
            address,
            createdAt: new Date().toISOString()
        }).returning();

        const [booking] = await db.insert(Bookings).values({
            userId: user.userId,
            serviceId,
            bookingDate,
            bookingTime,
            status: 'pending',
            createdAt: new Date().toISOString()
        }).returning();
        
        return { bookingId: booking.bookingId };
    }
);

export const updateBookingStatus = createMutation(
    'updateBookingStatus',
    async ({bookingId, status, bookingDate, bookingTime}: {bookingId: number, status?: 'confirmed' | 'cancelled', bookingDate?: string, bookingTime?: string}) => {
        
        const valuesToUpdate: { status?: 'confirmed' | 'cancelled', bookingDate?: string, bookingTime?: string } = {};
        if (status) valuesToUpdate.status = status;
        if (bookingDate) valuesToUpdate.bookingDate = bookingDate;
        if (bookingTime) valuesToUpdate.bookingTime = bookingTime;

        const [booking] = await db.update(Bookings)
            .set(valuesToUpdate)
            .where(eq(Bookings.bookingId, bookingId))
            .returning();
        
        return { bookingId: booking.bookingId };
    }
);

export const updateAvailability = createMutation(
    'updateAvailability',
    async ({dates, timeSlots}: {dates?: string[], timeSlots?: {time: string, available: boolean}[]}) => {
        if (dates) {
            await db.delete(DisabledDates);
            if (dates.length > 0) {
                await db.insert(DisabledDates).values(dates.map(date => ({date})));
            }
        }

        if (timeSlots) {
            for (const slot of timeSlots) {
                await db.update(TimeSlots)
                    .set({ available: slot.available })
                    .where(eq(TimeSlots.time, slot.time));
            }
        }
        
        return { success: true };
    }
);

