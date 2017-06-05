import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SmlDataSource } from '../../sml/sml';
import { JsonEditorComponent, JsonEditorOptions } from 'ng2-jsoneditor';

@Component({
  selector: 'app-editor-smldatasource',
  template: `
    <div>
      <json-editor style="height: 100vh" [options]="editorOptions" [data]="data"></json-editor >
      <br />
      <button class="btn btn-success" (click)="saveCurrentItem()">Save</button>
      <button class="btn btn-danger">Cancel</button>
    </div>  `,
  styleUrls: ['./editor-smldatasource.component.css']
})
export class EditorSMLDatasourceComponent implements OnInit {
  @Input()
  dataSource: any;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  type: string;
  active: boolean;
  properties: any[];
  data: any;

  editorOptions = {
    theme: 'foundation6',
    search: false,
    modes: ['view', 'tree', 'text'],
  };

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.dataSource);
    this.data = this.dataSource;
    this.editor.set(this.data);
  }


  saveCurrentItem(){
    let a = this.editor.get();
    console.log(a);
  }


}
