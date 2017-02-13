/**
 * Created by pabloelustondo on 2017-02-12.
 */

import { DadTransformer } from "../transformer";
import { DadChart } from "../chart.component";
import  { CHARTS } from "../sample.charts"


describe('DadTransformer', () => {
    beforeEach(() => {


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

});