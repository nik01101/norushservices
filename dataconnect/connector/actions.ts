
'use server';
import {
  db,
  Users,
  Bookings,
  Services,
  BookingStatus,
  DisabledDates,
  TimeSlots,
} from '../schema/schema';
import {batch, fn, FQL} from '@firebase/data-connect';

export const createBooking = FQL.define(
  async ({
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    serviceId,
    bookingDate,
    bookingTime,
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    serviceId: string;
    bookingDate: string;
    bookingTime: string;
  }) => {
    return await db.run(async (tx) => {
      let user = await tx.select(Users).where('email', '=', customerEmail).first();

      if (!user) {
        user = (
          await tx
            .insert(Users)
            .values({
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              address: customerAddress,
            })
            .returning()
        )[0];
      }

      const service = await tx
        .select(Services)
        .where('serviceId', '=', serviceId)
        .first();

      if (!service) {
        throw new Error('Service not found');
      }

      const newBooking = (
        await tx
          .insert(Bookings)
          .values({
            userId: user.userId,
            serviceId: service.id,
            bookingDate: new fn.Date(bookingDate),
            bookingTime: bookingTime,
            status: BookingStatus.PENDING,
          })
          .returning()
      )[0];

      return newBooking;
    });
  }
);


export const toggleTimeSlot = FQL.define(async ({time, available}: {time: string; available: boolean}) => {
  return await db
    .update(TimeSlots)
    .set({available})
    .where('time', '=', time)
    .run();
});


export const updateBookingStatus = FQL.define(async ({bookingId, status}: {bookingId: number; status: BookingStatus}) => {
  return await db
    .update(Bookings)
    .set({status})
    .where('bookingId', '=', bookingId)
    .run();
});


export const rescheduleBooking = FQL.define(
  async ({bookingId, bookingDate, bookingTime}: {bookingId: number, bookingDate: string, bookingTime: string}) => {
    return await db
      .update(Bookings)
      .set({
        bookingDate: new fn.Date(bookingDate),
        bookingTime: bookingTime,
        status: BookingStatus.CONFIRMED,
      })
      .where('bookingId', '=', bookingId)
      .run();
  }
);


export const toggleDisabledDate = FQL.define(async ({date}: {date: string}) => {
  return await db.run(async (tx) => {
    const existingDate = await tx
      .select(DisabledDates)
      .where('date', '=', new fn.Date(date))
      .first();
    if (existingDate) {
      await tx
        .delete(DisabledDates)
        .where('date', '=', new fn.Date(date))
        .run();
      return {action: 'enabled'};
    } else {
      await tx.insert(DisabledDates).values({date: new fn.Date(date)}).run();
      return {action: 'disabled'};
    }
  });
});
