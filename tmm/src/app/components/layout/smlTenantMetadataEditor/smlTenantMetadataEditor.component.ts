///<reference path="../../models/fakeData.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataSourceList } from './tmmModels';
import { SmlTenantMetadata } from '../../../../sml/sml';

import { SmlDataService } from '../../../../sml/data.service';
import {smlTenantMetadataSample, smlTenantMetadataEmpty} from './jsonEditorSchema.configuration';
import { TmmConfigService } from './tmmconfig.service';

@Component({
  selector: 'smlTenantMetadataEditor' ,
  providers: [TmmConfigService],
  template: `
    <div>
      <div class="container">
        <br/>
        <!--<h3>Tenant Name: {{tenantMetadata.dataSets[0].from[0]}} </h3> -->
        <!--<h3>Tenant ID: {{tenantMetadata.tenantId}} </h3>-->
        <br/>
        <div class="row">
          <div class="col">
            <h2>List of Your Data Sets</h2>
            <div class="list-group" *ngFor="let dataSet of tenantMetadata.dataSets">
              <a class="list-group-item" (click)=editorOption(dataSet.id) [id]="dataSet.id">{{ dataSet.name }}</a>
            </div>
          </div>
          <div class="col">

            <h2>Editor</h2>
            <button type="button" class="btn btn-primary" (click)="dataSetInit()">Click to add a Data set</button>
            <button type="button" class="btn btn-primary" (click)="dataSetDelete()">Delete Selected</button>
            <br/><br/>
            <app-editor-smldatasource [dataSource] = "selectedOption" [(ngModel)]="currentItem" (optionUpdated)="optionUpdated($event)"></app-editor-smldatasource>
          </div>
        </div>
      </div>
    </div>
  `
})

export class smlTenantMetadataEditor implements OnInit {  //name will be sml tenant meta data editor  SMLTenantMetadataEditor
  selectedOption: any;
  currentItem: any;
  tenantMetadata: any = smlTenantMetadataSample;
  emptyDataSet: any = smlTenantMetadataEmpty;

  constructor(private tmmConfigService: TmmConfigService) {
    this.tmmConfigService.getTenantMetadata('testtenant-testuser').then(data => {
        try {
          let response = JSON.parse(data._body);
          console.log(response);
          //this.tenantMetadata = response[0];
        } catch (err) {
          console.error(new Error(err));
        }
      }
    );
    console.log(this.tenantMetadata);
  }

  ngOnInit() {

    // this.tenantMetadata = response;
  }

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

  optionUpdated(updatedItem) {
    console.log(updatedItem);
    this.tenantMetadata.dataSets[updatedItem.index] = updatedItem;
    delete this.tenantMetadata.dataSets[updatedItem.index].index;
    this.tmmConfigService.saveDataByTenantId( this.tenantMetadata.tenantId, this.tenantMetadata);
  }

  dataSetInit() {
    this.selectedOption = this.emptyDataSet;
    this.selectedOption['index'] = this.tenantMetadata.dataSets.length;
    console.log(this.selectedOption['index']);
  }

  dataSetDelete(selectedOption) {
    let parsed: any = parseInt(selectedOption);
    if (parsed === this.tenantMetadata.dataSets.length - 1 ) {
      this.tenantMetadata.dataSets.pop();
    } else {
      this.tenantMetadata.dataSets.splice(parsed, 1);
      this.selectedOption = this.emptyDataSet;
    }
    this.tmmConfigService.saveDataByTenantId( this.tenantMetadata.tenantId, this.tenantMetadata);
  }
}
