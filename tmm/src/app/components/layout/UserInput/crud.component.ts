/**
 * Created by dister on 5/11/2017.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dadcrud',
    template: `
      <div class="combobox">

          <select [(ngModel)]="selectedValue" #selectedOption (change)="add($event.target.value);" class="form-control" style="display: inline-block; color:black; font-weight: bold; max-width:150px;" >
             <option id="created" style="color:black;" *ngFor="let option of options; let i=index" value="{{i}}" [selected]="option.name" >{{ option.name }}</option>
             <option style="color:black;" value="{{-2}}">No Filter Applied</option>
             <option  id="selection" style="color:black;" value="{{-1}}" >Add Option</option> 
          </select>
          
          <div *ngIf="addValue">
            <div><input id="optionName" style="height:32px;" [(ngModel)]="optionName" type="text" placeholder="Option Name"></div>
            <div><input id="optionAttribute"  style="height:32px;" [(ngModel)]="optionAttribute" type="text" placeholder="Option Expression"></div>
            <span id="addNewOption" class="glyphicons glyphicons-ok" (click)="addNewOption($event)"></span> 
            <span class="glyphicons glyphicons-remove" (click)="add(-1)"></span>
          </div>     
          
          <div *ngIf="updateValue">
            <div><input id="updatedOptionName" style="height:32px;" [(ngModel)]="updatedOptionName" type="text" placeholder="New Option Name"></div>
            <div><input id="updatedOptionAttribute" style="height:32px;" [(ngModel)]="updatedOptionAttribute" type="text" placeholder="New Option Expression"></div>
            <span id='apply' class="glyphicons glyphicons-ok" (click)="updateSelected(selectedOption.value)"></span>
            <span id='delete' class="glyphicons glyphicons-bin" (click)="deleteOption(selectedOption.value)"></span>
            <span id='cancel' class="glyphicons glyphicons-remove" (click)="update()"></span>
          </div>
          
          <span *ngIf="selectedValue != -2" id="edit" class="glyphicons glyphicons-pencil" (click)="update()"></span>
      </div>
    `,
})

export class CrudComponent {

    addOption?: boolean = false;
    optionName?: any;
    optionAttribute?: any;
    updatedOptionName?:any;
    updatedOptionAttribute?:any;
    updateValue: boolean = false;
    addValue: boolean = false;
    selectedValue: number = -2;

  @Input()
    model: any;
  @Input()
    options:any;
  @Input()
    option: any;

  @Output() optionChanged = new EventEmitter();

    constructor() {}

    addNewOption(event) {
      if(!this.options){
        this.options=[];
      }
      this.option = {
        name: this.optionName,
        attribute: this.optionAttribute
      };
      this.options.push(this.option);
      this.addValue = false;
      this.optionChanged.emit(this.options.length -1);
      this.selectedValue = -2;

    }

    updateSelected(selected_option) {
      this.updateValue;
      this.options[selected_option].name = this.updatedOptionName;
      this.options[selected_option].attribute = this.updatedOptionAttribute;
      this.updateValue = false;
      this.optionChanged.emit(selected_option);
      this.clearFields();
    }

    update(){
      if (!this.updateValue) this.updateValue = true;
      else this.updateValue = false;
    }

    add(value){
      if(value == -2) {}
      if(value == -1){
        if (!this.addValue) this.addValue = true;
        else this.addValue = false;
      }
      this.optionChanged.emit(value);
      this.clearFields();
    }

    deleteOption(selected_option) {
      let parsed: any = parseInt(selected_option);
      if(parsed == this.options.length -1) {
          this.options.pop();
      } else {
          this.options.splice(parsed, 1);
      }
      this.optionChanged.emit(-2);
      this.updateValue = false;
      this.selectedValue = -2;
    }

    clearFields(){
      this.optionName ="";
      this.optionAttribute="";
      this.updatedOptionName="";
      this.updatedOptionAttribute="";
    }

}
