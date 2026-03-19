import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterationPage } from "../components/registeration-page/registeration-page";
import { Header } from "../components/header/header";
import { Maintitle } from "../components/maintitle/maintitle";
import { SignInComponent } from '../components/sign-in-page/sign-in-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RegisterationPage, Header, Maintitle, SignInComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hallRegisteration');
}
