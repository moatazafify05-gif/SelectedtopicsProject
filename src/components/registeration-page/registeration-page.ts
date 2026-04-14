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





   ngOnInit(): void {
  const dbRef       = ref(this.db, 'board1/outputs/digital');
  const starttimeRef = ref(this.db, 'board1/outputs/digital/startdate');
  const endtimeRef   = ref(this.db, 'board1/outputs/digital/enddate');

  let currentName  = '';
  let currentStart = '';
  let currentEnd   = '';

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data?.name) currentName = data.name;
    this.tryAddReservation(currentName, currentStart, currentEnd);
    this.cdr.detectChanges();
  });

  onValue(starttimeRef, (snapshot) => {
    const data = snapshot.val();
    if (data?.startdate) currentStart = data.startdate;
    this.tryAddReservation(currentName, currentStart, currentEnd);
    this.cdr.detectChanges();
  });

  onValue(endtimeRef, (snapshot) => {
    const data = snapshot.val();
    if (data?.endtime) currentEnd = data.endtime;
    this.tryAddReservation(currentName, currentStart, currentEnd);
    this.cdr.detectChanges();
  });
}

private tryAddReservation(hallName: string, start: string, end: string): void {
  if (!hallName || !start || !end) return;

  this.buildings.forEach(building => {
    building.halls.forEach(hall => {
      if (hall.hallname === hallName) {
        if (!hall.bookedDates) hall.bookedDates = [] as any[];

        // متضيفش نفس الحجز أكتر من مرة
        const alreadyExists = hall.bookedDates.some(
          (r:any) => r.start === start && r.end === end
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

