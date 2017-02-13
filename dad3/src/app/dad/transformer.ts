/**
 * Created by dister on 2/10/2017.
 */
//For sorting in typescript we can easily use .sort()

/**
 * Created by doga ister on 12/7/2016.
 */
import {DadChart} from "./chart.component";
import {DadWidget} from "./widget.component";

export class ChartData{
    Dimension = [];
    Metric = [];
}

export class DadTransformer{
    transform(config:DadChart|DadWidget, dataForChart){
        return dataForChart;
    }
}
