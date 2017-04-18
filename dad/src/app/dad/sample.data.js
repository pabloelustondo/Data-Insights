"use strict";
exports.MOCK_WIDGET_DATA = [
    {
        request: {
            id: 'widget1',
            name: 'Device battery during shift',
            type: 0,
            endpoint: 'DevicesNotSurvivedShift',
            parameters: [
                {
                    shiftStartDateTime: "2016-08-25T09:00:00",
                    shiftDuration: "12.5",
                    minimumBatteryPercentageThreshold: 20
                }
            ]
        },
        response: [{
                'CountDevicesLastedShift': '106',
                'CountDevicesNotLastedShift': '33',
                'CountDevicesChargingEntireShift': '76',
                'CountTotalActiveDevices': '215'
            }]
    }
];
