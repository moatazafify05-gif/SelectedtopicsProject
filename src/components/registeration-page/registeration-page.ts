import { Component, Input } from '@angular/core';
import { HallCharacteristics } from '../../models/hall-characteristics';
import { Hall } from '../../models/hall';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-registeration-page',
  imports: [FormsModule,CommonModule],
  templateUrl: './registeration-page.html',
  styleUrl: './registeration-page.css',
})
export class RegisterationPage {

  buildings: HallCharacteristics[];


  sortedHalls: Hall[] = [];
  sortAsc = true;
constructor() {
this.buildings = [
  {name: 'Mechanics "17"', id: 1, imageUrl: '../../assets/mechanika-photo.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'date', capacity: 50, date: '2024-07-01', id: 2},
    {name: 'Hall 3', status: 'booked', capacity: 200, id: 3},
  ]

  }
  ,{name: 'Architecture "3"', id: 2, imageUrl: '../../assets/omarabuilding-photo.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'date', capacity: 50, date: '2024-07-01', id: 2},
    {name: 'Hall 3', status: 'booked', capacity: 200, id: 3},
  ]

  },
  {name: 'Mechanics "18"', id: 3, imageUrl: '../../assets/mechanika2-photo.jpeg', globalDate: '2024-07-01', halls: [
    {name: 'Hall 1', status: 'available', capacity: 100, id: 1},
    {name: 'Hall 2', status: 'date', capacity: 50, date: '2024-07-01', id: 2},
    {name: 'Hall 3', status: 'booked', capacity: 200, id: 3},
  ]

  }
]
}
  /** Show the Date column if ANY hall has a date-picker status */
  get showDateCol(): boolean {
    return this.buildings.some(build => build.halls.some(h => h.status !== 'date'));
  }

  ngOnInit(): void {
    this.sortedHalls = [...this.buildings[0].halls];
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

  onReserve(hall: Hall): void {
    alert(`Reserved: ${hall.name} in ${this.buildings[0].name}`);
  }

  onReserveAll(): void {
    alert(`Opening reservation form for ${this.buildings[0].name}`);
  }



}

function UrlCodec(arg0: string): string {
  throw new Error('Function not implemented.');
}

