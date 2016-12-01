/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { DadChart } from './chart.component';

export const CHARTS: DadChart[] = [
    {   id: "chart7",
        name: 'Number of Devices by Range Pie Chart 7',
        type: "bar2",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    },
    {   id: "chart8",
        name: 'Number of Devices by Range Pie Chart 8',
        type: "pie2",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    }
];
