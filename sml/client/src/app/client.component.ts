import {Component, OnInit} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SmlDataSet } from "../../../common/sml";
import {smltestcases, SMLDataSetTestCase} from "./smltestcases";
import {smltestdata} from "./smltestdata";
import {SMLI} from "../../../common/smli";


@Component({
  selector: 'client-app',
  template: `
<h1>SMLDataset Interpreter - Test Harness - Reference Implementation</h1>
<br/>

<select [(ngModel)]="testcaseId" (change)="changeTestCase()">
<option *ngFor="let tc of testcases;let i = index"  [value]="i">{{tc.dataset.id}}</option>
</select>
Number of test cases: {{testcases.length}} 

<div *ngIf="testcase">
<button (click)="runTest()">Run Test Case</button>
<br/>

<h1>SMLDataset</h1> 
<textarea rows="200" cols="80" [(ngModel)]="testcaseDatasetJSON"
style="max-height:300px;min-height:100px; resize: none"></textarea>
<br/>

<h1>External Parameters (using default if nothing here)</h1>
<textarea rows="200" cols="80" [(ngModel)]="testcaseParametersJSON"
style="max-height:100px;min-height:100px; resize: none"></textarea>
<br/>

<h1>InputData(set)</h1>
<textarea rows="3000" cols="80" [(ngModel)]="testcaseInputDataJSON"
style="max-height:300px;min-height:100px; resize: none"></textarea>
<br/>

<h1>OutData(set)</h1>
<textarea rows="3000" cols="80" [(ngModel)]="testcaseOutputDataJSON"
style="max-height:300px;min-height:100px; resize: none"></textarea>
<br/>
</div>

`
})
export class ClientAppComponent implements OnInit {
  testcaseId: number;
  testcase: SMLDataSetTestCase;
  testcaseOutput: SmlDataSet;
  testcaseDatasetJSON:string;
  testcaseParametersJSON:string;
  testcaseInputDataJSON:string;
  testcaseInputData:SmlDataSet;
  testcaseOutputDataJSON:string;
  testcases: SMLDataSetTestCase[] = smltestcases;
  testdata: SmlDataSet[];
  smli: SMLI = new SMLI("http://http://localhost:8032/");  //FOR NOW!!!

  ngOnInit() {
    this.testdata = smltestdata;
    this.testcaseId=0;
    this.testcase = this.testcases[this.testcaseId];
    this.changeTestCase();
  }

  changeTestCase(){
    this.testcase = this.testcases[this.testcaseId];
    this.testcaseDatasetJSON = this.stringify(this.testcase.dataset);
    this.testcaseParametersJSON = this.stringify(this.testcase.parameters);

    //mhhh.... I think I need to reverse the test case idea... data set first...then input then ourput then maybe chart
    this.smli.getDataSet(this.testcase.dataset.from[0]).then(
      (inputDataSet) =>
      {
        this.testcaseInputData;
        this.testcaseInputDataJSON = this.stringify(this.testcaseInputData);
        this.runTest();
      }
    );


  }

  stringify(s){
    return JSON.stringify(s,null,2);
  }

  parse(s){
    return JSON.parse(s.replace("\t", "").replace("\n", ""));
  }

  runTest(){

    if (this.testcaseDatasetJSON) this.testcase.dataset = this.parse(this.testcaseDatasetJSON);
    if (this.testcaseParametersJSON) this.testcase.parameters = this.parse(this.testcaseParametersJSON);
    if (this.testcaseInputDataJSON) this.testcaseInputData = this.parse(this.testcaseInputDataJSON);

    this.testcaseOutput = this.smli.calculateDataSet(this.testcase.dataset, this.testcaseInputData, this.testcase.parameters);

    this.testcaseOutput = this.smli.calculateDataSet(this.testcase.dataset);

    this.testcaseOutputDataJSON = this.stringify(this.testcaseOutput.data);

  }

}
