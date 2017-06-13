import {Component, resolveForwardRef} from '@angular/core';
import { Router } from '@angular/router';
import {smlTenantMetadataEditor} from './components/layout/smlTenantMetadataEditor/smlTenantMetadataEditor.component';

@Component({
  selector: 'body',
  template: `
    <div>
      <smlTenantMetadataEditor></smlTenantMetadataEditor>
    </div>
  `,
})
export class AppComponent {

  constructor(){}

  OnInit(){}
}
