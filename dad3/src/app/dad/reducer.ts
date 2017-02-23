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
    reduce(config: DadChart|DadWidget, data) {
        if (!config.reduction) return data;

        let newData: any[] = [];
        let map: any = {}; //this temporary variable will store the map before the reduce

        if (config.reduction) {

            config.a = 'metric';
            config.b = 'dimension';

            config['aname'] = config.reduction.metric.name;
            config['bname'] = config.reduction.dimension.name;

            // chartConfig.reduction = {
              //  dimension: {attribute: 'os', name:'percentage'},
              //  metric: {op:'count', name:'countOfDevices'}};

            //map
            for(let i=0; i<data.length; i++ ){
                let dimensionPoint = data[i][config.reduction.dimension.attribute];    //need to handle error if this value is null

                if (dimensionPoint) {
                    if ( ! map[dimensionPoint] )  //so we need to create on
                    {map[dimensionPoint] = [];};
                    map[dimensionPoint].push(data[i]);
                }
            }

            //reduce
            //Reduces collection to a value which is the accumulated result of running each element in collection thru iteratee, where each successive invocation is supplied the return value of the previous. If accumulator is not given, the first element of collection is used as the initial value. The iteratee is invoked with four arguments:
            //    (accumulator, value, index|key, collection).

            for( let key in map) {
                let collection = map[key];
                let initialValue = 0; // need to generalize this count and sum is fine...but.
                let result = initialValue;
                let count = 0;
                collection.forEach(function(v){
                    if (config.reduction.metric.op == "count"){
                        result = result + 1;
                        count++;
                    }
                    if (config.reduction.metric.op == "sum" || config.reduction.metric.op == "avg"){
                        result = result + v[config.reduction.metric.attribute];
                        count++;
                    }
                });

                if (config.reduction.metric.op == "avg"){
                    result = result / count;
                }

                let newElement = {};
                newElement[config.a] = result;
                newElement[config.b] = key;
                newData.push(newElement);
            }

        }

        return newData;
    }

}



