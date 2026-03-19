import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {Header } from '../header/header';
import { Maintitle } from "../maintitle/maintitle";
import { RegisterationPage } from "../registeration-page/registeration-page";

@Component({
  selector: 'app-home-page',
  imports: [Header, RouterModule, Maintitle, RegisterationPage],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
