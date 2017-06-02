///<reference path="../../models/fakeData.ts"/>
import { Component, OnInit } from '@angular/core';
//import { DadCrud } from '../../../../../../dad/src/app/dad/crud.component';

@Component({
  template: `<div class="row">
  <div class="col-md-4">
    <ul>
      <li *ngFor="let item of fakeDataPhoneModels">
        <a (click)="selectJSON(item)">
          {{item.name}}
        </a>
      </li>
    </ul>
  </div>
  <div class="col-md-8">
    <form (submit)="onSubmitValidateJSON()">
      <label> {{ toDisplay.name }}
        <textarea autofocus cols="100%" rows="10">  
         {{toDisplay | json }}
        </textarea>
      </label>
    </form>
  </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <span class="glyphicons glyphicons-plus"></span>
    </div>
</div>
 `
})
export class UserInput implements OnInit {
  toDisplay: String;
  fakeDataPhoneModels = [
    {
      "name": "iPhone 8 Apple Edition",
      "os": "iOS",
      "version": "11",
      "modelNumber": "HK2A3A1B",
      "carrier": "Freedom"
    },
{
  "name": "Pixel 2 XL",
  "os": "Android",
  "version": "7.1",
  "modelNumber": "Dolphine",
  "carrier": "Rogers"
},
{
  "name": "DebianMax",
  "os": "Android",
  "version": "7.0",
  "modelNumber": "Jessie12",
  "carrier": "Bell"
},
{
  "name": "Blackberry Passport",
  "os": "BB10",
  "version": "10.1.23",
  "modelNumber": "Dolphine",
  "carrier": "Rogers"
}];
  constructor() {
  }

  ngOnInit() {
  }

  selectJSON(item) {
    this.toDisplay = item;
  }

  isEmpty(item) {
    return (item == null);
  }
}
