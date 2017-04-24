describe("Data Analytics Service - CDL", function() {

    describe("GET /", function() {
        it("server runs at least ...", function(done) {
            $.get("/", function(data, textStatus, jqXHR) {
                expect(data).toBe("CDB");
                done();
            });
        });
    });

    describe("DEL /ds/:tenantid/:dsid   (/ds/test/test) ", function() {
        it("Completelly removes a data-sets (test) from a tenant database (test)" +
            "Not intended for final users", function(done) {
            $.ajax(
                {   url:"/ds/test/test",
                    type:"DELETE",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        done();}
                });
        });
    });

    describe("DEL /ds/:tenantid/:dsid", function() {
        it("We just remove another data set test2 " +
            "Not intended for final users" +
            "The test database is now clean", function(done) {
            $.ajax(
                {   url:"/ds/test/test2",
                    type:"DELETE",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        done();}
                });
        });
    });

    describe("GET /ds/:tenantid/:dsid/:max", function() {
        it("Get the most recent record from dataset dsid up to a maximun number max" +
            "This function is only intended for specific simple pourposes related with streams" +
            "We use it here in this test to check that nothing is avaliable in the testting dataset", function(done) {
            $.ajax(
                {   url:"/ds/test/test/10",
                    method:"GET",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        expect(data.length).toBe(0);
                        done();}
                });
        });
    });

    describe("POST /ds/:tenantid/putdata", function() {
        it("It add a set of data points to the collection " +
            "Thi function will be used by IDA to insert records", function(done) {
            $.ajax(
                {   url:"/ds/test/putdata",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            dsid:'test',
                            data: [  {created: "Nov 3 1964", field1: "value1"},
                                     {created: "Nov 4 1964", field1: "value2"}
                                ]
                            }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(textStatus).toBe("success");
                        expect(data.insertedCount).toBe(2);
                        done();}
                });
        });
    });

    describe("GET /ds/:tenantid/:dsid/:max", function() {
        it("We just re-use the get function here to make sure the inserted data has been inserted", function(done) {
            $.ajax(
                {   url:"/ds/test/test/10",
                    method:"GET",
                    contentType:"application/json",
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(data).toBeDefined();
                        expect(data.length).toBe(2);
                        expect(data[0].created).toBe("Nov 3 1964");
                        done();}
                });
        });
    });

    describe("POST /ds/:tenantid/putdata", function() {
        it("We add here another collection (test2) with new data", function(done) {
            $.ajax(
                {   url:"/ds/test/putdata",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            dsid:'test2',
                            data: [
                                {created: "Jan 3 1964", field1: "value1"},
                                {created: "Jan 4 1964", field1: "value2"}
                                ]
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(textStatus).toBe("success");
                        expect(data.insertedCount).toBe(2);
                        done();}
                });
        });
    });

    describe("POST /ds/:tenantid/getdata", function() {
        it("Get the data that we posted before using a metadata query" +
            "the body of the function is going to send a metadata definition for the 'query'" +
            "for now the metadata is extremelly simple, it just specifies the dataset id for a tenant" +
            "{tenantid: 'test', dsid: 'test2'}", function(done) {
            $.ajax(
                {   url:"/ds/test/getdata",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                            {
                                dsid:'test2'
                            }
                         ),
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(textStatus).toBe("success");
                        expect(data.length).toBe(2);
                        done();}
                });
        });
    });

    describe("POST /ds/:tenantid/getdata", function() {
        it("Get the data that we posted before using a metadata query" +
            "the body of the function is going to send a metadata definition for the 'query'" +
            "for now the metadata is extremelly simple, it just specifies the dataset id for a tenant" +
            "{tenantid: 'test', dsid: 'test2'}", function(done) {
            $.ajax(
                {   url:"/ds/test/getdata",
                    method:"POST",
                    contentType:"application/json",
                    data: JSON.stringify(
                        {
                            dsid:'test1',
                            merge: {
                                dsid: 'test2',
                                commonFeatureName: 'field1'
                            }
                        }
                    ),
                    success:function(data, textStatus, jqXHR) {
                        var emptyArray = [];
                        expect(textStatus).toBe("success");
                        expect(data.length).toBe(2);
                        done();}
                });
        });
    });


});
