import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { smlTenantMetadataEditor } from './components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';
import { smlDataSourceEditor } from './smlDataSourceEditor/smlDataSourceEditor';
import { JsonEditorComponent } from 'ng2-jsoneditor';
import {TmmConfigService} from './components/layout/smlTenantMetadataEditor/tmmconfig.service';

@NgModule({
  declarations: [
    AppComponent,
    smlTenantMetadataEditor,
    smlDataSourceEditor,
    JsonEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  bootstrap: [AppComponent],
  providers: [TmmConfigService]
})
export class AppModule { }
