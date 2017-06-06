///<reference path="../../models/fakeData.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataSourceList } from './tmmModels';
import { SmlTenantMetadata } from '../../../../sml/sml';

import { CrudComponent } from './crud.component';
import { SmlDataService } from '../../../../sml/data.service';
import {smlTenantMetadataSample} from "./jsonEditorSchema.configuration";


@Component({
  selector: 'userinput' ,
  providers: [SmlDataService],
  template: `
  <div>
   <!--<crud [options]="DataSourceList"></crud>-->
     
    <div class="container">
      <br/>
      <div>
          <crud [options]='DataSourceList' (optionChanged)='optionChanged($event.target.value)'></crud> 
      </div> <br/>
      <div class="row">
        <div class="col">
          <div class="list-group" *ngFor="let dataSet of tenantMetadata.dataSets">
              <a class="list-group-item" (click)=editorOption(dataSet.id) [id]="dataSet.id">  {{ dataSet.name }}</a>
          </div>
        </div>
        
        <div class="col">
          <app-editor-smldatasource [dataSource] = "selectedOption" [(ngModel)]="currentItem" (optionUpdated)="optionUpdated($event)"></app-editor-smldatasource>
        </div>
     
      </div>
    </div>
  </div>
 `
})

export class UserInput implements OnInit {  //name will be sml tenant meta data editor  SMLTenantMetadataEditor
  selectedOption: any;
  currentItem: any;
  tenantMetadata: any = smlTenantMetadataSample;

  constructor() { }

  ngOnInit() { }

  editorOption(id) {
    let index = 0;
    this.tenantMetadata.dataSets.forEach(item => {
      if (item.id == id) {
        this.selectedOption = item;
        this.selectedOption['index'] = index;
      }
      index++;
    });
  }

  optionUpdated(updatedItem){
    this.tenantMetadata.dataSets[updatedItem.index] = updatedItem;
    delete this.tenantMetadata.dataSets[updatedItem.index].index;
  }
}
