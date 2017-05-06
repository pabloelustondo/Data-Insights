/**
 * Created by vdave on 12/21/2016.
 */
import {SDSBattery} from './batteryData';

export interface ListBatteryStats {
    stats: SDSInternalBattery[];
}

export interface SDSInternalBattery {
    dev_id: string;
    server_time_stamp:  Date;
    int_value: number;
    stat_type: number;
    time_stamp: Date;

}
