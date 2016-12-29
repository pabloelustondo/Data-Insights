/**
 * Created by 6pablo elustondo cd 201
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
        shiftStartDateTime:"2016-08-25T09:00",
        shiftDuration: "12.5"
      }]}
];
