import { Routes } from '@angular/router';
import { RadioCatalog } from './pages/radio-catalog/radio-catalog';
import { RadioDetail } from './pages/radio-detail/radio-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'radios',
    pathMatch: 'full',
  },
  {
    path: 'radios',
    component: RadioCatalog
  },
  {
    path: 'radios/:id',
    component: RadioDetail
  }
];
