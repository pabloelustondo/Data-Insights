import { Routes } from '@angular/router';
import { UserInput } from './components/layout/UserInput/UserInput.component';

export const AppRoutes: Routes = [
  { path: '**', component: UserInput },
];
