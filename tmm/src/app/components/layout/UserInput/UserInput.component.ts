///<reference path="../../models/fakeData.ts"/>
import { Component, OnInit } from '@angular/core';

@Component({
  template: `<div class="row">
  <div class="large-3 columns">
    <ul>
      <li *ngFor="let item of fakeDataPhoneModels">
        <a (click)="selectJSON(item)">
          {{item.name}}
        </a>
      </li>
    </ul>
  </div>
  <div class="col-xs-5">
    <form (submit)="onSubmitValidateJSON()">
      <label> {{ toDisplay.name }}
        <textarea autofocus rows="20vh">
         {{toDisplay | json }}
        </textarea>
      </label>
      <button type="button" class="btn btn-primary">Clear</button>
    </form>
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
}
