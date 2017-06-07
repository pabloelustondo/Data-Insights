///<reference path="../../models/fakeData.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataSourceList } from './tmmModels';


import { CrudComponent } from './crud.component';
import { SmlDataService } from '../../../../sml/data.service';

@Component({
  selector: 'userinput' ,
  providers: [SmlDataService],
  template: `
    <h2 class="text-center"> Tenant Metadata </h2>
    <hr />
    <div class="container">
      <div class="row">
        <div class="col-lg-3">
          <h4>User: {{listItems[0].users.name}}</h4>
          <hr />
          <h5 *ngFor="let message of messages"> {{ message }}</h5>
        </div>
     <!--<crud [options]="DataSourceList"></crud>-->
          <div class="col-lg-3"> 
            <div class="list-group" *ngFor="let listItem of listItems">
                <a class="list-group-item" (click)=optionChanged($event) [id]="listItem.id">  {{ listItem.title }}</a>
            </div>
          </div>
          <div class="col-lg-6">
            <app-editor-smldatasource [dataSource] = "selectedOption" [(ngModel)]="currentItem"
                                      (optionUpdated)="optionUpdated($event)"></app-editor-smldatasource>
          </div>
        </div>
      </div>
 `
})

export class UserInput implements OnInit {
  selectedOption: any;
  currentItem: any;
  messages: string[] = [''];
  listItems: any = [
    {
      'id': '1',
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
        'name': 'Ray Gervais',
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
      'id': '2',
      'title': 'Data Source 2',
      'type': 'object',
      'properties': {
        'type': 'string',
        'active': 'boolean'
      }
  }];
  constructor() { }

  ngOnInit() { }


  optionChanged(items) {
    let index = 0;
    this.listItems.forEach(item => {
      if (item.id === items.toElement.id) {
        this.selectedOption = item;
        this.selectedOption['index'] = index;
      }
      index++;
    });

    if (!this.messages) {
      this.messages[0] = 'Selected ' + this.selectedOption.title + '!';
    } else {
      this.messages.push(String('Selected ' + this.selectedOption.title + '!'));
    }
  }

  optionUpdated(updatedItem) {
    this.listItems[updatedItem.index] = updatedItem;
    delete this.listItems[updatedItem.index].index;

    if (!this.messages) {
      this.messages[0] = 'Updated ' + updatedItem.title + '!';
    } else {
      this.messages.push(String('Updated ' + updatedItem.title + '!'));
    }
  }s
}
