/**
 * Created by dister on 12/14/2016.
 */
import { DadWidget } from './widget.component';

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Number of Devices that Did Not Last the Shift',
    endpoint:'DevicesNotSurvivedShift',
    a : 'CountDevicesNotLastedShift',
    b : 'TotalActiveDevices',
    parameters: [
      {
        shiftDuration:8,
        shiftStartDateTime: "2016-08-25"
      }]}
];
