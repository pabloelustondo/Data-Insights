import { DadWidget, DadWidgetType} from './widget.component';
/**
 * Created by pabloelustondo on 2016-11-21.
 */


export interface  I_MOCK_WIDGET_DATA  {
    request:DadWidget,
    response:any
}

export const MOCK_WIDGET_DATA: I_MOCK_WIDGET_DATA[] = [
    {
        request: {
            id: 'widget1',
            name:'Device battery during shift',
            type: 0,
            endpoint:'DevicesNotSurvivedShift',
            parameters: [
                    {
                        shiftStartDateTime:"2016-08-25T09:00:00",
                        shiftDuration: "12.5",
                        minimumBatteryPercentageThreshold: 20
                    }]
                },
        response: [{
            'CountDevicesLastedShift': '106',
            'CountDevicesNotLastedShift': '33',
            'CountDevicesChargingEntireShift': '76',
            'CountTotalActiveDevices': '215'
        }]
    }
    ];