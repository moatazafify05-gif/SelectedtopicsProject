import { Routes } from '@angular/router';
import { SignInComponent } from '../components/sign-in-page/sign-in-page';
import { RegisterationPage } from '../components/registeration-page/registeration-page';
import { HomePage } from '../components/home-page/home-page';
import { SignUp } from '../components/sign-up/sign-up';


export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'home', component: HomePage },
  {path: 'sign-up', component: SignUp},
  { path: '**', redirectTo: '/sign-in' }
];
