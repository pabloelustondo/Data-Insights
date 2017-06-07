

describe("Data Analytics Service - DDB", function() {

    describe("GET /", function() {
        it("returns Welcome to DDB - The Central Database API for The Data Analytics Server", function(done) {
            $.get("/", function(data, textStatus, jqXHR) {
                expect(data).toBe("DDB");
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
                   expect(data.tenants.length).toBe(4);
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


    describe("DEL /tenant/:tenantid", function() {
        it("deletes a possible tenant configuration for the user 'testtenant-testuser'", function(done) {
            $.ajax(
                {   url:"/tenant/testtenant-testuser",
                    type:"DELETE",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        done();}
                });
        });
    });


    describe("GET /tenant/:tenantid", function() {
        it("returns empty tenant after deleting it before", function(done) {
            $.get("/tenant/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data.length).toBe(0);
                done();
            });
        });
    });


    describe("POST /tenant/:tenantid", function() {
        it("inserts  a tenant configuration ", function(done) {
            $.ajax({
                url: "/tenant/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ tenantid:'testtenant-testuser', config:{data:'something'}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /tenant/:tenantid", function() {
        it("returns 1 tenant after posting it before with correct data", function(done) {
            $.get("/tenant/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data[0].tenantid).toBe("testtenant-testuser");
                expect(data[0].config.data).toBe("something");
                expect(data.length).toBe(1);
                done();
            });
        });
    });

    describe("POST /tenant/:tenantid", function() {
        it("replace a tenant configuration same id different data", function(done) {
            $.ajax({
                url: "/tenant/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ tenantid:'testtenant-testuser', config:{data:'somethingelse'}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /tenant/:tenantid", function() {
        it("returns 1 tenant after posting a replace before", function(done) {
            $.get("/tenant/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                expect(data[0].tenantid).toBe("testtenant-testuser");
                expect(data[0].config.data).toBe("somethingelse");
                done();
            });
        });
    });

    describe("POST /tenant/:tenantid", function() {
        it("replace a tenant configuration wromg id different data", function(done) {
            $.ajax({
                url: "/tenant/testtenant-testuser2",
                type:"POST",
                data: JSON.stringify({ tenantid:'testtenant-testuser', config:{data:'somethingelse'}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    failure("this call should fail with error message");
                    done();},
                error: function(data, textStatus, jqXHR) {
                    console.log("Error From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    expect(data.status).toBe(400);
                    expect(data.responseText).toBe("url tenantid different from body tenantid");
                    done();}
            });
        });
    });

});
