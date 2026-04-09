import { Injectable } from '@angular/core';
import { HallCharacteristics } from '../models/hall-characteristics';
import { Hall } from '../models/hall';
import { Database, ref, set, onValue } from '@angular/fire/database'; // Update the path to your Database service

@Injectable({
  providedIn: 'root',
})

export class RegisterationService {
  buildings:HallCharacteristics[];
  currentbuildingName:string = '';
  currentHall:Hall= {hallname: '', status: 'available', capacity: 0, id: 0};
  globalReservedDates: string[] = [];

  constructor(
    private db: Database,

  ) {
    this.buildings = [
  {name: 'Mechanics "17"', id: 1, imageUrl: '../../assets/mechanika-photo.jpeg', globalDate: '2024-07-01', halls: [
    {hallname: 'Hall17101', status: 'available', capacity: 100, id: 1},
    {hallname: 'Hall17102', status: 'available', capacity: 50,  id: 2},
    {hallname: 'Hall17103', status: 'available', capacity: 200, id: 3},
  ]

  }
  ,{name: 'Architecture "3"', id: 2, imageUrl: '../../assets/omarabuilding-photo.jpeg', globalDate: '2024-07-01', halls: [
    {hallname: 'Hall 3001', status: 'available', capacity: 100, id: 1},
    {hallname: 'Hall 3002', status: 'available', capacity: 50, id: 2},
    {hallname: 'Hall 3003', status: 'available', capacity: 200, id: 3},
  ]

  },
  {name: 'Mechanics "18"', id: 3, imageUrl: '../../assets/mechanika2-photo.jpeg', globalDate: '2024-07-01', halls: [
    {hallname: 'Hall18101', status: 'available', capacity: 100, id: 1},
    {hallname: 'Hall18102', status: 'available', capacity: 50, id: 2},
    {hallname: 'Hall18103', status: 'available', capacity: 200, id: 3},
  ]

  },
  {name: 'Civil "12"', id: 4, imageUrl: '../../assets/civilBuilding.jpeg', globalDate: '2024-07-01', halls: [
    {hallname: 'Hall 12001', status: 'available', capacity: 100, id: 1},
    {hallname: 'Hall 12002', status: 'available', capacity: 50, id: 2},
    {hallname: 'Hall 12003', status: 'available', capacity: 200, id: 3},
]
},
{name: 'Electrical "16"', id: 5, imageUrl: '../../assets/electricalBuilding.jpeg', globalDate: '2024-07-01',
    halls: [
  {hallname: 'Hall 16101', status: 'available', capacity: 100, id: 1},
  {hallname: 'Hall 16102', status: 'available', capacity: 50, id: 2},
  {hallname: 'Hall 16103', status: 'available', capacity: 200, id: 3},
]
},
{name: 'credit "2"', id: 6, imageUrl: '../../assets/creditBuilding.jpeg', globalDate: '2024-07-01', halls: [
  {hallname: 'Hall 20101', status: 'available', capacity: 100, id: 1},
  {hallname: 'Hall 20102', status: 'available', capacity: 50, id: 2},
  {hallname: 'Hall 20103', status: 'available', capacity: 200, id: 3},
]
}];
onValue(ref(this.db, 'board1/outputs/digital/date'), (snapshot) => {
  const data = snapshot.val();
  this.globalReservedDates=data || [];

});
}
}
