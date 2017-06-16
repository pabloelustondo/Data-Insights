///<reference path="../../models/fakeData.ts"/>
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataSourceList } from './tmmModels';
import { SmlTenantMetadata } from '../../../../sml/sml';
import {ActivatedRoute, Params, Router} from '@angular/router';

import { SmlDataService } from '../../../../sml/data.service';
import { smlTenantMetadataSample, smlTenantMetadataEmpty } from './jsonEditorSchema.configuration';
import { TmmConfigService } from './tmmconfig.service';

@Component({
  selector: 'smlTenantMetadataEditor' ,
  providers: [TmmConfigService],
  template: `
    <div>
      <div *ngIf="tenantMetadata.dataSets && tenantMetadata.tenantId" class="container">
        <br/>
        <h3 id="tenantname">Tenant Name:</h3> <i>{{tenantMetadata.dataSets[0].from[0]}}</i>
        <h3 id="tenantid">Tenant ID:</h3> <i>{{tenantMetadata.tenantId}}</i>
        <hr/>
        <div class="row">
          <div class="col">
            <h2 id="listheader">List of Your Data Sets Definition</h2>
            <div class="list-group" *ngFor="let dataSet of tenantMetadata.dataSets">
              <a id="listItemsChoose" class="list-group-item" (click)=editorOption(dataSet.id) [id]="dataSet.id">{{ dataSet.name }}</a>
            </div>
          </div>
          <div class="col">

            <h2 id="editorheader">Editor</h2>
            <button id="addDataSet" type="button" class="btn btn-primary" (click)="dataSetInit()">Click to add a Data set</button>
            <button id="deleteDataSet" type="button" class="btn btn-primary" (click)="dataSetDelete()">Delete Selected</button>
            <br/><br/>
            <app-editor-smldatasource [dataSource] = "selectedOption" (optionUpdated)="optionUpdated($event)"></app-editor-smldatasource>
          </div>
        </div>
      </div>
    </div>
  `
})

export class smlTenantMetadataEditor implements OnInit {  //name will be sml tenant meta data editor  SMLTenantMetadataEditor
  selectedOption: any ={};
  currentItem: any = 0;
  tenantMetadata: any = smlTenantMetadataSample;
  emptyDataSet: any = smlTenantMetadataEmpty;
  index: number = 0;
  urlId: any;

  constructor(private tmmConfigService: TmmConfigService, private activatedRoute: ActivatedRoute) {
    //console.log(router);
  }

  ngOnInit() {
    //this.urlId = this.router.url;
    this.activatedRoute.params.subscribe((params: Params) => {

      this.urlId = params['tenantId'];
      console.log(this.urlId);

      this.tmmConfigService.getTenantMetadata(this.urlId).then(data => {
          if (data && data._body) {
            try {
              let response = JSON.parse(data._body);
              console.log(response);
              this.tenantMetadata.dataSets = response[0].dataSets;
            } catch (err) {
              console.error(new Error(err));
            }
          }
        }
      );
    });


    console.log(this.tenantMetadata);
  }

  editorOption(id) {
    this.index = 0;
    let found = false;
    this.tenantMetadata.dataSets.forEach(item => {
      if (item.id === id) {
        this.selectedOption = item;
        this.selectedOption['index'] = this.index;
        console.log(this.index);
        found = true;
      }
      if (!found) {
        this.index++;
      }
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
  }

  dataSetDelete() {
    let parsed: any = this.index;

    if(parsed == this.tenantMetadata.dataSets.length - 1) {
      this.tenantMetadata.dataSets.pop();
    } else {
      this.tenantMetadata.dataSets.splice(parsed, 1);
    }
    this.selectedOption = this.emptyDataSet;


    this.tmmConfigService.deleteUserByTenantId( this.tenantMetadata.tenantId);
    this.tmmConfigService.saveDataByTenantId( this.tenantMetadata.tenantId, this.tenantMetadata);

  }
}
