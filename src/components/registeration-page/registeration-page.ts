import { Component, Input ,OnInit,ChangeDetectorRef} from '@angular/core';
import { HallCharacteristics } from '../../models/hall-characteristics';
import { Hall } from '../../models/hall';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Database,ref,set,onValue,get } from '@angular/fire/database';
import Swal from 'sweetalert2';
import { RegisterationService } from '../../services/registeration-service';
import { TimeRegistrationComponent } from '../time-registeration/time-registeration';
import { RouterLink } from "@angular/router";

interface Reservation {
  startTime: string;
  endTime: string;

}
@Component({
  selector: 'app-registeration-page',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registeration-page.html',
  styleUrl: './registeration-page.css',
})
export class RegisterationPage {

  buildings: HallCharacteristics[];
  isReserved:boolean = false;
  sortedHalls: Hall[] = [];
  sortAsc = true;
  reserveDate:Reservation[] = [];
constructor(private db: Database, private cdr: ChangeDetectorRef, private registerationService: RegisterationService) {
this.buildings = this.registerationService.buildings;

}
  get showDateCol(): boolean {
    return this.buildings.some(build => build.halls.some(h => h.status !== 'date'));
  }




    ngOnInit(): void {
  // تعريف القاعات المبدئية


  // تحديد مسار قاعدة البيانات
  const dbRef = ref(this.db, 'board1/outputs/digital');
  const halltime=ref(this.db, 'board1/outputs/digital/date');

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
          if (hall.hallname === data.name || hall.hallname === "Digital") {
            hall.status = 'reserved';
          }
        });
      });
    }
    onValue(halltime, (snapshot) => {
      const timeData = snapshot.val();
      this.buildings.forEach(building => {
    building.halls.forEach(hall => {
      // ✅ إضافة شرط للتأكد من أننا نضع المواعيد في القاعة الصحيحة فقط
      if (hall.hallname === data.name) {
        hall.reservedDates = timeData || [];}});
      });
    });

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







  onReserveAll(): void {
    alert(`Opening reservation form for ${this.buildings[0].name}`);
  }
  setValue(hall: Hall): void {
    this.registerationService.currentbuildingName = hall.hallname;
    this.registerationService.currentHall = hall;
  }


}

function UrlCodec(arg0: string): string {
  throw new Error('Function not implemented.');
}

