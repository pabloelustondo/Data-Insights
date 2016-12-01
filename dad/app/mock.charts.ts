/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { DadChart } from './chart.component';

export const CHARTS: DadChart[] = [
    {   id: "chartbar",
        name: 'Bar Chart',
        type: "bar",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    },
    {   id: "chartpie",
        name: 'Pie Chart',
        type: "pie",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    },
    {   id: "chartdot",
        name: 'Dot Chart',
        type: "dot",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    },
    {   id: "chartspline",
        name: 'Spline Chart',
        type: "spline",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    }
];
