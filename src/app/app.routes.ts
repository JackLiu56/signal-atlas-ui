import { Routes } from '@angular/router';
import { RadioCatalog } from './pages/radio-catalog/radio-catalog';
import { RadioDetail } from './pages/radio-detail/radio-detail';
import { RadioCreate } from './pages/radio-create/radio-create';
import { RadioEdit } from './pages/radio-edit/radio-edit';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'radios',
    component: RadioCatalog
  },
  {
    path: 'radios/new',
    component: RadioCreate
  },
  {
    path: 'radios/:id/edit',
    component: RadioEdit
  },
  {
    path: 'radios/:id',
    component: RadioDetail
  }
];
