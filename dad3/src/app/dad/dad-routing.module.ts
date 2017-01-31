import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { DadComponent }   from './dashboard.component';
import { DadConfigComponent }   from './configuration.component';
import { DadLoginComponent }   from './login.component';
import { DadTableComponent }   from './table.component';
import { AuthGuard } from './common/auth.guard';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Battery Stats'
        },
        children: [
            {
                path: '',
                component: DadComponent,
                canActivate: [AuthGuard],
                data: {
                title: ''
                }
            },
            {
                path: 'conf',
                component: DadConfigComponent,
                canActivate: [AuthGuard],
                data: {
                    title: 'Configuration'
                }
            },
            {
                path: 'login',
                component: DadLoginComponent,
                data: {
                    title: 'Configuration'
                }
            },
            {
                path: 'table/:count/:id',
                component: DadTableComponent,
                canActivate: [AuthGuard],
                data: {
                    title: 'List of devices'
                }
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DadRoutingModule {}
