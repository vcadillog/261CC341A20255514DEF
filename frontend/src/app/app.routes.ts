import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { RegistrarPersona } from './components/registrar-persona/registrar-persona';
import { Facturas } from './components/facturacion/facturas';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'persona', component: RegistrarPersona, canActivate: [authGuard] },
  { path: 'facturas', component: Facturas, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
