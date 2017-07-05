import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../authguard.guard';


@Component({
  selector: 'app-invalid-resource',
  template:  `
    <div class="container">
        <br/>
      
        <div class="row">
          <div class="col">
            <h2 id="listheader" class="text-center">Invalid URL</h2>
            <hr/>
          </div>
        </div>
      
    </div>
  `,
  styleUrls: ['./invalid-resource.component.css']
})
export class InvalidResourceComponent implements OnInit {
  JWT: any; 
  tenantId: any; 

  constructor(
    private authGuard: AuthGuard,
    private activatedRoute: ActivatedRoute,
    private router: Router) { 
    this.activatedRoute.params.subscribe((params: Params) => {
      this.JWT = params['JWT'];
      this.tenantId = params['tenantId'];

      if (this.tenantId && this.JWT) {
        if (this.authGuard.saveToken(this.JWT)) {
          this.router.navigate(['/dev/' + this.tenantId]);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() { }
}
