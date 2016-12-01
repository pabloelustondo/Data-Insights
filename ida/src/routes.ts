
/**
 * THIS IS GENERATED CODE - DO NOT EDIT
 */
/* tslint:disable */
import { ValidateParam } from 'tsoa';
import { SDSController } from './controllers/usersController';

const models: any = {
    'SDS': {
        'metadata': { typeName: 'string', required: true },
        'createdAt': { typeName: 'datetime', required: true },
        'data': { typeName: 'array', required: false, arrayType: 'string' },
    },
};

export function RegisterRoutes(app: any) {
    app.post('/Data', function(req: any, res: any, next: any) {
        const params = {
            'request': { typeName: 'SDS', required: true },
            'optionalString': { typeName: 'string', required: false },
        };

        let validatedParams: any[] = [];
        try {
            validatedParams = getValidatedParams(params, req, 'request');
        } catch (err) {
            return next(err);
        }

        const controller = new SDSController();
        promiseHandler(controller.Create.apply(controller, validatedParams), res, next);
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
