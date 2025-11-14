import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {Login} from './pages/auth/login/login';
import {Signup} from './pages/auth/signup/signup';
import {ForgotPassword} from './pages/auth/forgot-password/forgot-password';
import {AuthCallback} from './core/callbacks/auth-callback/auth-callback';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home},
  { path: 'auth/login', component: Login},
  { path: 'auth/signup', component: Signup},
  { path: 'auth/forgot-password', component: ForgotPassword},
  { path: 'auth/callback/:provider', component: AuthCallback}
];
