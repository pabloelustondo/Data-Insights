import {Parameter} from './parameterModel';
import {Predicates} from './Predicates';
import {Metrics} from './metrics';


export interface ReasonModel {

    metricName: Metrics;
    predicates: Predicates[];
    parameters: Parameter[];
}

/**
 * Created by vdave on 1/9/2017.
 */
