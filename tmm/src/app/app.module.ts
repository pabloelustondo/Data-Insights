import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { smlTenantMetadataEditor } from './components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';
import { smlDataSourceEditor } from './smlDataSourceEditor/smlDataSourceEditor';
import { JsonEditorComponent } from 'ng2-jsoneditor';
import {TmmConfigService} from './components/layout/smlTenantMetadataEditor/tmmconfig.service';
import { RouterModule } from "@angular/router";
import { InvalidResourceComponent } from './components/invalid-resource/invalid-resource.component';

@NgModule({
  declarations: [
    AppComponent,
    smlTenantMetadataEditor,
    smlDataSourceEditor,
    JsonEditorComponent,
    InvalidResourceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot ([{
      path: ':tenantId', component: smlTenantMetadataEditor
    }, {
      path: '**', component: InvalidResourceComponent
    }])
  ],
  bootstrap: [AppComponent],
  providers: [TmmConfigService]
})
export class AppModule { }
