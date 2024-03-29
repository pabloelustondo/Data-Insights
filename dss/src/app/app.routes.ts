import { Routes } from '@angular/router';
import { Home } from './home';
import { Login } from './login';
import { Signup } from './signup';
import { AuthGuard } from './common/auth.guard';
import { SourceForms } from './home/sourceForm';

export const routes: Routes = [
  { path: '',       component: Login },
  { path: 'login',  component: Login },
  { path: 'signup', component: Signup },
  { path: 'sf', component: SourceForms},
  { path: 'home',   component: Home, canActivate: [AuthGuard] },
  { path: '**',     component: Login },
];
