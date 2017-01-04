import { NgModule }                 from '@angular/core';
import { Routes,
         RouterModule }             from '@angular/router';

//Layouts
import { FullLayoutComponent }      from './layouts/full-layout.component';
import { SimpleLayoutComponent }    from './layouts/simple-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: FullLayoutComponent,
        data: {
            title: 'Home'
        },
        children: [
            {
                path: 'dad',
                loadChildren: 'app/dad/dad.module#DadModule'
            },
            {
                path: 'dashboard',
                loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'components',
                loadChildren: 'app/components/components.module#ComponentsModule'
            },
            {
                path: 'icons',
                loadChildren: 'app/icons/icons.module#IconsModule'
            },
            {
                path: 'forms',
                loadChildren: 'app/forms/forms.module#FormsModule'
            },
            {
                path: 'plugins',
                loadChildren: 'app/plugins/plugins.module#PluginsModule'
            },
            {
                path: 'widgets',
                loadChildren: 'app/widgets/widgets.module#WidgetsModule'
            },
            {
                path: 'charts',
                loadChildren: 'app/chartjs/chartjs.module#ChartJSModule'
            },
            {
                path: 'uikits',
                loadChildren: 'app/uikits/uikits.module#UIKitsModule'
            }
        ]
    },
    {
        path: 'pages',
        component: SimpleLayoutComponent,
        data: {
            title: 'Pages'
        },
        children: [
            {
                path: '',
                loadChildren: 'app/pages/pages.module#PagesModule',
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
