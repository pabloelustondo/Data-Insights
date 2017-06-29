
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TmmConfigService } from "../layout/smlTenantMetadataEditor/tmmconfig.service";
import {
  smlTenantMetadataEmpty,
  smlTenantMetadataSample
} from "../layout/smlTenantMetadataEditor/jsonEditorSchema.configuration";
export type DataSourceTypeOptions = 'MCDP' | 'API' | 'Other...';

@Component({
  selector: 'selDataSets',
  styleUrls: ['./selDataSets.component.css'],
  templateUrl: 'selDataSets.html'
})

export class selDataSetsComponent implements OnInit {
  enrollStatus: boolean;
  dataSourceType: DataSourceTypeOptions;
  options: any[] = [{'option': 'MCDP'}, {'option': 'API'}, {'option': 'Other...'}];


  tenantMetadata: any = smlTenantMetadataSample;
  selectedOption: any ={};
  emptyDataSet: any = smlTenantMetadataEmpty;
  index: number = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private tmmConfigService: TmmConfigService,
              private router: Router) { }

  ngOnInit() {
    this.getTenantMetadata();
  }

  showAddSource() {
    console.log('enter show add source');

    if (!this.enrollStatus) {
      this.enrollStatus = true;
    } else {
      this.enrollStatus = false;
    }
  }

  redirect() {
    this.router.navigate(['/editDataSource/' + this.tenantMetadata.tenantId]);
  }

  getTenantMetadata() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.tenantMetadata.tenantId = params['tenantId'];

      this.tmmConfigService.getTenantMetadata(this.tenantMetadata.tenantId).then(data => {
        if (data && data._body) {
          try {
            let response = JSON.parse(data._body);

            if (response.length != 0) {
              this.tenantMetadata.tenantId = params['tenantId'];
              this.tenantMetadata.dataSets = response[0].dataSets;
              this.tenantMetadata.name = response[0].name;
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
  }

  dataSetInit() {
    this.selectedOption = this.emptyDataSet;
    this.selectedOption['index'] = this.tenantMetadata.dataSets.length;
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

    let newTenantMetadata = Object.assign({}, this.tenantMetadata);

    newTenantMetadata.dataSets[updatedItem.index] =  updatedItem;
    delete newTenantMetadata.dataSets[updatedItem.index].index;

    this.tmmConfigService.saveDataByTenantId(this.tenantMetadata.tenantId, newTenantMetadata, data => {
      if (data) {
        this.getTenantMetadata();
      }
    });
  }

  dataSetDelete() {
    let parsed: any = this.index;

    if(parsed === this.tenantMetadata.dataSets.length - 1) {
      this.tenantMetadata.dataSets.pop();
    } else {
      this.tenantMetadata.dataSets.splice(parsed, 1);
    }
    this.selectedOption.index = this.tenantMetadata.dataSets.length();
    this.selectedOption = this.emptyDataSet;


    this.tmmConfigService.deleteUserByTenantId( this.tenantMetadata.tenantId);
    this.tmmConfigService.saveDataByTenantId( this.tenantMetadata.tenantId, this.tenantMetadata, (data) => {
      if (data && data._body) {
        this.getTenantMetadata();
      }
    });
  }
    //TODO: copy and paste, need to change
  addSource(dataSourceForm) {
    this.activatedRoute.params.subscribe((params: Params) => {
      let tenantId = params['tenantId'];

      console.log(dataSourceForm);
      let inputs = dataSourceForm.getElementsByTagName('input');
      let inputValues = [];

      for (let ctr = 0;  ctr < inputs.length; ctr++) {
        let inputInformation = {
          inputName : inputs[ctr].id,
          inputValue :  inputs[ctr].value
        };
        inputValues.push(inputInformation);
      }

      var dataPack = {
        dataSourceType: this.dataSourceType,
        data: inputValues
      }

      this.tmmConfigService.insertDataSourceByTenantId(tenantId, dataPack).then(data => {
        if (data) {
          console.log(data);
        }
      });
    });

  }
}
