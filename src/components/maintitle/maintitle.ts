import { Component } from '@angular/core';
import { HallCharacteristics } from '../../models/hall-characteristics';
import * as AOS from 'aos';

@Component({
  selector: 'app-maintitle',
  imports: [],
  templateUrl: './maintitle.html',
  styleUrl: './maintitle.css',
})
export class Maintitle {
ngOnInit() {
  AOS.init();
}

}
