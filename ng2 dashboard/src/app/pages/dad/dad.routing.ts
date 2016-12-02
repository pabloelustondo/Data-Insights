import { Routes, RouterModule }  from '@angular/router';
import { DadComponent } from './dad.component';

const routes: Routes = [
  {
    path: '',
    component: DadComponent
  }
];

export const routing = RouterModule.forChild(routes);
