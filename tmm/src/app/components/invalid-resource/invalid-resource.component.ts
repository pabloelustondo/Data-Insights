import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invalid-resource',
  template:  `
    <div class="container">
        <br/>
      
        <div class="row">
          <div class="col">
            <h2 id="listheader" class="text-center">Invalid resource provided</h2>
            <hr/>
            <div class="list-group" *ngFor="let dataSet of tenantMetadata.dataSets">
              <a id="listItemsChoose" class="list-group-item" (click)=editorOption(dataSet.id) [id]="dataSet.id">{{ dataSet.name }}</a>
            </div>
          </div>
        </div>
      
    </div>
  `,
  styleUrls: ['./invalid-resource.component.css']
})
export class InvalidResourceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
