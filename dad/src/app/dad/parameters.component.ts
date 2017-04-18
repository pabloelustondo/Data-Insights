/**
 * Created by dister on 1/12/2017.
 */
import { Component, Input, Output, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { DadChart } from "./chart.component";
import { DadElementDataService } from "./data.service";
import { DadWidgetConfigsService, DadChartConfigsService } from './chart.service';
import { Mapper } from "./mapper";
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadFilterType, DadAlert, DadFilter, DadDimension, DadDimensionType, DadElement} from "./dadmodels"
import { DadWidget } from "./widget.component";

@Component({
    selector: 'dadparameters',
    providers: [DadElementDataService, DadWidgetConfigsService, DadChartConfigsService],
    template: `
    <div class="row">
        <div *ngIf="editMode">          
            <div *ngFor="let uiparam of element.uiparameters">
                <div><label>{{uiparam.Name}}</label></div>
                <div *ngIf="uiparam.Type == 'Date'">
                    <input type="date" [(ngModel)]="uiparam.Value['D']"/>       
                </div>
               
                <div *ngIf="uiparam.Type == 'DateTime'">
                    <input type="date" [(ngModel)]="uiparam.Value['D']"/>       
                    <timepicker [(ngModel)]="uiparam.Value['T']" (change)="changed()" [hourStep]="hstep" [minuteStep]="mstep" [showMeridian]=false [readonlyInput]="false"></timepicker>       
                </div>
    
                <div *ngIf="uiparam.Type == 'Duration'">
                    <timepicker [(ngModel)]="uiparam.Value" (change)="changed()" [hourStep]="hstep" [minuteStep]="mstep" [showMeridian]=false [readonlyInput]="false"></timepicker>
                </div>
                <div *ngIf="uiparam.Type == 'Number'"><input type="number" min="0" max="100" [(ngModel)]="uiparam.Value" /></div>  
                <div *ngIf="uiparam.Type == 'String'"><input type="text" [(ngModel)]="uiparam.Value" /></div>   
            </div>
            <!--refresh button here-->
            <br/>
            <div class="col-md-4 text-center">
                <button (click)="onRefreshButton()" style=" margin-left:-15px;" type="button" class="btn btn-secondary">
                    <span class="glyphicons glyphicons-refresh"></span>
                </button>
                <br/><br/>
            </div>
            <div>
            <!--This is actually close button-->
                <div class="col-md-4 text-center">
                <button (click)="onEdit()" type="button" class="btn btn-secondary">
                    <span class="glyphicons glyphicons-remove"></span>
                </button>
                </div>
            </div>     
        </div>
    </div>      
      
    <div class="row">
        <div *ngIf="!editMode">          
            <span *ngFor="let uiparam of element.uiparameters">
                <span *ngIf="uiparam.Type == 'DateTime'">
                    {{uiparam.Value['D']  }} {{addingZero(uiparam.Value['T'].getHours())}}:{{addingZero(uiparam.Value['T'].getMinutes())}}                        
                </span>
                 <span *ngIf="uiparam.Type == 'String' && uiparam.Value!='custom'">({{uiparam.Value}})</span> 
            </span>      
        </div>
    </div>
    `
})

export class DadParametersComponent implements OnInit {
    @Input()
    element: DadElement;
    data;
    mapper: Mapper = new Mapper();
    @Input()
    editMode:boolean = false;
    refreshMode:boolean = false;

    @Input()
    set onRefresh(value:boolean){
        if(this.element.uiparameters &&  this.element.uiparameters.length > 0 && this.element.uiparameters[0].Value ) {
            this.mapParameters2model();
            this.mapParameters2ui();
            this.parametersChanged.emit(true);
        }
    };

    @Output() parametersChanged = new EventEmitter();

        constructor(private dadElementDataService: DadElementDataService,
                private dadWidgetConfigsService: DadWidgetConfigsService) {}

    ngOnInit() {
        this.mapParameters2ui();
        this.mapParameters2model();
    }

    onEdit(message:string):void{
        if (!this.editMode) this.editMode = true;
        else this.editMode = false;
    }

