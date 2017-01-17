/**
 * Created by vdave on 1/12/2017.
 */

export interface BatteryNotFullyChargedBeforeShiftParam {
    shiftStartDateTime: Date;
    endDate: Date;
    shiftDuration: number;
    minimumBatteryPercentageThreshold: number;
}
