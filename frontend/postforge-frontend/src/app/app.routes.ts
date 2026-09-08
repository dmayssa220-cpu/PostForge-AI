import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { GenerationForm } from './features/generation/generation-form/generation-form';
import { GenerationHistory } from './features/generation/generation-history/generation-history';
import { authGuard } from './core/guards/auth.guard';
import { EditorialCalendar } from './features/calendar/editorial-calendar/editorial-calendar';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'generate', component: GenerationForm, canActivate: [authGuard] },
  { path: 'history', component: GenerationHistory, canActivate: [authGuard] },
  { path: 'calendar', component: EditorialCalendar, canActivate: [authGuard] },
];