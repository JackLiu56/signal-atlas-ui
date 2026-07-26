import { Routes } from '@angular/router';
import { RadioCatalog } from './pages/radio-catalog/radio-catalog';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'radios',
    pathMatch: 'full',
  },
  {
    path: 'radios',
    component: RadioCatalog
  }
];
