describe("Data Analytics Service - DDB", function() {

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
