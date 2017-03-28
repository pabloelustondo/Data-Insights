/**
 * Created by pabloelustondo on 2017-02-12.
 */

import { DadTransformer } from "../transformer";
import { DadChart } from "../chart.component";
import  { CHARTS } from "../sample.charts";
import { Mapper, ChartData } from "../mapper";


describe('DadTransformer', () => {
    beforeEach(() => {
        let chartConfig:DadChart = CHARTS[1]; //this chart does not have any transformation spec
        chartConfig.transformation = null;
        chartConfig.transformations = null;
    });

    it('should get created', () => {
        let transformer = new DadTransformer();
        expect(transformer).toBeTruthy();
    });

    it('should return the same data if not trasnformation configuration provided', () => {
        let chart:DadChart = CHARTS[0]; //this chart does not have any transformation spec
        let chartData = [
            ['a', 0, 1, 2],
            ['b', 12, 20, 30]
        ];
        let transformer = new DadTransformer();
        var result = transformer.transform(chart, chartData);
        expect(result).toBeDefined();
        expect(result.length).toBe(chartData.length); //use better test
    });

    //Testing based on configuration
    it('if returns the top 1', () => {
        let mapper = new Mapper();
        let chartConfig:DadChart = CHARTS[1]; //this chart does not have any transformation spec
        /*
        * chartData is the mapped data without any transformation.
        * First array is the metric and second one is the dimension.
        */
        let chartData = mapper.map(chartConfig, chartConfig.data);

        // Specified the transformation
        chartConfig.transformation = {top: 1};
        //Created a new transformer
        let transformer = new DadTransformer();
        //Transformed data
        var result = transformer.transform(chartConfig, chartData);
        expect(result).toBeDefined();
        //Specific for bar chart
        expect(result.columns.length).toBe(2);
        expect(result.columns[0].length).toBe(2);
        expect(result.columns[1].length).toBe(2);

    });

    it('sorts', () => {
        let mapper = new Mapper();
        let chartConfig:DadChart = CHARTS[1]; //this chart does not have any transformation spec
        /*
         * chartData is the mapped data without any transformation.
         * First array is the metric and second one is the dimension.
         */
        let chartData = mapper.map(chartConfig, chartConfig.data);

        // Specified the transformation
        chartConfig.transformation = {sort: true};
        //Created a new transformer
        let transformer = new DadTransformer();
        //Transformed data
        var result = transformer.transform(chartConfig, chartData);
        expect(result).toBeDefined();
        //Specific for bar chart
        expect(result.columns.length).toBe(2);
        expect(result.columns[1][1]).toBe(60000);
        expect(result.columns[0][1]).toBe('soti');

    });

    it('various transformations', () => {
        let mapper = new Mapper();
        let chartConfig:DadChart = CHARTS[1]; //this chart does not have any transformation spec
        /*
         * chartData is the mapped data without any transformation.
         * First array is the metric and second one is the dimension.
         */
        let chartData = mapper.map(chartConfig, chartConfig.data);

        // Specified the transformation
        chartConfig.transformations = [{sort : true}, {top : 1}];
        //Created a new transformer
        let transformer = new DadTransformer();
        //Transformed data
        var result = transformer.transformAll(chartConfig, chartData);
        expect(result).toBeDefined();
        //Specific for bar chart
        expect(result.columns.length).toBe(2);
        expect(result.columns[0].length).toBe(2);
        expect(result.columns[1].length).toBe(2);
        expect(result.columns[1][1]).toBe(60000);
        expect(result.columns[0][1]).toBe('soti');

    });



});