export interface Hall {
  name: string;
  status: 'available' | 'date' | 'reserved';
  capacity: number;
  date?: string; // Only for 'date' status
  id: number;
bookedDates?: string[] ;

}
