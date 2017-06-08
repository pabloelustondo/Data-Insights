import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { UserInput } from './components/layout/UserInput/UserInput.component';
import { CrudComponent } from './components/layout/UserInput/crud.component';
import { EditorSMLDatasourceComponent } from './editor-smldatasource/editor-smldatasource.component';
import { JsonEditorComponent } from 'ng2-jsoneditor';

@NgModule({
  declarations: [
    AppComponent,
    UserInput,
    CrudComponent,
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
