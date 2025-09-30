
'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import {FQL} from '@firebase/data-connect';

export const getServices = FQL.createQuery(
  'getServices',
  async () => ({
    services: await db.select(Services),
  })
);


export const getBookings = FQL.createQuery(
  'getBookings',
  async () => FQL.query({
    bookings: await db.select(Bookings),
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
    async ({serviceId}: {serviceId: string}) => ({
        service: await db.select(Services).where('serviceId', '=', serviceId).first()
    })
);


export const getAvailability = FQL.createQuery(
  'getAvailability',
  async () => ({
    timeSlots: await db.select(TimeSlots).orderBy('time', 'asc'),
    disabledDates: await db.select(DisabledDates),
  })
);
