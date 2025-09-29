
'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import {FQL, query} from '@firebase/data-connect';

const getServicesQuery = FQL.define(
  query({
    services: async () => await db.select(Services),
  })
);
export const getServices = FQL.createQuery(getServicesQuery);


const getBookingsQuery = FQL.define(
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

export const getBookings = FQL.createQuery(getBookingsQuery);

const getServiceByIdQuery = FQL.define(
  async ({serviceId}: {serviceId: string}) =>
    await db.select(Services).where('serviceId', '=', serviceId).first()
);
export const getServiceById = FQL.createQuery(getServiceByIdQuery);

const getAvailabilityQuery = FQL.define(
  query({
    timeSlots: async () => await db.select(TimeSlots).orderBy('time', 'asc'),
    disabledDates: async () => await db.select(DisabledDates),
  })
);
export const getAvailability = FQL.createQuery(getAvailabilityQuery);
