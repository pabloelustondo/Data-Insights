import { NgModule }                     from '@angular/core';
import { BrowserModule }                from '@angular/platform-browser';
import { LocationStrategy,
         HashLocationStrategy }         from '@angular/common';

import { AppComponent }                 from './app.component';
import { Ng2BootstrapModule }           from 'ng2-bootstrap';
import { NAV_DROPDOWN_DIRECTIVES }      from './shared/nav-dropdown.directive';

import { ChartsModule }                 from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES }    from './shared/sidebar.directive';
import { AsideToggleDirective }         from './shared/aside.directive';
import { BreadcrumbsComponent }         from './shared/breadcrumb.component';
import { SmartResizeDirective }         from './shared/smart-resize.directive';

// Routing Module
import { AppRoutingModule }             from './app.routing';

//Layouts
import { FullLayoutComponent }          from './layouts/full-layout.component';
import { SimpleLayoutComponent }        from './layouts/simple-layout.component';

import { DropdownModule } from 'ng2-bootstrap/dropdown';


@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        Ng2BootstrapModule,
        ChartsModule,
        DropdownModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SimpleLayoutComponent,
        NAV_DROPDOWN_DIRECTIVES,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        SmartResizeDirective
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
