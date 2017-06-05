///<reference path="../../models/fakeData.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataSourceList } from './tmmModels';


import { CrudComponent } from './crud.component';
import { SmlDataService } from '../../../../sml/data.service';

@Component({
  selector: 'userinput' ,
  providers: [SmlDataService],
  template: `
  <div>
   <!--<crud [options]="DataSourceList"></crud>-->
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="list-group" *ngFor="let listItem of listItems">
              <a class="list-group-item" (click)=optionChanged($event) [id]="listItem.id">  {{ listItem.title }}</a>
          </div>
        </div>
        <div class="col">
          <app-editor-smldatasource [dataSource] = "selectedOption" [(ngModel)]="currentItem" (ngModelChange)="onChangeUpdate($event)"></app-editor-smldatasource>
        </div>
      </div>
    </div>
  </div>
 `
})


export class UserInput implements OnInit {
  selectedOption: any;
  currentItem: any;

  listItems: any = [
    {
      'id': 1,
      'title': 'Data Source',
      'tennantID': '0121',
      'dataSets': {
        'id': '10-22-1',
        'name': 'Test Data Set 01',
        'from': 'Doga Ister',
        'persist': true,
        'filter': '/&AS/',
        'merge': '09-21-31$F',
        'projections': '',
        'metadata': ''
      },
      'dataSource': {
        'id': '10-23-1',
        'name': 'Test Data Set 01',
        'type': 'TestMockData',
        'active': true,
        'properties': ['Test', 'Ray', 'Is', 'Bae']
      },
      'users': {
        'id': '10-24-1',
        'name': 'Test Data Set 01',
        'permissions': 'All',
        'status': 'Admin'
      },
      'idapInformation': {
        'id': '10-25-02',
        'name': 'idap Main Config',
        'endpoint': 'localhost:1023/endPointFTW',
        'configurations': {
          'method': 'GET',
          'secure': 'x-access'
        }
      }
  },
  {
      "id": 2,
      "title": "Data Source 2",
      "type": "object",
      "properties": {
        "type": "string",
        "active": "boolean"
      }
  }];
  constructor() { }

  ngOnInit() { }


  optionChanged(items){
    this.listItems.forEach(item => {
      if(item.id == parseInt(items.toElement.id)) {
        this.selectedOption = item;
      }
    });

    console.log(this.selectedOption);
  }

  isEmpty(item) {
    return (item == null);
  }

  onChangeUpdate(item){
    console.log(item);
  }
}
