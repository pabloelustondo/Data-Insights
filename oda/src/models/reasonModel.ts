import {BatteryNotFullyChargedBeforeShiftParam} from './kpi/batteryNotFullyChargedBeforeShift';



export interface CalculatePredicates {
    metricName: Metrics;
    predicates: Predicates[];
    parameters: BatteryNotFullyChargedBeforeShiftParam ;
}

type Metrics = 'DevicesDidNotLastShift'| 'TotalActiveDevices' | 'DevicesConstantlyCharging';
type Predicates = 'batteryNotFullyChargedBeforeShift'
    | 'batteryAgeGreaterThanNYears'
    | 'deviceRechargedMoreThanNTimes';

/**
 * Created by vdave on 1/9/2017.
 */
