/**
 * Created by dister on 12/14/2016.
 */
import { DadWidget } from './widget.component';

export const WIDGETS: DadWidget[] = [
  {id: 'widget1',
    name:'Not Lasted Shift',
    endpoint:'DevicesNotSurvivedShift',
    a : 'CountDevicesNotLastedShift',
    b : 'TotalActiveDevices',
    parameters: [
      {
        startTime: "9",
        duration: "30",
        date: "2016-08-25"
      }]}
];
