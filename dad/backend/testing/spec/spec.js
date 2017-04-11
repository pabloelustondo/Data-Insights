describe("DAD Backend", function() {

    describe("GET /", function() {
        it("returns Welcome to DDB - The Central Database API for The Data Analytics Server", function(done) {
            $.get("/", function(data, textStatus, jqXHR) {
                expect(data).toBe("Welcome to DAD Backend - A Very Light Basic Backend API for DAD");
                done();
            });
        });
    });



    describe("GET /daduser/:userid", function() {
        it("returns empty daduser after deleting it before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var resObj = JSON.parse(data)[0];
                expect(resObj).toBeDefined();
                expect(resObj.userid).toBe("testtenant-testuser");
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("post a new configuration for testuser", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{attribute:"nada"}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    expect(data).toBeDefined();
                    done();}
            });
        });

    });

    /*
    describe("POST /daduser/:userid", function() {
        it("inserts  a daduser configuration ", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns 1 daduser after posting it before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
 //               expect(data.length).toBe(1);
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("replace a daduser configuration ", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns 1 daduser after posting it before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
//                expect(data.length).toBe(1);
                done();
            });
        });
    });

    /*
    describe("POST /daduser/:userid", function() {
        it("it saves a user configuration calling DDB'", function(done) {
            $.ajax(
                {   url:"/daduser/testtenant-testuser",
                    type:"",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        done();}
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
                data: JSON.stringify({ userid:'testtenant-testuser', config:{}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns 1 daduser after posting it before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("replace a daduser configuration ", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });


    describe("GET /daduser/:userid", function() {
        it("returns 1 daduser after posting it before", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var emptyArray = [];
                expect(data).toBeDefined();
                expect(data.length).toBe(1);
                done();
            });
        });
    });
    */


});
