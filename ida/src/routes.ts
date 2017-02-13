/* tslint:disable */
import { ValidateParam } from 'tsoa';
import { MultiplePostsController } from './controllers/multiplePosts';
import { GetAuthorizationToken } from './controllers/getAuthorizationToken';

const models: any={
'SDSBattery': {
'dev_id': { typeName: 'string',required: true },
'server_time_stamp': { typeName: 'datetime',required: true },
'int_value': { typeName: 'number',required: true },
'stat_type': { typeName: 'number',required: true },
'time_stamp': { typeName: 'datetime',required: true },
},
'ListBatteryStats': {
'stats': { typeName: 'array',required: true,arrayType: 'SDSBattery' },
},
'SDS': {
'metadata': { typeName: 'string',required: true },
'createdAt': { typeName: 'datetime',required: true },
'data': { typeName: 'array',required: false,arrayType: 'string' },
},
'RsaOtherPrimesInfo': {
'r': { typeName: 'string',required: true },
'd': { typeName: 'string',required: true },
't': { typeName: 'string',required: true },
},
'JsonWebKey': {
'kty': { typeName: 'string',required: true },
'use': { typeName: 'string',required: false },
'key_ops': { typeName: 'array',required: false,arrayType: 'string' },
'alg': { typeName: 'string',required: false },
'kid': { typeName: 'string',required: false },
'x5u': { typeName: 'string',required: false },
'x5c': { typeName: 'string',required: false },
'x5t': { typeName: 'string',required: false },
'ext': { typeName: 'boolean',required: false },
'crv': { typeName: 'string',required: false },
'x': { typeName: 'string',required: false },
'y': { typeName: 'string',required: false },
'd': { typeName: 'string',required: false },
'n': { typeName: 'string',required: false },
'e': { typeName: 'string',required: false },
'p': { typeName: 'string',required: false },
'q': { typeName: 'string',required: false },
'dp': { typeName: 'string',required: false },
'dq': { typeName: 'string',required: false },
'qi': { typeName: 'string',required: false },
'oth': { typeName: 'array',required: false,arrayType: 'RsaOtherPrimesInfo' },
'k': { typeName: 'string',required: false },
},
};

/* tslint:disable:forin */
export function RegisterRoutes(app: any) {
app.post('/Devices/MultipleStats/MultiplePosts',function(req: any,res: any,next: any) {
const params={
'request': { typeName: 'ListBatteryStats',required: true },
'express': { typeName: 'object',required: true,injected: 'request' },
};

let validatedParams: any[]=[];
try {
validatedParams=getValidatedParams(params,req,'request');
} catch(err) {
return next(err);
}

const controller=new MultiplePostsController();
promiseHandler(controller.Create.apply(controller,validatedParams),res,next);
});
app.get('/Security/getAuthorizationToken',function(req: any,res: any,next: any) {
const params={
'express': { typeName: 'object',required: true,injected: 'request' },
};

let validatedParams: any[]=[];
try {
validatedParams=getValidatedParams(params,req,'');
} catch(err) {
return next(err);
}

const controller=new GetAuthorizationToken();
promiseHandler(controller.Get.apply(controller,validatedParams),res,next);
});

function promiseHandler(promise: any,response: any,next: any) {
return promise
.then((data: any) => {
if(data) {
response.json(data);
} else {
response.status(204);
response.end();
}
})
.catch((error: any) => next(error));
}

function getRequestParams(request: any,bodyParamName?: string) {
const merged: any={};
if(bodyParamName) {
merged[bodyParamName]=request.body;
}

for(let attrname in request.params) { merged[attrname]=request.params[attrname]; }
for(let attrname in request.query) { merged[attrname]=request.query[attrname]; }
return merged;
}

function getValidatedParams(params: any,request: any,bodyParamName?: string): any[] {
const requestParams=getRequestParams(request,bodyParamName);

return Object.keys(params).map(key => {
if(params[key].injected==='inject') {
return undefined;
} else if(params[key].injected==='request') {
return request;
} else {
return ValidateParam(params[key],requestParams[key],models,key);
}
});
}
}