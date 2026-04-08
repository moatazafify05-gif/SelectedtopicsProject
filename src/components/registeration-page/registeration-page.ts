import { Component, Input ,OnInit,ChangeDetectorRef} from '@angular/core';
import { HallCharacteristics } from '../../models/hall-characteristics';
import { Hall } from '../../models/hall';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Database,ref,set,onValue,get } from '@angular/fire/database';


@Component({
  selector: 'app-registeration-page',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './registeration-page.html',
  styleUrl: './registeration-page.css',
})
export class RegisterationPage {

  buildings: HallCharacteristics[];
  isReserved:boolean = false;
  sortedHalls: Hall[] = [];
  sortAsc = true;
constructor(private db: Database, private cdr: ChangeDetectorRef) {
this.buildings = [
  {name: 'Mechanics "17"', id: 1, imageUrl: '../../assets/mechanika-photo.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1 mec', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'available', capacity: 50,  id: 2},
    {name: 'Hall 3', status: 'available', capacity: 200, id: 3},
  ]

  }
  ,{name: 'Architecture "3"', id: 2, imageUrl: '../../assets/omarabuilding-photo.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1 arc', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'available', capacity: 50, id: 2},
    {name: 'Hall 3', status: 'available', capacity: 200, id: 3},
  ]

  },
  {name: 'Mechanics "18"', id: 3, imageUrl: '../../assets/mechanika2-photo.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'available', capacity: 50, id: 2},
    {name: 'Hall 3', status: 'available', capacity: 200, id: 3},
  ]

  },
  {name: 'Civil "12"', id: 4, imageUrl: '../../assets/civilBuilding.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1 cv', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'available', capacity: 50, id: 2},
    {name: 'Hall 3', status: 'available', capacity: 200, id: 3},
]
},
{name: 'Electrical "16"', id: 5, imageUrl: '../../assets/electricalBuilding.jpeg', globalDate: '2024-07-01',
    halls: [
  {name: 'Hall 1 el', status: 'available', capacity: 100, id: 1},
  {name: 'Hall 2', status: 'available', capacity: 50, id: 2},
  {name: 'Hall 3', status: 'available', capacity: 200, id: 3},
]
},
{name: 'credit "2"', id: 6, imageUrl: '../../assets/creditBuilding.jpeg', globalDate: '2024-07-01', halls: [
  {name: 'Hall 1 c', status: 'available', capacity: 100, id: 1},
  {name: 'Hall 2', status: 'available', capacity: 50, id: 2},
  {name: 'Hall 3', status: 'available', capacity: 200, id: 3},
]
}];

}
  get showDateCol(): boolean {
    return this.buildings.some(build => build.halls.some(h => h.status !== 'date'));
  }




    ngOnInit(): void {
  // تعريف القاعات المبدئية
  this.sortedHalls = [...this.buildings[0].halls];

  // تحديد مسار قاعدة البيانات
  const dbRef = ref(this.db, 'board1/outputs/digital');

  // مراقبة الداتا
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    // 1. نرجع كل القاعات لحالة 'available' كوضع افتراضي عشان لو لغيت الحجز
    this.buildings.forEach(building => {
      building.halls.forEach(hall => {
        hall.status = 'available';
      });
    });
   

      if(data!==null){
        this.isReserved = true;
      }

    // 2. لو في حجز موجود في الفايربيز، نغير حالة القاعة المطلوبة لـ 'reserved'
    if (data && data.reserved === true) {
      this.buildings.forEach(building => {
        building.halls.forEach(hall => {
          if (hall.name === data.name || hall.name === "Digital") {
            hall.status = 'reserved';
          }
        });
      });
    }

    // 3. السطر السحري اللي بيخلي الأنجولار يحدّث الشاشة فوراً بعد الريفرش!
    this.cdr.detectChanges();
  });
}




  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.sortedHalls = [...this.sortedHalls].sort((a, b) => {
      const order = ['available', 'date', 'booked'];
      const ai = order.indexOf(a.status);
      const bi = order.indexOf(b.status);
      return this.sortAsc ? ai - bi : bi - ai;
    });
  }






onReserve(hall: any, selectedTime: string) {

  if (!selectedTime) {
    alert('Please select a date and time first!');
    return;
  }

  const reservationDate = new Date(selectedTime);
  const hour = reservationDate.getHours();

  if (hour < 8 || hour >= 15) {
    alert('Booking is only available between 08:00 AM and 03:00 PM');
    return;
  }

  if (!hall.bookedDates) {
    hall.bookedDates = [];
  }

  const isOverlapping = hall.bookedDates.some((bookedTimeStr: string) => {
    const bookedTime = new Date(bookedTimeStr);
    const diffInMs = Math.abs(reservationDate.getTime() - bookedTime.getTime());
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours < 2;
  });

  if (isOverlapping) {
    alert('This slot is unavailable. Each reservation needs a 2-hour window.');
    return;
  }


  hall.bookedDates.push(selectedTime);


  const endTime = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const from = reservationDate.toLocaleTimeString('en-US', timeOptions);
  const to = endTime.toLocaleTimeString('en-US', timeOptions);


    const randomCode = Math.floor(1000 + Math.random() * 9000);


    const dbRef = ref(this.db, 'board1/outputs/digital');


    set(dbRef, {

      "reservation-code": randomCode,
      name: hall.name || "Hall Reservation",
    })
    .then(() => {


        alert(`Reserved successfully!\nFrom: ${from}\nTo: ${to} \nYour reservation code is: ${randomCode}  `);


      console.log('Reserved successfully! Reservation code:', randomCode);
    })
    .catch((error) => {
      alert('An error occurred while reserving. Please try again.');
      console.error('Error:', error);
    });
}
  onReserveAll(): void {
    alert(`Opening reservation form for ${this.buildings[0].name}`);
  }



}

function UrlCodec(arg0: string): string {
  throw new Error('Function not implemented.');
}

