
'use server';
import {db, Services, Bookings, TimeSlots, DisabledDates, Users} from '../schema/schema';
import { createQuery } from '@firebase/data-connect/server';

export const getServices = createQuery(
  'services',
  async () => {
    return {
      services: await db.select(Services),
    }
  }
);


export const getBookings = createQuery(
  'bookings',
  async () => {
    const bookings = await db.select(Bookings);
    const userIds = bookings.map((b) => b.userId);
    const users = userIds.length > 0 ? await db.select(Users).where('userId', 'in', userIds) : [];
    
    return { bookings, users };
  }
);


export const getServiceById = createQuery(
    'service',
    {
      params: {
        serviceId: 'string'
      }
    },
    async ({serviceId}) => {
      return {
        service: await db.select(Services).where('serviceId', '=', serviceId).first()
      }
    }
);


export const getAvailability = createQuery(
  'availability',
  async () => {
    return {
      timeSlots: await db.select(TimeSlots).orderBy('time', 'asc'),
      disabledDates: await db.select(DisabledDates),
    }
  }
);
