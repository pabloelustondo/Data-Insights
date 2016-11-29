/*
 * Written by Doga Ister
 */

import {
    Component,
    Input,
    ElementRef,
    OnChanges,
    ViewChild,
    SimpleChanges,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';
import * as d3 from 'd3';
import {BaseChart} from '../base-chart';
import {ChartTooltipService} from '../chart-tooltip/chart-tooltip.service';
const text = d3.text;

export interface DonutChartData {
    name: string;
    count: number;
}

@Component({
    selector: 'donut-chart',
    templateUrl: './../chart.ctrl.html',
    styleUrls: ['./donut-chart.ctrl.scss'],
    animations: [
        trigger('chartVisibility', [
            state('invisible', style({
                opacity: '0',
                display: 'none'
            })),
            state('visible', style({
                opacity: '1',
                display: 'flex'
            })),
            transition('visible => invisible', animate('150ms ease-in-out', style({opacity: '0'}))),
            transition('visible => invisible', animate('0ms 150ms ease-in-out', style({display: 'none'})))
        ]),
        trigger('overlayVisibility', [
            state('invisible', style({
                opacity: '0',
                display: 'none'
            })),
            state('visible', style({
                opacity: '1',
                display: 'flex'
            })),
        ])
    ]
})
export class DonutChart extends BaseChart implements OnChanges {

    @Input()
    public data;
    @Input()
    public title: string;
    @Input()
    public subtitle: string;

    @ViewChild('chartView')
    private _chartView: ElementRef;
    private _donutData: any[];
    private _donutTotal;
    private _htmlElement: HTMLElement;
    private _host: any;
    private _svg: any;
    private _width: number;
    private _height: number;
    private _pie: any;
    private _arc: any;
    private _outerArc: any;
    private _arcs: any;
    private _arcPaths: any;
    private _lines: any;
    private _donutLines: any;
    private _labels: any;
    private _donutLabels: any;
    private _radius: number;
    private _innerRadius: number;
    private _outerRadius: number;
    private _colors: string[];
    private _animationDuration: number = 350;
    private _animationDelay: number = 0;

    //Requests Angular for the element reference and then creates a D3 Wrapper for our host element
    constructor(element: ElementRef, private _tooltipService: ChartTooltipService) {
        super();
        this._htmlElement = element.nativeElement;

        //Specifies custom colors that are used
        this._colors = ['#46c0ab', '#ff6b57'];
    }

    public isEmpty(): boolean {
        return this._donutTotal ? this._donutTotal.count === 0 : true;
    }

    //Calculates the total number of devices
    public ngOnChanges(changes: SimpleChanges): any {
        if ('data' in changes && changes['data'].currentValue) {
            this._donutData = changes['data'].currentValue;

            if (this._donutData && this._donutData.length > 0) {
                this._donutTotal = this._donutData.reduce((a, b) => {
                    return {count: (a.count + b.count)};
                });

                if (this._donutTotal && this._donutTotal.count > 0) {
                    setTimeout(() => {
                        this._createChart();
                    }, 0);
                } else {
                    if (this._svg) {
                        d3.select(this._chartView.nativeElement).selectAll('svg.donut-chart-svg').remove();
                        this._svg = null;
                    }
                }
            }
        }

    }

    private _createChart() {
        this._host = d3.select(this._chartView.nativeElement);
        this._width = this._host[0][0].clientWidth;
        this._height = this._host[0][0].clientHeight;
        this._radius = this._width / 6; //Chart radius

        //Checks if height and width gets populated on the element after component is loaded
        if (this._width > 0 && this._height > 0) {
            //Checks if there is another chart and updates the chart, if there is not and another device group is chosen
            if (!this._svg) {
                if (!this._donutData || this._donutData.length === 0) {
                    return;
                }
                this._setup();
                this._buildSVG();
                this._animateDonut();
                this._showLines();
            } else {
                this._updateChart();
                this._showLabels();
                this._showLines();
            }
        }
    }

    //Gets the DOM element size & builds the container configs also creates the xScale and yScale ranges depending on calculations
    private _setup(): void {
        this._innerRadius = this._width / 5.5;
        this._outerRadius = this._width / 4;

        this._pie = d3.layout.pie().sort(null).value((d: any) => {
            return d.count;
        });
        this._arc = d3.svg.arc()
            .innerRadius(this._innerRadius)
            .outerRadius(this._outerRadius)
            .padAngle(.01);
        this._outerArc = d3.svg.arc()
            .innerRadius(this._innerRadius * 1.3)
            .outerRadius(this._outerRadius * 1.2);
    }

    // Builds SVG
    private _buildSVG(): void {
        var self = this;
        this._svg = this._host
            .append('svg')
            .attr('class', 'donut-chart-svg')
            .attr({
                viewBox: '0 0 ' + this._width + ' ' + this._height,
                preserveAspectRatio: 'xMidYMin meet',
                width: this._width,
                height: this._height
            })
            .append('g')
            .attr('transform', 'translate(' + (this._width / 32) + ',' + (this._height / 32 - 15) + ')');

        //Arcs set up
        this._arcs = this._svg.append('g')
            .attr('class', 'arcs');
        this._arcPaths = this._arcs.selectAll('path')
            .data(this._pie(this._donutData))
            .enter()
            .append('path')
            .attr('transform', 'translate(' + (this._width / 2) + ',' + (this._height / 2) + ')')
            .attr('fill', (d, i) => {
                return this._colors[i];
            })
            .attr('class', 'arc-path')
            .on('mouseout', function (d, i) {
                d3.select(this).style('fill', self._colors[i]);
                self._tooltipService.hide();
            })
            .on('mousemove', function (d, i) {
                // Highlight SVG element on mouseover event
                d3.select(this).style('fill', d3.rgb(self._colors[i]).darker(0.3).toString());
                var countString = d.data.count.toString() + ' (' + ((d.data.count / self._donutTotal.count) * 100).toFixed(1) + '%)';
                self._tooltipService.show(d.data.name, countString, self._colors[i], <MouseEvent>event);
            });

        //Labels set up
        this._labels = this._svg.append('g')
            .attr('class', 'labels')
            .attr('transform', 'translate(' + (this._width / 2) + ',' + (this._height / 2) + ')');
        this._donutLabels = this._labels.selectAll('text')
            .data(this._pie(this._donutData))
            .enter()
            .append('text')
            .attr('fill', (d, i) => {
                return this._colors[i];
            })
            .attr('class', 'donut-labels');

        this._showLabels();

        //Lines set up
        this._lines = this._svg.append('g').attr('class', 'polyline');
        this._donutLines = this._lines.selectAll('polyline')
            .data(this._pie(this._donutData))
            .enter()
            .append('polyline')
            .attr('transform', 'translate(' + (this._width / 2) + ',' + (this._height / 2) + ')')
            .attr('stroke', (d, i) => {
                return this._colors[i];
            })
            .attr('fill', (d, i) => {
                return 'transparent';
            })
            .attr('class', 'donut-lines');

        this._showLines();
    }

    //Writes labels
    private _showLabels(): void {
        const self = this;
        this._donutLabels = this._labels.selectAll('text')
            .data(this._pie(this._donutData));

        this._donutLabels
            .attr('transform', function (d) {
                var pos = self._outerArc.centroid(d);
                pos[0] = self._radius * 1.6 * (midAngle(d) < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function (d) {
                return midAngle(d) < Math.PI ? 'start' : 'end';
            })

            .text((d) => {
                if (d.data.count == 0) {
                    return '';
                } else {
                    return d.data.name;
                }
            })

            .attr('dy', 3);

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }
    }

    //Draws the lines from arc to labels
    private _showLines(): void {
        const self = this;
        this._donutLines = this._lines.selectAll('polyline')
            .data(this._pie(this._donutData))
            .attr('stroke', (d, i) => {
                if (d.data.count == 0) {
                    return 'transparent';
                } else { // if d.data.count == this._donutTotal
                    return this._colors[i];
                }
            });
        this._donutLines.transition().duration(this._animationDuration)
            .attrTween('points', function (d) {
                this._current = this.current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(d);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = self._outerArc.centroid(d2);
                    pos[0] = self._innerRadius * 1.4 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [self._arc.centroid(d2), self._outerArc.centroid(d2), pos];
                };
            });

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }
    }

    // Animates the donut drawing e
    private _animateDonut(): void {
        setTimeout(() => {
            this._arcPaths.transition()
                .duration(this._animationDuration)
                .attrTween('d', (d) => {
                    let interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
                    return ((t) => {
                        return this._arc(interpolate(t));
                    });
                })
                .each(function (d, i) {
                    this._current = d;
                });
            this._showLabels();
            this._showLines();
        }, this._animationDelay);
    }

    //Updates chart when another device group is chosen
    private _updateChart() {
        const self = this;
        this._showLabels();
        this._showLines();
        this._arcPaths.data(this._pie(this._donutData))
            .transition()
            .duration(500)
            .attrTween('d', function (d) {
                var i = d3.interpolate(this._current, d);
                this._current = i(0);
                return function (t) {
                    return self._arc(i(t));
                };
            });
    }
}