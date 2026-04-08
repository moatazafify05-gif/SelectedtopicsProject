import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Header } from '../header/header';
import { Maintitle } from "../maintitle/maintitle";
import { RegisterationPage } from "../registeration-page/registeration-page";
import { Footer } from "../footer/footer";
import { TimeRegistrationComponent } from '../time-registeration/time-registeration';
@Component({
  selector: 'app-home-page',
  imports: [Header, RouterModule, Maintitle, RegisterationPage, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
