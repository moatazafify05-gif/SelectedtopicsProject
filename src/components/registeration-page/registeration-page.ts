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
import { Reservation } from '../../models/reservation';


@Component({
  selector: 'app-registeration-page',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registeration-page.html',
  styleUrl: './registeration-page.css',
})
export class RegisterationPage  {

  buildings: HallCharacteristics[];
  isReserved:boolean = true;
  sortedHalls: Hall[] = [];
  sortAsc = true;
  reserveDate:Reservation[] = [];

constructor(private db: Database, private cdr: ChangeDetectorRef, private registerationService: RegisterationService) {
this.buildings = this.registerationService.buildings;

}
  get showDateCol(): boolean {
    return this.buildings.some(build => build.halls.some(h => h.status !== 'date'));
  }





   private addedKeys = new Set<string>(); // ✅ عشان نمنع التكرار

ngOnInit(): void {
  this.buildings.forEach(building => {
    building.halls.forEach(hall => {
      const hallKey = hall.hallname.replace(/\s+/g, '_');
      const hallRef = ref(this.db, `board1/halls/${hallKey}`);

      onValue(hallRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Firebase data for', hall.hallname, data); // ✅ شوف الداتا جاية ازاي

        if (!data) {
          hall.reservations = [];
        } else if (Array.isArray(data)) {
          hall.reservations = data;
        } else {
          // ✅ Firebase بيرجع object مش array فنحوله
          hall.reservations = Object.values(data);
        }

        this.cdr.detectChanges();
      });
    });
  });
}

private tryAddReservation(hallName: string, start: string, end: string): void {
  if (!hallName || !start || !end) return;

  this.buildings.forEach(building => {
    building.halls.forEach(hall => {
      if (hall.hallname === hallName) {
        if (!hall.bookedDates) hall.bookedDates = [] as Reservation[];

        // متضيفش نفس الحجز أكتر من مرة
        const alreadyExists = hall.bookedDates.some(
          (r:Reservation) => r.start === start && r.end === end
        );

        if (!alreadyExists) {
          hall.bookedDates.push({ start, end } as Reservation);
        }
      }
    });
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

