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

  listItems: any = [{
      "id": 1,
      "title": "Data Source",
      "type": "object",
      "properties": {
        "type": "string",
        "active": "boolean"
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
