/**
 * Created by dister on 12/21/2016.
 */
import {Component, Input} from '@angular/core';


@Component({
  selector: 'dropdown',
  template: ` 
   <div class="dropdown">
      <div  (click)="onOpen()" >
        <input type="text" [(ngModel)]="selectedNumber" />
      </div>
      <div class="dropdown-content" *ngIf="open">
  
          <div  *ngFor="let number of numbers" 
              (click)="onSelect(number)">{{number}}
          </div>   
      </div>
    </div>
  `,
  styles: [`
    .dropdown {
        position: relative;
        cursor: pointer;
    }

    .dropdown-content {
        position: relative;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 12px 16px;
        z-index: 1;
    }
    
    .dropdown:hover .dropdown-content:hover {
        display: block;
    }
    `],
  providers: []
})
export class DropDown {
  @Input()
  numbers: number[];
  selectedNumber: number;
  open: boolean = false;

  constructor() {

  }

  onSelect(number:number): void {
    this.selectedNumber=number;
    this.open = false;
  }

  onOpen(): void {
    this.open = true;
  }

}

