
'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import { createQuery } from '@firebase/data-connect';

export const getServices = createQuery(
  'getServices',
  async () => ({
    services: await db.select(Services),
  })
);


export const getBookings = createQuery(
  'getBookings',
  async () => {
    const bookings = await db.select(Bookings);
    const userIds = bookings.map((b) => b.userId);
    const users = userIds.length > 0 ? await db.select(Users).where('userId', 'in', userIds) : [];
    
    return { bookings, users };
  }
);


export const getServiceById = createQuery(
    'getServiceById',
    {
      params: {
        serviceId: 'string'
      }
    },
    async ({serviceId}) => ({
        service: await db.select(Services).where('serviceId', '=', serviceId).first()
    })
);


export const getAvailability = createQuery(
  'getAvailability',
  async () => ({
    timeSlots: await db.select(TimeSlots).orderBy('time', 'asc'),
    disabledDates: await db.select(DisabledDates),
  })
);
