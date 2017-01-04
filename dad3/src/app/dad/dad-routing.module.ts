import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { DadComponent }   from './dashboard.component';
import { DadConfigComponent }   from './configuration.component';
import { DadTableComponent }   from './table.component';

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
            },
            {
                path: 'table/:id',
                component: DadTableComponent,
                data: {
                    title: 'TableView'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DadRoutingModule {}
