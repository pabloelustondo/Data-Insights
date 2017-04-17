import {Parameter} from './parameterModel';
import {Predicates} from './predicates';
import {Metrics} from './metrics';
import {BatteryNotFullyChargedBeforeShiftParam} from './kpi/batteryNotFullyChargedBeforeShift';
import {SampleAPI} from './kpi/PlaceHolderKPI';


export interface CalculatePredicates {
    metricName: Metrics;
    predicates: Predicates[];
    parameters: BatteryNotFullyChargedBeforeShiftParam ;
}

/**
 * Created by vdave on 1/9/2017.
 */
