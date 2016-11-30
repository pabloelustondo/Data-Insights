/**
 * Created by pelustondo on 11/21/2016.
 */
import { Component, Input, OnInit  } from '@angular/core';
import { DadChartDataService } from './data.service'


declare var d3, c3: any;

export class DadChart {
    id: string;
    name: string;
    type: string; //this needs to be enum i think
    parameters: any[];
}

@Component({
    selector: 'dadchart',
    providers:[DadChartDataService],
    template: ` <!--  BEGIN CHART COMPONENT -->
 
    <table style="border:solid">
    <tr><td> <div (click)="onSelect(chart)">{{chart.name}} </div> </td></tr>
    <tr *ngIf="chart.parameters"><td> <span *ngFor="let p of chart.parameters"> {{p.parameterType}} - {{p.dateFrom}} - {{p.dateTo}}</span></td></tr>
    <tr>
        <td> <div style="height: 300px  "><svg [id]="chart.id"></svg></div> </td>
        <td>
            <div>Raw Data: 
              <div *ngIf="data">
                <div *ngFor ="let d of data">
                {{d.Rng}} -- {{d.NumberOfDevices}}
                </div>
              </div>
              <div *ngIf="!data">
                Data Not Available
              </div>
            </div>
        </td>
    </tr>     
    </table>
    <br/>
    <br/>
    <!--  END CHART COMPONENT -->`
})
export class DadChartComponent implements OnInit {
    @Input()
    chart: DadChart
    data;

    constructor(private dadChartDataService: DadChartDataService) { }

    drawChartDogaBar(chartConfig:DadChart, data){
        /**
         * Created by dister on 11/29/2016.
         */
        const jsonData = [
            {"team" : "BI", "number_of_members" : 5},
            {"team" :"IT", "number_of_members" : 12},
            {"team" :"AfW", "number_of_members" : 5},
            {"team" :"QA", "number_of_members" : 100},
            {"team" :"iOS", "number_of_members" : 11},
            {"team" :"Windows Modern", "number_of_members" : 10},
            {"team" :"DB", "number_of_members" : 3},
            {"team" :"GCC", "number_of_members" : 7},
            {"team" :"NGUI", "number_of_members" : 15}
        ]

        var dataDoga = {};
        var team = [];
        jsonData.forEach(function(e) {
            team.push(e.team);
            dataDoga[e.team] = e.number_of_members;
        })

        let chart = c3.generate({
            bindto: '#' + chartConfig.id,
            data: {
                json: [ dataDoga ],
                keys: {
                    value: team
                },
                type:'bar',
            },
            tooltip: {
                format: {
                    title: function(value) {return ('Teams');}
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Teams',
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: 'Number of Members',
                        position: 'outer-top'
                    }
                }
            }
        });
    }

    drawChart(chartConfig:DadChart, data) {
        if (chartConfig.type === 'bar2') this.drawChartDogaBar(chartConfig, data);
        if (chartConfig.type === 'pie2') this.drawDogaChartPie(chartConfig, data);
    }

    drawDogaChartPie(chartConfig:DadChart, data) {};

    ngOnInit() {
        console.log("CHART starts drawing :" + this.chart.id);

        this.dadChartDataService.getChartData(this.chart).then(
            data => {
                this.data = data.data;
                this.drawChart(this.chart,this.data);
            }
        ).catch(err => console.log(err.toString()));


        /*
        this.dadChartDataService.getChartData().then(data => {
            this.dadDrawChart(this.chart,data);
        });
    */

    }
}

