import { Routes } from '@angular/router';
import { Eleccion } from './components/eleccion/eleccion';

export const routes: Routes = [
  { path: '', redirectTo: 'eleccion', pathMatch: 'full' },
  { path: 'eleccion', component: Eleccion},
  { path: '**', redirectTo: 'eleccion' },
];
