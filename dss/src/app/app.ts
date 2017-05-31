import { Component } from '@angular/core';
import { Router } from '@angular/router';
declare var require: any;

const template = require('./app.html');

@Component({
  selector: 'auth-app',
  template: template
})

export class App {
  constructor(public router: Router) {}
}
