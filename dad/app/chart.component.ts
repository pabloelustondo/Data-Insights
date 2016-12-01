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
 
    <div style="height:700px;  width:700px" [id]="chart.id"></div> 

    <!--  END CHART COMPONENT -->`
})
export class DadChartComponent implements OnInit {
    @Input()
    chart: DadChart
    data;

    constructor(private dadChartDataService: DadChartDataService) { }
    drawChartBar(chartConfig:DadChart, data){
        var barData = {};
        var team = [];
        data.forEach(function(e) {
            team.push(e.Rng);
            barData[e.Rng] = e.NumberOfDevices;
        })

        c3.generate({
            size: {
              height: 400,
                width: 400
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [ barData ],
                keys: {
                    value: team
                },
                type:'bar',
            },
            tooltip: {
                format: {
                    title: function(value) {return ('Range of Battery Levels');}
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Range of Battery Levels',
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: 'Number of Devices',
                        position: 'outer-top'
                    }
                }
            }
        });
    }

    drawChartPie(chartConfig:DadChart, data) {
        var pieData = {};
        var brand = [];
        data.forEach(function(e) {
            brand.push(e.Rng);
            pieData[e.Rng] = e.NumberOfDevices;
        })

        c3.generate({
            size: {
                height: 400,
                width: 400
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [ pieData ],
                keys: {
                    value: brand
                },
                type:'pie',
            },
        });
    };

    drawChartDot(chartConfig:DadChart, data) {
        var dotData = {};
        var device_owner = [];
        data.forEach(function (e) {
            device_owner.push(e.Rng);
            dotData[e.Rng] = e.NumberOfDevices;
        })

        c3.generate({
            size: {
                height: 400,
                width: 400
            },
            bindto: '#' + chartConfig.id,
            data: {
                json: [dotData],
                keys: {
                    value: device_owner
                },
                type: 'spline',
            },
            tooltip: {
                format: {
                    title: function () {
                        return ('Range of Battery Levels');
                    },
                }
            },
            axis: {
                x: {
                    label: {
                        text: 'Range of Battery Levels',
                        position: 'outer-right'
                    }
                },
                y: {
                    label: {
                        text: 'Number of Devices',
                        position: 'outer-top'
                    }
                }
            },
        });
    };

    drawChartSpline(chartConfig:DadChart, data){
        var data1 = {};
        var brand = [];
        data.forEach(function(e) {
            brand.push(e.Rng);
            data1[e.Rng] = e.NumberOfDevices;
        })
        c3.generate({
            size: {
                height: 400,
                width: 400
            },
            bindto: '#' + chartConfig.id,
            data: {
                columns:[
                   ['Number of Devices',30,40,500,0],
                    ['Range', 1, 10, 90, 70, 85, 5, 100]
                ],
                keys: {
                    value: brand
                },
                type: 'spline',
            },
        });
    }

    drawChart(chartConfig:DadChart, data) {
        if (chartConfig.type === 'bar') this.drawChartBar(chartConfig, data);
        if (chartConfig.type === 'pie') this.drawChartPie(chartConfig, data);
        if (chartConfig.type === 'dot') this.drawChartDot(chartConfig, data);
        if (chartConfig.type === 'spline') this.drawChartSpline(chartConfig, data);
    }

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

