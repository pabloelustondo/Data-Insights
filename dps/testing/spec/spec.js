describe("Data Analytics Service - CDL", function() {

    describe("GET /", function() {
        it("server runs at least ...", function(done) {
            $.get("/", function(data, textStatus, jqXHR) {
                expect(data).toBe("DPS");
                done();
            });
        });
    });

    describe("POST /data/outGoingRequest /", function() {
        it("should get vehicleInfo from CDL", function(done) {

            $.ajax(
                {   url:"/data/outGoingRequest",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            metadata : {
                               queryId : 'ttc'
                            }
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                      //  var inputFileName = data.response;
                      //  var testValue = 'https://s3.amazonaws.com/da-s3-bucket%2FDataExchange%2F' + 'dpsTestTenantId';
                      //  var testValuelength = testValue.length;
                        expect(textStatus).toBe('success');
                       // expect(inputFileName.substring(0,testValuelength)).toBe(testValue);
                        done();}
                });
        });
    });
/*

    describe("POST /data/request", function() {

        it("It places an item to S3. " +
            "This function will be used by IDA to insert records", function(done) {
            $.ajax(
                {   url:"/data/request",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            idaMetadata: {
                                referer : 'sampleData',
                                dataSourceId : 'dpsTestDataSourceId',
                                tenantId: 'dpsTestTenantId',
                                timeStamp: (new Date()).toISOString()
                            },
                            clientMetadata : { },
                            clientData: [  {created: "Nov 3 1964", field1: "value1"},
                                     {created: "Nov 4 1964", field1: "value2"}
                                ]
                            }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var inputFileName = data.response;
                        var testValue = 'https://s3.amazonaws.com/da-s3-bucket%2FDataExchange%2F' + 'dpsTestTenantId';
                        var testValuelength = testValue.length;

                        expect(data.status).toBe(200);
                        expect(inputFileName.substring(0,testValuelength)).toBe(testValue);
                        done();}
                });
        });

        it("It places an item to S3. " +
            "Second test with different type of data and different tenant", function(done) {
            $.ajax(
                {   url:"/data/request",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            idaMetadata: {
                                referer : 'sampleData',
                                dataSourceId : 'dpsTestDataSourceId2',
                                tenantId: 'dpsTestTenantId2',
                                timeStamp: (new Date()).toISOString()
                            },
                            clientMetadata : { },
                            clientData:  {
                                created: "Nov 3 1964",
                                field1: "value1",
                                nestedData: {
                                    created: "Nov 4 1964",
                                    field1: "value2"
                                }}
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var inputFileName = data.response;
                        var testValue = 'https://s3.amazonaws.com/da-s3-bucket%2FDataExchange%2F' + 'dpsTestTenantId2';
                        var testValuelength = testValue.length;

                        expect(data.status).toBe(200);
                        expect(inputFileName.substring(0,testValuelength)).toBe(testValue);
                        done();}
                });
        });
        it("Makes a call to api without IDA metadata " +
            "it should get a 400 status and fail", function(done) {
            $.ajax(
                {   url:"/data/request",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            clientMetadata: {},
                            clientData:  {
                                created: "Nov 3 1964",
                                fieldOne: "value1",
                                nestedData: {
                                    created: "Nov 4 1964",
                                    field1: "value2"
                                }
                            }
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var response = data.response;
                        var testValue = 'Missing idaMetadata field';

                        expect(data).toBe(undefined);
                        expect(response).toBe(undefined);
                        done();
                    },
                    error: function(request, textStatus, errorThrown) {
                        expect(errorThrown).toBe('Bad Request');
                        done();
                    }
                });
        });


        it("Makes a call to api without Client metadata " +
            "it should get a 400 status and fail", function(done) {
            $.ajax(
                {   url:"/data/request",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(

                        {
                            idaMetadata: {
                                referer : 'sampleData',
                                dataSourceId : '12345678901234567890',
                                tenantId: 'varun_test',
                                timeStamp: (new Date()).toISOString()
                            },
                            clientData:  {
                                created: "Nov 3 1964",
                                fieldOne: "value1",
                                nestedData: {
                                    created: "Nov 4 1964",
                                    field1: "value2"
                                }
                            }
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var response = data.response;
                        var testValue = 'Missing clientMetadata field';

                        expect(data).toBe(undefined);
                        expect(response).toBe(undefined);
                        done();
                    },
                    error: function(request, textStatus, errorThrown) {
                        expect(errorThrown).toBe('Bad Request');
                        done();
                    }
                });
        });

        it("testing if a user is able to find the tenant " +
            "should work", function(done) {
            $.ajax(
                {   url:"/data/request",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            idaMetadata: {
                                referer : 'sampleData',
                                dataSourceId : 'uniqueId12345',
                                tenantId: 'varun_test',
                                timeStamp: (new Date()).toISOString()
                            },
                            clientMetadata : { },
                            clientData:  {
                                created: "Nov 3 1964",
                                field1: "value1",
                                field2: "value2",
                                nestedData: {
                                    created: "Nov 5 1964",
                                    field1: "valuen"
                                }
                            }
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var response = data.response;
                        var expectedValue = '';
                        expect(textStatus).toBe('success');
                        done();
                    },
                    error: function(request, textStatus, errorThrown) {
                        expect(errorThrown).toBe('Bad Request');
                        done();
                    }
                });
        });

    });
*/

});