    onRefreshButton(){
        this.onRefresh = true;
    }

    mapParameters2model():void{
        //this action will map UI parameters into model parameters back
        let parameters = this.element.parameters[0];   //maybe we need to stop having a list?
        if(!this.element.uiparameters){
            return;
        }
        for (let uiparam of this.element.uiparameters) {

            if (uiparam.Type === 'DateTime' || uiparam.Type === 'Date') {

                let datetime:Date = new Date(uiparam.Value['D']);
                let time:Date = uiparam.Value['T'];
                if (typeof time === 'string'){
                    time = new Date(time);
                    uiparam.Value['T'] = time;
                }
                datetime.setUTCHours(time.getUTCHours(), time.getUTCMinutes());
                parameters[uiparam.DataSource] = datetime.toISOString();

            }
            if (uiparam.Type === 'Number') {
                parameters[uiparam.DataSource] = uiparam.Value;
            }
            if (uiparam.Type === 'String') {
                parameters[uiparam.DataSource] = uiparam.Value;
            }
            if (uiparam.Type === 'Duration') {

                let time:Date = uiparam.Value;
                if (typeof time === 'string'){
                    uiparam.Value = new Date(time);
                }
                parameters[uiparam.DataSource] = this.mapDate2LongDuration(uiparam.Value);
            }
        }
    }

    mapParameters2ui():void{
        //this action will map model parameters into UI parameters
        let parameters = this.element.parameters[0];   //maybe we need to stop having a list?
        if(!this.element.uiparameters){
            return;
        }
        for (let uiparam of this.element.uiparameters) {
            if (uiparam.Type === 'DateTime' || uiparam.Type === 'Date') {
                let d: Date;
                if (parameters[uiparam.DataSource+"Auto"]=="yesterday"){
                    let dold = new Date(parameters[uiparam.DataSource]);
                    let hrs = dold.getHours();
                    let mins = dold.getMinutes();
                    let secs  = dold.getSeconds();
                    d = new Date();
                    d.setDate(d.getDate() - 1);
                    d.setHours(hrs,mins,secs);
                }else{ // we assume that we have a valid date
                    d = new Date(parameters[uiparam.DataSource]);
                }
                let yyyy = d.getFullYear();
                let m = d.getMonth()+1;
                let day = d.getDate();
                let mm = (m <10 )? "0" + m : "" + m;
                let dd = (day <10 )? "0" + day : "" + day;
                uiparam.Value = {};
                uiparam.Value['D'] = yyyy + "-" + mm + "-" + dd;
                uiparam.Value['T'] = d;
            }

            if (uiparam.Type === 'Number') {
                uiparam.Value = parameters[uiparam.DataSource];
            }
            if (uiparam.Type === 'String') {
                uiparam.Value = parameters[uiparam.DataSource];
            }
            if (uiparam.Type === 'Duration') {
                let Iduration: number = parameters[uiparam.DataSource];
                let Tduration = this.mapLongDuration2Date(Iduration);
                uiparam.Value = Tduration;
            }
        }
    }

    mapLongDuration2Date ( duration:number): Date {

        let hrs = Math.floor(duration);
        let mins = (duration - hrs) * 60;
        let time = new Date();
        time.setHours(hrs,mins);
        return time;
    }

    mapDate2LongDuration ( duration:Date): number {

        let hrs = duration.getHours();
        let mins = duration.getMinutes();
        let durationLong:number = hrs + mins/60;
        return durationLong;
    }

    fixDataNulls(){
        if (this.data[this.element.metrics[0].DataSource] === null) this.data[this.element.metrics[0].DataSource] = 0;
        if (this.data[this.element.metrics[1].DataSource] === null) this.data[this.element.metrics[1].DataSource] = 0;
        if (this.data[this.element.metrics[2].DataSource] === null) this.data[this.element.metrics[2].DataSource] = 0;
        if (this.data[this.element.metrics[3].DataSource] === null) this.data[this.element.metrics[3].DataSource] = 0;
    }

    addingZero(x:number):string{
        return (x <10 )? "0" + x : "" + x;
    }

}


