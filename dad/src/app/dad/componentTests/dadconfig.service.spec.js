"use strict";
var DadConfig_service_1 = require('../DadConfig.service');
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/http/testing');
var http_1 = require('@angular/http');
describe('DadConfigComponent', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                DadConfig_service_1.DadConfigService,
                testing_2.MockBackend,
                { provide: http_1.XHRBackend, useClass: testing_2.MockBackend }
            ]
        });
    });
    it('should create the service', testing_1.inject([DadConfig_service_1.DadConfigService, testing_2.MockBackend], function (dadConfig, mockBackend) {
        var mockResponse = {
            data: [
                { tellMe: 'Service is created' },
            ]
        };
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({
                body: JSON.stringify(mockResponse)
            })));
        });
        dadConfig.getConfig("Doga").then(function (config) {
            expect(config).toBe(null);
        });
    }));
});
