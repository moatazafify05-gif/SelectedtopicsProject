export interface Hall {
  name: string;
  status: 'available' | 'date' | 'booked';
  capacity: number;
  date?: string; // Only for 'date' status
  id: number;
}
