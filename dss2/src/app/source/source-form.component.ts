/**
 * Created by vdave on 2/14/2017.
 */
import { Component } from '@angular/core';
import { SourcingForm } from './source-form'

@Component({
  moduleId: this.module.id,
  selector: 'source-form',
  templateUrl: './source-form.component.html'
})

export class SourceFormComponent {

  model = new SourcingForm('');

  submitted = false;
  onSubmit() { this.submitted = true; }
  newSource() {
    this.model = new SourcingForm('');
  }
}
