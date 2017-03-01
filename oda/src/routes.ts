/* tslint:disable */
import { ValidateParam } from 'tsoa';
import { SDSController } from './controllers/intialChargeLevelController';
import { DischargeRateController } from './controllers/dischargeRateController';
import { CountDevicesNotSurvivedShiftController } from './controllers/devicesDidNotSurviveShift';
import { MultiplePostsController } from './controllers/retrieveReasonData';
import { AverageDischargeRateController } from './controllers/averageDischargeRateController';
import { ListDevicesNotSurvivedShiftController } from './controllers/Lists/listOfDevicesDidNotSurviveShift';
import { DeviceInformation } from './controllers/Lists/deviceList';
import { ListDevicesNotFullyChargedAndNotSurvivedShiftController } from './controllers/Lists/listOfDevicesNotFullyChargedAndDidNotSurviveShift';
import { ListOfDevicesWithHighAverageDischargeRatePerShift } from './controllers/Lists/listOfDevicesWithHighAverageDischargeRatePerShift';
import { ApplicationExecutionTime } from './controllers/applicationExecutionTime';
import { NumberOfApplicationInstalls } from './controllers/numberOfApplicationInstalls';

const models: any = {
    'SDS': {
        'metadata': { typeName: 'array', required: true, arrayType: 'string' },
        'createdAt': { typeName: 'datetime', required: true },
        'data': { typeName: 'array', required: false, arrayType: 'string' },
    },
    'Metrics': {
    },
    'Predicates': {
    },
    'BatteryNotFullyChargedBeforeShiftParam': {
        'shiftStartDateTime': { typeName: 'datetime', required: true },
        'endDate': { typeName: 'datetime', required: true },
        'shiftDuration': { typeName: 'number', required: true },
        'minimumBatteryPercentageThreshold': { typeName: 'number', required: true },
    },
    'CalculatePredicates': {
        'metricName': { typeName: 'Metrics', required: true },
        'predicates': { typeName: 'array', required: true, arrayType: 'Predicates' },
        'parameters': { typeName: 'BatteryNotFullyChargedBeforeShiftParam', required: true },
    },
    'DeviceModel': {
        'deviceId': { typeName: 'string', required: true },
        'deviceProperties': { typeName: 'array', required: true, arrayType: 'string' },
    },
};

/* tslint:disable:forin */
export function RegisterRoutes(app: any) {
    app.get('/Devices/Battery/Summary/InitialChargeLevels', function(req: any, res: any, next: any) {
        const params = {
            'dateFrom': { typeName: 'string', required: true },
            'dateTo': { typeName: 'string', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new SDSController();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Battery/Summary/DischargeRate', function(req: any, res: any, next: any) {
        const params = {
            'dateFrom': { typeName: 'string', required: true },
            'dateTo': { typeName: 'string', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new DischargeRateController();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Battery/Summary/countOfDevicesDidNotSurviveShift', function(req: any, res: any, next: any) {
        const params = {
            'shiftDuration': { typeName: 'number', required: true },
            'shiftStartDateTime': { typeName: 'datetime', required: true },
            'minimumBatteryPercentageThreshold': { typeName: 'number', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new CountDevicesNotSurvivedShiftController();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.post('/Devices/Battery/getMetrics', function(req: any, res: any, next: any) {
        const params = {
            'request': { typeName: 'CalculatePredicates', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, 'request');
        } catch (err) {
            return next(err);
        }

        const controller = new MultiplePostsController();
        promiseHandler(controller.Create.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Battery/Summary/AverageDischargeRate', function(req: any, res: any, next: any) {
        const params = {
            'dateTo': { typeName: 'datetime', required: true },
            'shiftStartDateTime': { typeName: 'datetime', required: true },
            'shiftDuration': { typeName: 'number', required: true },
            'request': { typeName: 'object', required: true, injected: 'request' },
            'minimumBatteryPercentageThreshold': { typeName: 'number', required: false },
            'dateFrom': { typeName: 'datetime', required: false },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new AverageDischargeRateController();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Battery/List/DevicesDidNotSurviveShift', function(req: any, res: any, next: any) {
        const params = {
            'shiftDuration': { typeName: 'number', required: true },
            'rowsSkip': { typeName: 'number', required: true },
            'rowsTake': { typeName: 'number', required: true },
            'shiftStartDateTime': { typeName: 'datetime', required: true },
            'minimumBatteryPercentageThreshold': { typeName: 'number', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new ListDevicesNotSurvivedShiftController();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.post('/Devices/getDeviceInformation', function(req: any, res: any, next: any) {
        const params = {
            'request': { typeName: 'DeviceModel', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, 'request');
        } catch (err) {
            return next(err);
        }

        const controller = new DeviceInformation();
        promiseHandler(controller.Create.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Battery/List/DidNotSurviveShift/DevicesNotFullyCharged', function(req: any, res: any, next: any) {
        const params = {
            'shiftDuration': { typeName: 'number', required: true },
            'rowsSkip': { typeName: 'number', required: true },
            'rowsTake': { typeName: 'number', required: true },
            'shiftStartDateTime': { typeName: 'datetime', required: true },
            'minimumBatteryPercentageThreshold': { typeName: 'number', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new ListDevicesNotFullyChargedAndNotSurvivedShiftController();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Battery/List/DidNotSurviveShift/HighAverageDischargeRatePerShift', function(req: any, res: any, next: any) {
        const params = {
            'shiftDuration': { typeName: 'number', required: true },
            'rowsSkip': { typeName: 'number', required: true },
            'rowsTake': { typeName: 'number', required: true },
            'shiftStartDateTime': { typeName: 'datetime', required: true },
            'endDate': { typeName: 'datetime', required: true },
            'minimumThresholdDischargeRate': { typeName: 'number', required: true },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new ListOfDevicesWithHighAverageDischargeRatePerShift();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Application/executionTime', function(req: any, res: any, next: any) {
        const params = {
            'dateFrom': { typeName: 'datetime', required: true },
            'dateTo': { typeName: 'datetime', required: true },
            'request': { typeName: 'object', required: true, injected: 'request' },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new ApplicationExecutionTime();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });
    app.get('/Devices/Application/numberOfInstallations', function(req: any, res: any, next: any) {
        const params = {
            'request': { typeName: 'object', required: true, injected: 'request' },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, '');
        } catch (err) {
            return next(err);
        }

        const controller = new NumberOfApplicationInstalls();
        promiseHandler(controller.Get.apply(controller, validatedParams), res, next);
    });

    function promiseHandler(promise: any, response: any, next: any) {
        return promise
            .then((data: any) => {
                if (data) {
                    response.json(data);
                } else {
                    response.status(204);
                    response.end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getRequestParams(request: any, bodyParamName?: string) {
        const merged: any = {};
        if (bodyParamName) {
            merged[bodyParamName] = request.body;
        }

        for (let attrname in request.params) { merged[attrname] = request.params[attrname]; }
        for (let attrname in request.query) { merged[attrname] = request.query[attrname]; }
        return merged;
    }

    function getValidatedParams(params: any, request: any, bodyParamName?: string): any[] {
        const requestParams = getRequestParams(request, bodyParamName);

        return Object.keys(params).map(key => {
            if (params[key].injected === 'inject') {
                return undefined;
            } else if (params[key].injected === 'request') {
                return request;
            } else {
                return ValidateParam(params[key], requestParams[key], models, key);
            }
        });
    }
}