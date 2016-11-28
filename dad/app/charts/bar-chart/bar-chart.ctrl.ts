import {
    Component,
    Input,
    ElementRef,
    ViewChild,
    OnChanges,
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

export interface StackedChartData {
    kind: string;
    count: number;
    colour: number;
    header: string;
    displayName: string;
    data: Bar[];
}

interface Bar {
    label: string;
    count: number;
}

interface Stack extends d3.layout.stack.Value {
    kind: string;
    versionLabel: string;
    colour: number;
}

@Component({
    selector: 'stacked-columns',
    templateUrl: './../chart.ctrl.html',
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
export class StackedColumnChart extends BaseChart implements OnChanges {

    @Input()
    public data;
    @Input()
    public title: string;
    @Input()
    public subtitle: string;

    @ViewChild('chartView')
    private _chartView: ElementRef;
    private _stackedData: StackedChartData[];
    private _htmlElement: HTMLElement;
    private _host: any;
    private _svg: any;
    private _width: number;
    private _height: number;
    private _smallSquareSize: number = 4;
    private _columnWidthCoefficient: number = 0.6; // Coefficient to control the column width
    private _svgPaddingBottom: number = this._smallSquareSize * 5; // 5 small squares
    private _tickPositionOffset: number = this._smallSquareSize * 7; // 7 small squares (4 small squares for icon) (3 small squares for space)
    private _xScale: d3.scale.Ordinal<string, number>;
    private _yScale: d3.scale.Linear<number, number>;
    private _xAxis: d3.svg.Axis;
    private _yAxis: d3.svg.Axis;
    private _dataStackLayout: any;
    private _stackedBar: any;
    private _colors: string[];
    private _isDisplayed = false;

    private _animationDuration: number = 350;
    private _animationDelay: number = 0;
    private _delayBetweenBarAnimation: number = 0;
    private _disappearAnimationDuration: number = 150;

    // We request angular for the element reference and then we create a d3 Wrapper for our host element
    constructor(element: ElementRef, private _tooltipService: ChartTooltipService) {
        super();
        this._htmlElement = element.nativeElement;

        // SOTI color palette
        this._colors = ['#33526e', '#618bb1', '#46c0ab', '#ff6b57', '#ff894c', '#62656a', '#f4d42f'];
    }

    public isEmpty(): boolean {
        return this._stackedData ? this._stackedData.length === 0 : true;
    }

    public ngOnChanges(changes: SimpleChanges): any {
        if ('data' in changes) {
            this._stackedData = changes['data'].currentValue;
            this._host = d3.select(this._chartView.nativeElement);

            if (this._stackedData) {
                if (this._isDisplayed) {
                    this._depopulateStackedBar();
                }
            }

            // if stacked bar chart is displayed, we need to have some delay before draw a new chart
            var initialAnimationDelay = 0;
            if (this._isDisplayed) {
                initialAnimationDelay = this._disappearAnimationDuration;
            }
            this._isDisplayed = false;

            setTimeout(() => {
                if (this._stackedData) {
                    this._createChart();
                }
            }, initialAnimationDelay);
        }
    }

    private _createChart() {
        this._width = this._host[0][0].clientWidth;
        this._height = this._host[0][0].clientHeight - this._svgPaddingBottom;

        // Check if height and width gets populated on the element after component is loaded
        if (this._width > 0 && this._height > 0) {
            // check if there is another chart
            if (this._svg) {
                d3.select(this._chartView.nativeElement).selectAll('svg.stacked-columns-chart-svg').remove();
                this._svg = null;
            }

            if (!this._stackedData || this._stackedData.length === 0) {
                return;
            }

            this._setup();
            this._buildSVG();
            this._updateData();
            this._drawXAxis();
            this._drawYAxis();
            this._populatePlatformChartBar();
            this._createStackedBar();
            this._populateStackedBar();

            this._isDisplayed = true;
        }
    }

    // Basically we get the dom element size and build the container configs also we create the xScale and yScale ranges depending on calculations
    private _setup(): void {
        this._xScale = d3.scale.ordinal().rangeRoundBands([0, this._width], this._columnWidthCoefficient); // Column width calculation
        this._yScale = d3.scale.linear().range([this._height, this._tickPositionOffset]);
    }

    // We can now build our SVG element using the configurations we created
    private _buildSVG(): void {
        this._svg = this._host.append('svg')
            .attr('class', 'stacked-columns-chart-svg')
            .attr('viewBox', '0 0 ' + this._width + ' ' + this._height)
            .attr('preserveAspectRatio', 'xMidYMin meet')
            .attr('width', this._width)
            .attr('height', this._height)
            .append('g')
            .attr('transform', 'translate(8, -4)');
    }

    private _updateData(): void {
        this._xScale.domain(this._stackedData.map((d) => d.kind));
        this._yScale.domain([0, this._getMaxY()]).nice();

        let numLayers = d3.max(this._stackedData, (data: StackedChartData) => {
            return data.data.length;
        });

        let dataIntermediate: Stack[][] = [];
        for (let i = 0; i < numLayers; i++) {
            dataIntermediate.push(this._stackedData.map((d): Stack => {
                if (d.data[i] != null) {
                    return {
                        x: this._xScale(d.kind),
                        y: d.data[i].count,
                        kind: d.kind,
                        versionLabel: d.data[i].label,
                        colour: d.colour
                    };
                } else {
                    return {x: 0, y: 0, kind: '', versionLabel: '', colour: -1};
                }
            }));
        }

        this._dataStackLayout = d3.layout.stack()(dataIntermediate);
    }

    // Method to create the X-Axis, will use 'make' as tick
    private _drawXAxis(): void {
        this._xAxis = d3.svg.axis().scale(this._xScale);
        this._svg.append('g')
            .attr('class', 'x-axis')
            .attr('opacity', '0')
            .call(this._xAxis)
            .selectAll('g')
            .data(this._stackedData)  // map API data to axis elements (to get colour and icon)
            .append('text')
            .attr('y', '15')
            .attr('x', '-5')
            .attr('style', (d: StackedChartData) => {
                return 'fill: ' + this._colors[d.colour] + ';  font-family: icomoon !important;';
            })
            .text((d) => d.header);

        this._svg.select('g.x-axis').transition().duration(this._animationDuration).attr('opacity', '1');
    }

    // Draw the Y-Axis label, grid lines with stroke-dasharray, and covers
    private _drawYAxis(): void {
        var numOfTicks: number;
        switch (this._getMaxY()) {
            case 3:
                numOfTicks = 4;
                break;
            case 2:
                numOfTicks = 2;
                break;
            case 1:
                numOfTicks = 1;
                break;
            case 0:
                numOfTicks = 1;
                break;
            default:
                numOfTicks = 5;
                break;
        }

        // Y-Axis Label
        this._yAxis = d3.svg.axis()
            .scale(this._yScale)
            .ticks(numOfTicks)
            .tickSize(0)
            .tickFormat(d3.format('s')) // TickFormatting
            .orient('left');
        this._svg.append('g')
            .attr('class', 'y-label')
            .attr('transform', 'translate(12, -1)')
            .style('fill', '#adb4bc') // soti grey
            .style('font-weight', '600')
            .style('font-size', '12px')
            .attr('opacity', '0')
            .call(this._yAxis);

        // Y-Axis grid lines with stroke-dasharray
        var yGridlines = d3.svg.axis()
            .scale(this._yScale)
            .ticks(numOfTicks)
            .tickSize(this._width - 36)
            .tickFormat('')
            .orient('right');
        this._svg.append('g')
            .attr('class', 'y-gridlines')
            .attr('transform', 'translate(20, -1)')
            .attr('x1', 0)
            .attr('x2', this._width)
            .attr('y1', this._height)
            .attr('y2', this._height)
            .attr('fill', 'none')
            .attr('shape-rendering', 'crispEdges')
            .attr('stroke', '#e7eaee') // soti grey lighter
            .attr('stroke-width', '1px')
            .attr('stroke-dasharray', ('3, 3'))
            .attr('opacity', '0')
            .call(yGridlines);

        // Animation
        this._svg.select('g.y-label').transition().duration(this._animationDuration).attr('opacity', '1');
        this._svg.select('g.y-gridlines').transition().duration(this._animationDuration).attr('opacity', '1');
    }

    // Will return the maximum value in any dataset inserted, so we use it later for the maximum number in the Y-Axis
    private _getMaxY(): number {
        return d3.max(this._stackedData, (data: StackedChartData) => data.count);
    }

    private _createStackedBar(): void {
        this._stackedBar = this._svg.selectAll('.stack')
            .data(this._dataStackLayout)
            .enter().append('g')
            .attr('class', 'stack');
    }

    // Now we populate using our dataset, mapping the x and y values into the x and y domains, also we set the interpolation so we decide how the Area Chart is plotted
    private _populateStackedBar(): void {
        const self = this;

        this._stackedBar.selectAll('rect')
            .data((d) => d)
            .enter()
            .append('rect')
            .attr('class', 'column-part')
            .attr('x', (d: Stack) => d.x)
            .attr('y', () => this._height)
            .attr('width', this._xScale.rangeBand())
            .attr('height', 0)
            .style('fill', (d: Stack) => this._colors[d.colour])
            .call(this._animateColumnsToValue, this)
            .on('mouseout', function (d: Stack) {
                d3.select(this).style('fill', self._colors[d.colour]);
                self._tooltipService.hide();
                self._svg.select('.platform-char-bar-' + d.kind).style('opacity', '0');
            })
            .on('mousemove', function (d: Stack) {
                // Highlight SVG element on mouseover event
                d3.select(this).style('fill', d3.rgb(self._colors[d.colour]).darker(0.3).toString());
                self._svg.select('.platform-char-bar-' + d.kind).style('opacity', '0.05');
                self._tooltipService.show(d.versionLabel, d.y.toString(), self._colors[d.colour], <MouseEvent>event);
            });
    }

    private _populatePlatformChartBar() {
        var self = this;

        this._svg.selectAll('rect')
            .data(this._stackedData)
            .enter()
            .append('rect')
            .attr('class', (d) => 'platform-char-bar-' + d.kind)
            .style('fill', 'black')
            .attr('x', (d) => this._xScale(d.kind) - (this._xScale.rangeBand() / 2 ) - 5)
            .attr('y', '0')
            .attr('width', this._xScale.rangeBand() * 2 + 10) // bar width
            .attr('height', this._height - this._tickPositionOffset)
            .attr('transform', 'translate(0, ' + this._tickPositionOffset + ')')
            .attr('opacity', '0.0')
            .on('mouseout', function () {
                d3.select(this).style('opacity', '0');
                self._tooltipService.hide();
            })
            .on('mousemove', function (d: StackedChartData) {
                // apply opacity to the background chart area
                d3.select(this).style('display', 'inline-block');
                d3.select(this).style('opacity', '0.05');
                self._tooltipService.show(d.displayName, d.count.toString(), self._colors[d.colour], <MouseEvent>event);
            });

        // Background rect (the same size of whole stacked bar) which fill white blank line between boxes
        this._svg.selectAll('bg-rect')
            .attr('class', 'bg-rect')
            .data(this._stackedData)
            .enter()
            .append('rect')
            .style('fill', 'white')
            .attr('x', (d) => this._xScale(d.kind))
            .attr('y', (d) => this._yScale(d.count))
            .attr('width', this._xScale.rangeBand())
            .attr('height', (d) => this._height - this._yScale(d.count))
            .attr('opacity', '0.0');
    }

    private _animateColumnsToValue(selection, element): void {
        setTimeout(() => {
            selection.transition()
                .duration(element._animationDuration)
                .delay((d: Stack, i: number) => i * element._delayBetweenBarAnimation)
                .attr('y', (d: Stack) => element._yScale(d.y + d.y0))
                .attr('height', (d: Stack) => {
                    var barHeight = element._yScale(d.y0) - element._yScale(d.y + d.y0);
                    return (barHeight < 1) ? barHeight : barHeight - 1;
                });
        }, this._animationDelay);
    }

    private _depopulateStackedBar(): void {
        this._svg.select('g.y-label').transition().duration(this._disappearAnimationDuration).attr('opacity', '0');
        this._svg.select('g.y-gridlines').transition().duration(this._disappearAnimationDuration).attr('opacity', '0');
        this._svg.select('g.x-axis').transition().duration(this._disappearAnimationDuration).attr('opacity', '0');
        this._stackedBar.selectAll('rect').call(this._animateColumnsToEmpty, this);
    }

    private _animateColumnsToEmpty(selection, element): void {
        selection.transition()
            .duration(element._disappearAnimationDuration)
            .attr('height', 0)
            .attr('y', () => element._height);
    }
}