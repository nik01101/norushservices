'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import { createQuery } from '@firebase/data-connect/server';
import { and, eq, gte, lte } from 'drizzle-orm';

export const getServices = createQuery(
    'services',
    async () => {
        const services = await db.select().from(Services);
        return { services };
    }
);

export const getServiceById = createQuery(
    'service',
    async (serviceId: string) => {
        const [service] = await db.select().from(Services).where(eq(Services.serviceId, serviceId));
        return { service };
    }
);

export const getAvailability = createQuery(
    'availability',
    async () => {
        const timeSlots = await db.select().from(TimeSlots);
        const disabledDates = await db.select().from(DisabledDates);
        return { timeSlots, disabledDates };
    }
)

export const getBookings = createQuery(
    'bookings',
    async () => {
        const bookings = await db.select({
            bookingId: Bookings.bookingId,
            userId: Bookings.userId,
            serviceId: Bookings.serviceId,
            bookingDate: Bookings.bookingDate,
            bookingTime: Bookings.bookingTime,
            status: Bookings.status,
            createdAt: Bookings.createdAt,
            customerName: Users.name,
            customerEmail: Users.email,
            customerPhone: Users.phone,
            serviceName: Services.name
        })
        .from(Bookings)
        .leftJoin(Users, eq(Bookings.userId, Users.userId))
        .left-join(Services, eq(Bookings.serviceId, Services.serviceId));

        return { bookings };
    }
)
