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

export class DadTransformer {
    transform(config: DadChart|DadWidget, dataForChart) {
        if (!config.reduction) return dataForChart;

        /*current data shape
         dataForChart = {
         x: config.b,
         columns: [chartData.Dimension, chartData.Metric],
         type:  config.type
         } */

        let newDataForChart: any = {};

        if (config.transformation.top) {

            newDataForChart.x = dataForChart.x;
            newDataForChart.type = dataForChart.type;

            let metric = dataForChart.columns[0].slice(0, config.transformation.top+1);
            let dimension = dataForChart.columns[1].slice(0, config.transformation.top+1);
            newDataForChart.columns = [metric, dimension];
        }

        if (config.transformation.sort) {

            newDataForChart.x = dataForChart.x;
            newDataForChart.type = dataForChart.type;
            newDataForChart.columns = [[dataForChart.columns[0][0]], [dataForChart.columns[1][0]]];

            let oneColumn = [];  //let put both columns in same place
            for (var i = 1; i < dataForChart.columns[0].length; i++) {
                oneColumn.push({metric: dataForChart.columns[0][i], dimension: dataForChart.columns[1][i]});
            }
            let sortedOneColumn = _.orderBy(oneColumn, ['dimension'], ['desc']);

            for (var i = 1; i < sortedOneColumn.length + 1; i++) {
                newDataForChart.columns[0].push(sortedOneColumn[i - 1].metric);
                newDataForChart.columns[1].push(sortedOneColumn[i - 1].dimension);
            }
        }
        return newDataForChart;
    }

    transformAll(config:DadChart|DadWidget, dataForChart) {
        if (!config.transformations) return dataForChart;

        for(let transformation of config.transformations){
            config.transformation = transformation;
            dataForChart = this.transform(config, dataForChart);
        }

        return dataForChart;

    }



}



