
'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import {FQL, query} from '@firebase/data-connect';

export const getServices = FQL.createQuery(
  'getServices',
  query({
    services: async () => await db.select(Services),
  })
);


export const getBookings = FQL.createQuery(
  'getBookings',
  query({
    bookings: async () => await db.select(Bookings),
    users: async ({bookings}) =>
      await db
        .select(Users)
        .where(
          'userId',
          'in',
          bookings.map((b) => b.userId)
        ),
  })
);


export const getServiceById = FQL.createQuery(
    'getServiceById',
    async ({serviceId}: {serviceId: string}) =>
    await db.select(Services).where('serviceId', '=', serviceId).first()
);


export const getAvailability = FQL.createQuery(
  'getAvailability',
  query({
    timeSlots: async () => await db.select(TimeSlots).orderBy('time', 'asc'),
    disabledDates: async () => await db.select(DisabledDates),
  })
);
