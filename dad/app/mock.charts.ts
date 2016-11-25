/**
 * Created by pabloelustondo on 2016-11-21.
 */
import { DadChart } from './chart.component';

export const CHARTS: DadChart[] = [
    {   id: "chart1",
        name: 'Number of Devices by Range Pie Chart 1',
        type: "pie",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-16",
                dateTo: "2016-08-18"
            }]
    },
    {   id: "chart2",
        name: 'Number of Devices by Range Pie Chart 2',
        type: "pie",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-19",
                dateTo: "2016-08-22"
            }]
    },
    {   id: "chart3",
        name: 'Number of Devices by Range Pie Chart 3',
        type: "pie",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    },
    {   id: "chart4",
        name: 'Number of Devices by Range Pie Chart 4',
        type: "bar",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-16",
                dateTo: "2016-08-18"
            }]
    },
    {   id: "chart5",
        name: 'Number of Devices by Range Pie Chart 5',
        type: "bar",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-19",
                dateTo: "2016-08-22"
            }]
    },
    {   id: "chart6",
        name: 'Number of Devices by Range Pie Chart 6',
        type: "bar",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    },
    {   id: "chart7",
        name: 'Number of Devices by Range Pie Chart 7',
        type: "bar",
        parameters: [
            {   parameterType:"DateRange",
                dateFrom: "2016-08-23",
                dateTo: "2016-08-25"
            }]
    }
];
