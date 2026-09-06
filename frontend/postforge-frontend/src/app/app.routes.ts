import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { GenerationForm } from './features/generation/generation-form/generation-form';
import { GenerationHistory } from './features/generation/generation-history/generation-history';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'generate', component: GenerationForm },
  { path: 'history', component: GenerationHistory },
];
