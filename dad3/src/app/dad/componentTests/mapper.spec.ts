/**
 * Created by pabloelustondo on 2017-02-12.
 */

import { DadReducer } from "../reducer";
import { DadChart } from "../chart.component";
import  { CHARTS } from "../sample.charts";
import { Mapper } from "../mapper";


describe('Mapper', () => {
    beforeEach(() => {
        //we create a chartConfig and clean the reduction setting so individual specs can set it
        let chartConfig:DadChart = CHARTS[1]; //this chart does not have any transformation spec
    });

    it('should get created', () => {
        let mapper = new Mapper();
        expect(mapper).toBeTruthy();
    });

    it('should show the mapper maps correctly for bar charts', () => {
        let chart:DadChart = CHARTS[3]; //this chart does not have any transformation spec
        let mapper = new Mapper();
        let result = mapper.map(chart, chart.data);
        expect(result).toBeDefined();
        expect(result.columns.length).toBe(2); //use better test
        //dimension
        expect(result.columns[0].length).toBe(4);
        expect(result.columns[0][0]).toBe('dimension');
        expect(result.columns[0][1]).toBe('iOS');
        expect(result.columns[0][2]).toBe('Android');
        expect(result.columns[0][3]).toBe('Windows');
        //metric
        expect(result.columns[1].length).toBe(4);
        expect(result.columns[1][0]).toBe('metric');
        expect(result.columns[1][1]).toBe(2);
        expect(result.columns[1][2]).toBe(8);
        expect(result.columns[1][3]).toBe(1);
    });

    it('should show the mapper maps correctly for pie charts', () => {
        let chart:DadChart = CHARTS[4]; //this chart does not have any transformation spec
        let mapper = new Mapper();
        let reducer = new DadReducer();
        let result = mapper.map(chart, chart.data);

        let reducedData = reducer.reduce(chart, chart.data);

        expect(result).toBeDefined();
        expect(result.columns.length).toBe(reducedData.length); //use better test
    });
});