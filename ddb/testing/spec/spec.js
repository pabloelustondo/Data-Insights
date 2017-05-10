

describe("Data Analytics Service - DDB", function() {

    var testTenants = {
        "tenants": [
            {
                "tenantId": "varun_test",
                "tenantInformation" : {
                    "name" : "Joe",
                    "address" : "1 Sample street",
                    "phoneNumber" : "1-800-008-8001",
                    "email": "email@corp.net",
                    "clientId" : "0000000",
                    "clientSecret" : "1234567890",
                    "companyAddress" : "1 XYZ street, MajorCity, Ca",
                    "companyName" : "The Best Corp",
                    "companyPhone" : "1-800-123-4567",
                    "userIdentityProvider" : {
                        "name" : "MobiControl IDP",
                        "destination" : "http://localhost:7897"
                    }
                },
                "dataSources" : [
                    {
                        "dataSourceId" : "uniqueId12345",
                        "dataSourceType": "MCDP",
                        "dataSourceProperties" : [
                            {
                                "name" : "url",
                                "value" : "https://localhost:9000"
                            },
                            {
                                "name" : "description",
                                "value" : "this is a test mcdp data source."
                            }
                        ],
                        "metadata" : {
                            "dataSetId" : "varun_test_mc_no_projections",
                            "projections" : []
                        }
                    },
                    {
                        "dataSourceId" : "12345678901234567890",
                        "dataSourceType": "API",
                        "dataSourceProperties" : [
                            {
                                "name" : "url",
                                "value" : "https://localhost:9000"
                            },
                            {
                                "name" : "description",
                                "value" : "this is a test api data source."
                            }
                        ],
                        "metadata" : {
                            "dataSetId" : "varun_test_customdata_two_projections",
                            "projections" : ["created", "nestedData"]
                        }
                    }
                ],
                "streams" : [],
                "dataLakeInformation" : "http://localhost:8000/varun_test/data"
            },
            {
                "tenantId": "varun_test_2",
                "tenantInformation" : {
                    "name" : "Joe",
                    "address" : "1 Sample street",
                    "phoneNumber" : "1-800-008-8001",
                    "email": "email@corp.net",
                    "clientId" : "0000000",
                    "clientSecret" : "1234567890",
                    "companyAddress" : "1 XYZ street, MajorCity, Ca",
                    "companyName" : "The Best Corp",
                    "companyPhone" : "1-800-123-4567",
                    "userIdentityProvider" : {
                        "name" : "MobiControl IDP",
                        "destination" : "http://localhost:7897"
                    }
                },
                "dataSources" : [
                    {
                        "dataSourceId" : "uniqueId99912345",
                        "dataSourceType": "MCDP",
                        "dataSourceProperties" : [
                            {
                                "name" : "url",
                                "value" : "https://localhost:9000"
                            },
                            {
                                "name" : "description",
                                "value" : "this is a test mcdp data source."
                            }
                        ],
                        "metadata" : {
                            "dataSetId" : "varun_test_mc_one_projections",
                            "projections" : []
                        }
                    }
                ],
                "streams" : [],
                "dataLakeInformation" : "http://localhost:8000/varun_test_2/data"
            },
            {
                "tenantId": "varun_test_3",
                "tenantInformation" : {
                    "name" : "Joe",
                    "address" : "1 Sample street",
                    "phoneNumber" : "1-800-008-8001",
                    "email": "email@corp.net",
                    "clientId" : "0000000",
                    "clientSecret" : "1234567890",
                    "companyAddress" : "1 XYZ street, MajorCity, Ca",
                    "companyName" : "The Best Corp",
                    "companyPhone" : "1-800-123-4567",
                    "userIdentityProvider" : {
                        "name" : "MobiControl IDP",
                        "destination" : "http://localhost:7897"
                    }
                },
                "dataSources" : [
                    {
                        "dataSourceId" : "uniqueId12345456",
                        "dataSourceType": "API",
                        "dataSourceProperties" : [
                            {
                                "name" : "url",
                                "value" : "https://localhost:9000"
                            },
                            {
                                "name" : "description",
                                "value" : "this is a test api data source."
                            }
                        ],
                        "metadata" : {
                            "dataSetId" : "varun_test_mc_no_projections",
                            "projections" : ["vehicle"]
                        }
                    }
                ],
                "streams" : [],
                "dataLakeInformation" : "http://localhost:8000/varun_test_3/data"
            }
        ]
    };

    describe("GET /", function() {
        it("returns Welcome to DDB - The Central Database API for The Data Analytics Server", function(done) {
            $.get("/", function(data, textStatus, jqXHR) {
                expect(data).toBe("Welcome to DDB - The Central Database API for The Data Analytics Server");
                done();
            });
        });
    });

    describe("DEL /daduser/:userid", function() {
        it("deletes a possible daduser configuration for the user 'testtenant-testuser'", function(done) {
            $.ajax(
                {   url:"/daduser/testtenant-testuser",
                    type:"DELETE",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        done();}
                });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns empty daduser after deleting it before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data.length).toBe(0);
                done();
            });
        });
    });


    describe("POST /daduser/:userid", function() {
        it("inserts  a daduser configuration ", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{data:'something'}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns 1 daduser after posting it before with correct data", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data[0].userid).toBe("testtenant-testuser");
                expect(data[0].config.data).toBe("something");
                expect(data.length).toBe(1);
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("replace a daduser configuration same id different data", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{data:'somethingelse'}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns 1 daduser after posting a replace before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].userid).toBe("testtenant-testuser");
                expect(data[0].config.data).toBe("somethingelse");
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("replace a daduser configuration wromg id different data", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser2",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{data:'somethingelse'}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    failure("this call should fail with error message");
                    done();},
                error: function(data, textStatus, jqXHR) {
                    console.log("Error From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    expect(data.status).toBe(400);
                    expect(data.responseText).toBe("url userid different from body userid");
                    done();}
            });
        });
    });


    describe("GET /getAllTenants", function () {

       it ("gets all tenants with all metadata for every tenant. It expects the list in sample tenants", function (done) {
           $.ajax({
               url: "/getAllTenants",
               type:"GET",
               contentType:"application/json",
               success: function(data, textStatus, jqXHR) {
                   console.log("From get: " + JSON.stringify(data));
                   var inData = data.tenants;
                   var expected = testTenants.tenants;
                   expect(data.tenants.length).toBe(testTenants.tenants.length);

                   for (var i =0; i < data.tenants.length; i++) {
                       expect(data.tenants[i].dataLakeInformation).toBe(expected[i].dataLakeInformation);
                   }
                   done();},
               error: function(data, textStatus, jqXHR) {
                   console.log("Error From post: " + JSON.stringify(data,null,2));
                   expect(data).toBeDefined();
                   expect(data.status).toBe(400);
                   expect(data.responseText).toBe("url userid different from body userid");
                   done();}
           });
       });
    });

  /*
   describe("POST /daduser", function() {
   it("adds sample db users for DSS an", function(done) {
   $.ajax({
   url: "/daduser",
   type:"POST",
   data: "{\"tentantID\":\"WHOA\" ," +
   "\"sotiUserName\":\"hahahahah\", " +
   "\"password\":\"ItWontBeThisEasy\"}",
   contentType:"application/json",
   success: function(data, textStatus, jqXHR) {
   console.log("From post: " + JSON.stringify(data,null,2));
   temp = data.data.ops[0];
   temp.name = "A1-Mind2";
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   expect(data.data.ops.length).toBe(1);
   done();}
   });
   });
   });


   describe("GET /daduser", function() {
   it("returns a daduser list with one item, as  posted before", function(done) {
   $.get("/daduser", function(data, textStatus, jqXHR) {
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   expect(data.data.length).toBe(1);
   expect(data.data[0].name).toBe("A1-Mind");
   done();
   });
   });
   });

   describe("PUT /daduser", function() {
   it("creates a daduser collection for test user and adds a first item", function(done) {
   $.ajax({
   url: "/daduser",
   type:"PUT",
   data: JSON.stringify(temp),
   contentType:"application/json",
   success: function(data, textStatus, jqXHR) {
   console.log("From put: " + JSON.stringify(data,null,2));
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   expect(data.status).toBe('ok');
   done();}
   });
   });
   });

   describe("GET /daduser", function() {
   it("returns a daduser list with one item, as  posted before", function(done) {
   $.get("/daduser", function(data, textStatus, jqXHR) {
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   expect(data.data.length).toBe(1);
   expect(data.data[0].name).toBe("A1-Mind2");
   done();
   });
   });
   });

   describe("DEL /daduser", function() {
   it("drops a possible daduser db for user 'test'", function(done) {
   $.ajax(
   {   url:"/daduser",
   type:"DELETE",
   success:function(data, textStatus, jqXHR) {
   var emptyArray = [];
   expect(data).toBeDefined();
   done();}
   });
   });
   });

   describe("POST /daduser", function() {
   it("creates a first genie spec", function(done) {
   $.ajax({
   url: "/daduser",
   type:"POST",
   data: JSON.stringify(sampleconfig),
   contentType:"application/json",
   success: function(data, textStatus, jqXHR) {
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   done();}
   });
   });
   });

   describe("POST /daduser", function() {
   it("creates a first genie spec", function(done) {
   $.ajax({
   url: "/daduser",
   type:"POST",
   data: JSON.stringify(original),
   contentType:"application/json",
   success: function(data, textStatus, jqXHR) {
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   done();}
   });
   });
   });

   describe("POST /newIDP", function() {
   it("creates a new IDP record", function(done) {
   $.ajax({
   url: "/newIDP",
   type:"POST",
   data: JSON.stringify(sample_dss_config),
   contentType:"application/json",
   success: function(data, textStatus, jqXHR) {
   var emptyArray = [];
   expect(data).toBeDefined();
   expect(data.data).toBeDefined();
   done();}
   });
   });
   });

   */

});
