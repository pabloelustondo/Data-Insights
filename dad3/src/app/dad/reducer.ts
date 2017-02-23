/**
 * Created by dister on 2/10/2017.
 */
//For sorting in typescript we can easily use .sort()

import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";
import * as _ from "lodash";

export class ChartData{
    Dimension = [];
    Metric = [];
}

export class DadReducer {
    reduce(config: DadChart|DadWidget, dataForChart) {
        if (!config.reduction) return dataForChart;

        let newDataForChart: any = {};

        if (config.reduction.test) {

            newDataForChart= [
                {countOfDevices:10, percentage:50},
                {countOfDevices:9, percentage:60},
                {countOfDevices:8, percentage:70},
                {countOfDevices:7, percentage:80},
                {countOfDevices:6, percentage:90},
                {countOfDevices:5, percentage:40}
            ]
        }

        return newDataForChart;
    }

}



