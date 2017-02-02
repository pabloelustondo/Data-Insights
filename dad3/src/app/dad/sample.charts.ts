/**
 * Created by pablo elustondo on 2016-12-06.
 */
import { DadChart } from './chart.component';
import { DadParameter, DadParameterType, DadMetric, DadMetricType, DadDimension, DadDimensionType} from "./dadmodels"

export const CHARTS: DadChart[] = [
    {id: "chartbar",
        name: 'Average Battery Discharge Rate',
        type: "bar",
        endpoint: "AverageDischargeRate",
        a : 'countOfDevices',
        b : 'percentage',
        aname : 'Count Of Devices',
        bname : 'Percentage',
        width: 475,
        height: 400,
        regionM: 30,
        tableId: 'table2',
        parameters: [
            {
                dateTo: "2016-08-25T20:30:21",
                shiftStartDateTime: "2016-08-24T20:30:21",
                shiftDuration: 8
            }],
        uiparameters: [
            {
                Type: DadParameterType.Date,
                Name: "Date To",
                DataSource: "dateTo"
            },
            {
                Type: DadParameterType.DateTime,
                Name: "Shift Start Date & Time",
                DataSource: "shiftStartDateTime"
            },
            {
                Type: DadParameterType.Duration,
                Name: "Shift Duration",
                DataSource: "shiftDuration"
            },
            ],
    }

];

