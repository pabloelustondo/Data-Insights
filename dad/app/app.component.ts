/**
 * Created by pelustondo on 11/22/2016.
 */
import { Component } from '@angular/core';
@Component({
    selector: 'dadapp',
    template: `
    <h1>{{title}}</h1>
    <dad></dad>
  `
})
export class DadAppComponent {
    title = 'Data Analytics Dashboard';
}