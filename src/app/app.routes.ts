import { Routes } from '@angular/router';
import { Tablero } from './tablero/tablero';
import { Acerca } from './acerca/acerca';
import { S03 } from './s03/s03';
import { Taller02 } from './s03/taller02';

export const routes: Routes = [
  { path: '', redirectTo: 'tablero', pathMatch: 'full' },
  { path: 'tablero', component: Tablero },
  { path: 's03', component: S03 },
  { path: 'acerca', component: Acerca },
  { path: 'taller02', component: Taller02 }, // <--- Debe ir ANTES del comodín **
  { path: '**', redirectTo: 'tablero' }
];