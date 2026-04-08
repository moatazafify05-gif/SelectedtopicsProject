import { Routes } from '@angular/router';
import { SignInComponent } from '../components/sign-in-page/sign-in-page';
import { RegisterationPage } from '../components/registeration-page/registeration-page';
import { HomePage } from '../components/home-page/home-page';
import { SignUp } from '../components/sign-up/sign-up';
import { TimeRegistrationComponent } from '../components/time-registeration/time-registeration';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'home',
    component: HomePage,
    children: [{ path: 'registeration-page', component: RegisterationPage },
      {path: 'time-registration', component: TimeRegistrationComponent}
    ],
  },
  { path: 'sign-up', component: SignUp },
  { path: '**', redirectTo: '/sign-in' },
];
