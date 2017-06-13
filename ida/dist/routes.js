"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const tsoa_1 = require("tsoa");
const tsoa_2 = require("tsoa");
const getAuthorizationToken_1 = require("./controllers/getAuthorizationToken");
const finalUploadEndpoint_1 = require("./controllers/finalUploadEndpoint");
const models = {
    "RsaOtherPrimesInfo": {
        properties: {
            "r": { "required": true, "typeName": "string" },
            "d": { "required": true, "typeName": "string" },
            "t": { "required": true, "typeName": "string" },
        },
    },
    "JsonWebKey": {
        properties: {
            "kty": { "required": true, "typeName": "string" },
            "use": { "required": false, "typeName": "string" },
            "key_ops": { "required": false, "typeName": "array", "array": { "typeName": "string" } },
            "alg": { "required": false, "typeName": "string" },
            "kid": { "required": false, "typeName": "string" },
            "x5u": { "required": false, "typeName": "string" },
            "x5c": { "required": false, "typeName": "string" },
            "x5t": { "required": false, "typeName": "string" },
            "ext": { "required": false, "typeName": "boolean" },
            "crv": { "required": false, "typeName": "string" },
            "x": { "required": false, "typeName": "string" },
            "y": { "required": false, "typeName": "string" },
            "d": { "required": false, "typeName": "string" },
            "n": { "required": false, "typeName": "string" },
            "e": { "required": false, "typeName": "string" },
            "p": { "required": false, "typeName": "string" },
            "q": { "required": false, "typeName": "string" },
            "dp": { "required": false, "typeName": "string" },
            "dq": { "required": false, "typeName": "string" },
            "qi": { "required": false, "typeName": "string" },
            "oth": { "required": false, "typeName": "array", "array": { "typeName": "RsaOtherPrimesInfo" } },
            "k": { "required": false, "typeName": "string" },
        },
    },
    "ErrorResponseModel2": {
        properties: {
            "errorCode": { "required": true, "typeName": "string" },
            "errorMessage": { "required": true, "typeName": "string" },
        },
    },
    "ResponseModel": {
        properties: {
            "errorCode": { "required": true, "typeName": "string" },
            "errorMessage": { "required": true, "typeName": "string" },
            "error": { "required": false, "typeName": "ErrorResponseModel2" },
        },
    },
    "ErrorResponseModel": {
        properties: {
            "status": { "required": true, "typeName": "double" },
            "message": { "required": true, "typeName": "string" },
        },
    },
};
function RegisterRoutes(app) {
    app.get('/Security/getAuthorizationToken', function (request, response, next) {
        const args = {
            express: { "in": "request", "name": "express", "required": true, "typeName": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new getAuthorizationToken_1.GetAuthorizationToken();
        const promise = controller.Get.apply(controller, validatedArgs);
        let statusCode = undefined;
        if (controller instanceof tsoa_2.Controller) {
            statusCode = controller.getStatus();
        }
        promiseHandler(promise, statusCode, response, next);
    });
    app.post('/data/', function (request, response, next) {
        const args = {
            express: { "in": "request", "name": "express", "required": true, "typeName": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = new finalUploadEndpoint_1.UploadDataSetController();
        const promise = controller.Create.apply(controller, validatedArgs);
        let statusCode = undefined;
        if (controller instanceof tsoa_2.Controller) {
            statusCode = controller.getStatus();
        }
        promiseHandler(promise, statusCode, response, next);
    });
    function promiseHandler(promise, statusCode, response, next) {
        return promise
            .then((data) => {
            if (data) {
                response.json(data);
                response.status(statusCode || 200);
            }
            else {
                response.status(statusCode || 204);
                response.end();
            }
        })
            .catch((error) => next(error));
    }
    function getValidatedArgs(args, request) {
        return Object.keys(args).map(key => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return tsoa_1.ValidateParam(args[key], request.query[name], models, name);
                case 'path':
                    return tsoa_1.ValidateParam(args[key], request.params[name], models, name);
                case 'header':
                    return tsoa_1.ValidateParam(args[key], request.header(name), models, name);
                case 'body':
                    return tsoa_1.ValidateParam(args[key], request.body, models, name);
                case 'body-prop':
                    return tsoa_1.ValidateParam(args[key], request.body[name], models, name);
            }
        });
    }
}
exports.RegisterRoutes = RegisterRoutes;
//# sourceMappingURL=routes.js.map