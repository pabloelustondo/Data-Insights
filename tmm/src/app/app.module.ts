import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { smlTenantMetadataEditor } from './components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';
import { EditorSMLDatasourceComponent } from './editor-smldatasource/editor-smldatasource.component';
import { JsonEditorComponent } from 'ng2-jsoneditor';

@NgModule({
  declarations: [
    AppComponent,
    smlTenantMetadataEditor,
    EditorSMLDatasourceComponent,
    JsonEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
