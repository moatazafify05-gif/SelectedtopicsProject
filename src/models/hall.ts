import { Reservation } from "./reservation";

export interface Hall {
  hallname: string;
  status: 'available' | 'date' | 'reserved';
  capacity: number;
  date?: string; // Only for 'date' status
  id: number;
bookedDates?: Reservation[] ;
reservations?: Reservation[];

}
