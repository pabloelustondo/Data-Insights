/**
 * Created by pabloelustondo on 2017-02-12.
 */

import { DadReducer } from "../reducer";
import { DadChart } from "../chart.component";
import  { CHARTS } from "../sample.charts";
import { Mapper, ChartData } from "../mapper";


describe('DadReducer', () => {
    beforeEach(() => {
        //we create a chartConfig and clean the reduction setting so individual specs can set it
        let chartConfig:DadChart = CHARTS[1]; //this chart does not have any transformation spec
        chartConfig.reduction = null
    });

    it('should get created', () => {
        let reducer = new DadReducer();
        expect(reducer).toBeTruthy();
    });

    it('should return the same data if not reduction configuration provided', () => {
        let chart:DadChart = CHARTS[0]; //this chart does not have any transformation spec
        let chartData = [
            ['a', 0, 1, 2],
            ['b', 12, 20, 30]
        ];
        let reducer = new DadReducer();
        var result = reducer.reduce(chart, chartData);
        expect(result).toBeDefined();
        expect(result.length).toBe(chartData.length); //use better test
    });

    //Testing based on configuration
    it('returns an list of <dimension, value> according to spec', () => {
        let mapper = new Mapper();
        let chartConfig:DadChart = CHARTS[3]; //chartbardrill
        //this chart has data of the form
        //{DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple' },
        //and reducer and columns:
        //    reduction: {test:true}
        //    a : 'countOfDevices'
        //    b : 'percentage'

        let reducer = new DadReducer();


        chartConfig.reduction = {
            dimension: {attribute: 'os', name:'percentage'},
            metric: {attribute:'DevId', op:'count', name:'countOfDevices'}};

        var result = reducer.reduce(chartConfig, chartConfig.data);

        expect(result.length).toBe(3);   //iOS, Android, Windows
        expect(result[0].dimension).toBe('iOS');   //iOS, Android, Windows
        expect(result[0].metric).toBe(2);   //iOS, Android, Windows

    });

    it('modifies the configuration a and b with values from reducer  ', () => {
        let mapper = new Mapper();
        let chartConfig:DadChart = CHARTS[3]; //chartbardrill
        //this chart has data of the form
        //{DevId:'vzfsvzfsvzfsvz', LastBatteryStatus:10, BatteryChargeHistory:JSON.stringify([5,6,5,7,8,9]),os:'iOS', brand:'Apple' },
        //and reducer and columns:
        //    reduction: {test:true}
        //    a : 'countOfDevices'
        //    b : 'percentage'

        let reducer = new DadReducer();


        chartConfig.reduction = {
            dimension: {attribute: 'os', name:'dimension'},
            metric: {attribute:'DevId', op:'count', name:'metric'}};

        var result = reducer.reduce(chartConfig, chartConfig.data);

        expect(result.length).toBe(3);   //iOS, Android, Windows
        expect(result[0].dimension).toBe('iOS');   //iOS, Android, Windows
        expect(result[0].metric).toBe(2);   //iOS, Android, Windows
        expect(chartConfig.a).toBe('metric');
        expect(chartConfig.b).toBe('dimension');

    });



});