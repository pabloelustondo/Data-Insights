import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { DadComponent }   from './dashboard.component';
import { DadConfigComponent }   from './configuration.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Dashboard'
        },
        children: [
            {
                path: '',
                component: DadComponent,
                data: {
                title: 'Dashboard'
                }
            },
            {
                path: 'conf',
                component: DadConfigComponent,
                data: {
                    title: 'Configuration'
                }
            }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DadRoutingModule {}
