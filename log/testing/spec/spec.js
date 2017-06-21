
describe("Data Analytics Service - LOG", function() {

    describe("GET /siloguser", function() {
        it("returns all the tenants from the user logs", function(done) {
            $.get("/siloguser", function(data, textStatus, jqXHR) {
                expect(textStatus).toBe("success");
                done();
            });
        });
    });

    describe("POST /siloguser", function() {
        it("post a new log to the user logs", function(done) {
            $.ajax({
                url: "siloguser",
                type:"POST",
                data: JSON.stringify({classifier: "Test_Log", mesasage: "any message", tenenatId: "testtenant-testuser", parameters: {}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });

    describe("DELETE /siloguser/:tenantid", function() {
        it("delete a silog by the certain tenant for the user logs", function(done) {
            $.ajax({
                url: "/siloguser/" + 'testtenant-testuser',
                type:"DELETE",
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data.ok).toBe(1);
                    done();
                }
            });
        });
    });


    describe("GET /silogserver", function() {
        it("returns all the tenants from the server logs", function(done) {
            $.get("/silogserver", function(data, textStatus, jqXHR) {
                expect(textStatus).toBe("success");
                done();
            });
        });
    });

    describe("POST /silogserver", function() {
        it("post a new log to the server logs", function(done) {
            $.ajax({
                url: "silogserver",
                type:"POST",
                data: JSON.stringify({classifier: "Test_Log", mesasage: "any message", tenenatId: "testtenant-testserver", parameters: {}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data).toBeDefined();
                    done();}
            });
        });
    });

    describe("DELETE /silogserver/:tenantid", function() {
        it("delete a silog by the certain tenant for the server logs", function(done) {
            $.ajax({
                url: "/silogserver/" + 'testtenant-testserver',
                type:"DELETE",
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data.ok).toBe(1);
                    done();
                }
            });
        });
    });

    describe("POST logs to KAFKA", function() {
        it("sends logs to the KAFKA", function(done) {
            $.ajax({
                url: "/unittest",
                type:"GET",
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    console.log("From post: " + JSON.stringify(data,null,2));
                    expect(data.ok).toBe(1);
                    done();
                }
            });
        });
    });

});




