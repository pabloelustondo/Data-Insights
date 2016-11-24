/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { DadChart } from './chart.component';

export const CHARTS: DadChart[] = [
    {   id: "chart1", name: 'Number of Devices by Range Pie Chart 1',
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-16",
                dateTo: "2016-08-18"
            }]
    },
    { id: "chart2", name: 'Number of Devices by Range Pie Chart 2',
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-19",
                dateTo: "2016-08-22"
            }]
    },
    { id: "chart3", name: 'Number of Devices by Range Pie Chart 3',
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    }
];
