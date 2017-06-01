///<reference path="../../models/fakeData.ts"/>
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './UserInput.component.html',
  styleUrls: ['./UserInput.component.css']
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
