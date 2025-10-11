// The 'export' keyword is essential!
export interface Service {
  id: string; 
  serviceId: string;
  name: string;
  description: string;
  price: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilitySettings {
  timeSlots: TimeSlot[];
  disabledDates: string[];
}