import { Component, OnInit } from '@angular/core';
import { smlTenantMetadataSample, smlTenantMetadataEmpty } from '../layout/smlTenantMetadataEditor/jsonEditorSchema.configuration';
import { ActivatedRoute, Params } from '@angular/router';
import { TmmConfigService } from '../layout/smlTenantMetadataEditor/tmmconfig.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'datasource-overview',
  template: `
    <div class="container">
        <h1 class="text-center"> Data Source for {{ tenantMetadata.tenantId }} </h1>
        <hr />
        <div *ngIf="editDataSourceForm">
          <form #editedForm>
            <div class="row">
                <div class="col-4">
                    <label> Name
                        <input name="editedName" type="text" value="{{ editDataSourceObject.name }}">
                    </label>
                </div>
                <div class="col-4">
                    <label for> Type
                        <input name="editedType" type="text" #editDataSourceObject.type value="{{ editDataSourceObject.type }}">
                    </label>
                </div> 
                <div class="col-4">
                    <label> Active
                      <select name="activeStatusSelection" id="statusSelection" [(ngModel)]="selectedStatus">
                      <option *ngFor="let option of statusOptions"
                              [value]="option" >
                          {{option}}
                        </option>
                      </select>
                        <select name="editedActive"> 
                            <option value="true" [selected]="editDataSourceObject.active == true"> True</option>
                            <option value="false" [selected]="editDataSourceObject.active == false">False</option>
                        </select>
                    </label>
                </div>
            </div>
            <h2>Properties</h2>
            <div class="row">    
                <div name="editedProp" class="col-4" *ngFor="let prop of editDataSourceObject.properties">
                    <input type="text" value="{{ prop }}">                 
                </div>
            </div>
            <button class="btn btn-primary" (click)="addNewProperty()">Add Another Property</button>
            <button class="btn btn-primanry" (click)="saveEditedItem(editedForm)">Save</button>
          </form>
        
        <hr />
        </div>
        <div class="row">
            <div class="col">
                <h3> Data Source </h3>
            </div>
            <div class="col">
                <h3> Type </h3>
            </div>
            <div class="col">
                <h3> Active </h3>
            </div>
            <div class="col">
                <h3> ID </h3>
            </div>
           
              <div class="col">
                <h3> Edit </h3>
            </div>
            <div class="col">
                <h3> Delete </h3>
            </div>
          <div class="col">
            <h3> Download Credentials </h3>
          </div>
        </div>
        <!-- this should be datasource instead of dataSources-->
        <div class="row" *ngFor="let dataSource of tenantMetadata.dataSources">
            <div class="col">
                {{ dataSource.name }}
            </div>
            <div class="col">
                {{ dataSource.type }}
            </div>
            <div class="col">
                {{ (dataSource.active)? 'Active' : 'Not Active' }}
            </div>
            <div class="col">
                {{ dataSource.id }} 
            </div> 
            <div class="col">
                <button class="btn btn-outline-primary btn-block" (click)="EditDataSourceObject(dataSource)">Edit</button> 
            </div> 
            <div class="col">
                <button class="btn btn-outline-danger btn-block" (click)="DeleteDataSourceObject(dataSource)">Delete</button> 
            </div>
          <div class="col">
            <button class="btn btn-outline-danger btn-block" (click)="DownloadCredentials(dataSource)">Download Credentials</button>
          </div>
        </div>
    </div>
  `,

  /*      id: '10-23-1',
      name: 'Test Data Set 01',
      type: 'TestMockData',
      active: true,
      properties: ['Test', 'Doga', 'Is', 'AWesome'] */

  styleUrls: ['./smlDataSourceOverview.component.css']
})
export class smlDataSourceOverview implements OnInit {
    tenantMetadata: any =  smlTenantMetadataSample;
    editDataSourceObject: any;
    editDataSourceForm: boolean = false;
    bools: any = [true, false];
    statusOptions: string[] = ['enable', 'disable'];
    selectedStatus: string;
    constructor(
        private activatedRoute: ActivatedRoute,
        private tmmConfigService: TmmConfigService) {
            this.getTenantMetadata();
            this.selectedStatus = '';
    }

    ngOnInit() {
    }

    getTenantMetadata() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.tenantMetadata.tenantId = params['tenantId'];

      this.tmmConfigService.getTenantMetadata(this.tenantMetadata.tenantId).then(data => {
        if (data && data._body) {
          try {
            let response = JSON.parse(data._body);

            if (response.length != 0) {
              this.tenantMetadata = response[0];
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
  }

  EditDataSourceObject(dataSource) {
      this.editDataSourceObject = dataSource;
      this.editDataSourceForm = true;
  }
  DeleteDataSourceObject(dataSource) {
    this.editDataSourceObject = dataSource;
    this.editDataSourceForm = true;
  }

  DownloadCredentials(dataSource) {
    this.editDataSourceObject = dataSource;
    this.editDataSourceForm = true;

    const _agentId = dataSource.id;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-access-token': ''
    });
    this.tmmConfigService.getDataSourceCredential(this.tenantMetadata.tenantId, dataSource).then(data => {
      if (data) {
        console.log(data);
        const blob = new Blob([data], { type: 'text/csv' });
        FileSaver.saveAs(blob, 'MCDP_Access.key');
        // this.error = null;
      }
    });
    /*
    this.http.get( backendUrl + '/sourceCredentials/' + _agentId, { headers: headers })
      .subscribe(
        response => {
          let response_body = response['_body'];
          var blob = new Blob([response_body], { type: 'text/csv' });
          FileSaver.saveAs(blob, 'MCDP_Access.key');
          this.error = null;
        },
        error => {
          this.error = error.text();
          console.log(error.text());
        }
      );*/
  }

  addNewProperty() {
      this.editDataSourceObject.properties.push('');
  }

  saveEditedItem(editedForm) {
      console.log(editedForm.getElementsByTagName('input'));
      console.log(this.selectedStatus);
  }

  callType(value) {
    console.log(value);
  }
}

