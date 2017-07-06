import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { smlTenantMetadataEditor } from './components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';
import { smlDataSourceEditor } from './smlDataSourceEditor/smlDataSourceEditor';
import { JsonEditorComponent } from 'ng2-jsoneditor';
import { TmmConfigService } from './components/layout/smlTenantMetadataEditor/tmmconfig.service';
import { RouterModule } from "@angular/router";
import { InvalidResourceComponent } from './components/invalid-resource/invalid-resource.component';
import { smlDataSourceOverview } from './components/smlDataSourceOverview/smlDataSourceOverview.component';
import { smlDataSourceCreator } from "./components/smlDataSourceCreator/smlDataSourceCreator.component";
import { AuthGuard } from './authguard.guard';

@NgModule({
  declarations: [
    AppComponent,
    smlTenantMetadataEditor,
    smlDataSourceEditor,
    JsonEditorComponent,
    InvalidResourceComponent,
    smlDataSourceOverview,
    smlDataSourceCreator
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot ([
      /*{
        path: ':tenantId', component: smlTenantMetadataEditor, canActivate:[AuthGuard]
      },*/ {
        path: 'dev/:tenantId', component: smlDataSourceCreator, canActivate:[AuthGuard]
      }, {
        path: 'editDataSource/:tenantId', component: smlDataSourceOverview, canActivate:[AuthGuard]
      },  {
        path: ':JWT/:tenantId', component: InvalidResourceComponent,
      }, {
        path: '**', component: InvalidResourceComponent,
      }])
  ],
  bootstrap: [AppComponent],
  providers: [TmmConfigService, AuthGuard]
})
export class AppModule { }
