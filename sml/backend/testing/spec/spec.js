describe("DAD Backend", function() {
/*
    describe("GET /", function() {
        it("service is up", function(done) {
            $.get("/", function(data, textStatus, jqXHR) {
                expect(data).toContain("SML Backend");
                done();
            });
        });
    });



    describe("GET /datasets", function() {
        it("returns available (testing) datasets", function(done) {
            $.get("/datasets", function(data, textStatus, jqXHR) {
                expect(data).toBeDefined();
                var files = JSON.parse(data);
                expect(files.length).toBeGreaterThan(0);
                expect(
                    files.find(function(e){
                    return (e==="devstats1.json");})
                ).toBeDefined();
                done();
            });
        });
    });

    describe("POST /getdata", function() {
        it("test the data source end point - just a mock for testin g", function(done) {
            var smlquery = {from:[ {id:"devstats1"} ]};
            $.ajax({
                url: "/getdata",
                type:"POST",
                data: JSON.stringify(smlquery),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    expect(data).toBeDefined();

                    var dataobj = JSON.parse(data);
                    expect(dataobj.length).toBeGreaterThan(0);
                    expect(dataobj[0].StatType).toBe(-1);
                    expect(dataobj[0].intvalue).toBe(100);

                    done();}
            });
        });

    });

    describe("POST /smlquery", function() {
        it("executes an ad-hoc TRIVIAL (only ID) query defined by a SML dataset a returns it with (test) data", function(done) {
            var smlquery = {id:"devstats2"};
            $.ajax({
                url: "/smlquery",
                type:"POST",
                data: JSON.stringify(smlquery),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    expect(data).toBeDefined();

                    try {
                        expect(data.length).toBe(3);
                        expect(data[0].StatType).toBe(-1);
                        expect(data[0].intvalue).toBe(100);
                    } catch(e){
                        fail("could not parse data");
                    }
                    done();},
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus); alert("Error: " + errorThrown);
                }
            });
        });

    });

 */
    describe("POST /smlquery", function() {
        it("executes an ad-hoc SIMPLE SML dataset with a python transformation a returns it with (test) data", function(done) {
            var smlquery = {
                id:'devices_not_lasted_shift',
                from: [{id:"devstats2"}],
                parameters:[
                    {
                    name: 'end',
                    type: 'string',  //for now pure javascript code
                    value: '2016-08-23'
                    }
                ],
                transformations:[{
                    type: "ProcessDataSet",
                    lang: "Python",
                    script: `
				threshold = sys.argv[3]
				shift = sys.argv[2]
				start = sys.argv[4]
				end = sys.argv[5]				
				cols = data.select_dtypes(['object'])
				data[cols.columns] = cols.apply(lambda x: x.str.strip())
				data['time_stamp'] = pd.to_datetime(data['time_stamp'], format='%Y-%m-%d %H:%M:%S')
				data.set_index(['devid', 'time_stamp'], inplace=True) 
				data.sort_index(level=1, inplace=True)
				dischargedGroup = (data.groupby(level=0, sort=False)['intvalue'].apply(list))
				def check(line): 
					oldval = 100
					for i in line:
						if (i > oldval) | (i < threshold):
							return 1
							break
						else: 
							oldval = i
						return 0
				discharged = dischargedGroup.apply(check)
				dischargedGroup = pd.DataFrame(dischargedGroup)
				discharged = pd.DataFrame(discharged)
				discharged = discharged[discharged['intvalue'] > 0]
				discharged = pd.merge(discharged, dischargedGroup, left_index=True, right_index=True)
				discharged['StartDate'] = start
				discharged['EndDate'] = end
				return discharged
					`
        }]};
            $.ajax({
                url: "/smlquery",
                type:"POST",
                data: JSON.stringify(smlquery),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    expect(data).toBeDefined();

                    try {
                        expect(data.length).toBe(8);
                        var expected_result = [{ intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 10 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' },
                        { intvalue_x: 1,
                            intvalue_y: [ 100 ],
                            StartDate: '2016-08-22',
                            EndDate: '2016-08-23' }];

                        var datajson = JSON.stringify(data);
                        var expectedjson = JSON.stringify(expected_result);
                        expect(datajson).toEqual(expectedjson);

                    } catch(e){
                        fail("could not parse data");
                    }
                    done();},
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus); alert("Error: " + errorThrown);
                }
            });
        });

    });
/*
    describe("GET /daduser/:userid", function() {
        it("returns a configuration with the right test user id and configuration", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var resObj = JSON.parse(data)[0];
                var configString = JSON.stringify(resObj.config);
                var expectedConfigString = JSON.stringify({attribute:"nada"});
                expect(resObj).toBeDefined();
                expect(resObj.userid).toBe("testtenant-testuser");
                expect(configString).toBe(expectedConfigString);
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("post a new updated configuration for the test user", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:{attribute:"algo"}}),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    expect(data).toBeDefined();
                    done();}
            });
        });

    });

    describe("GET /daduser/:userid", function() {
        it("returns the updated configuration with the right test user id and configuration", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var resObj = JSON.parse(data)[0];
                var configString = JSON.stringify(resObj.config);
                var expectedConfigString = JSON.stringify({attribute:"algo"});
                expect(resObj).toBeDefined();
                expect(resObj.userid).toBe("testtenant-testuser");
                expect(configString).toBe(expectedConfigString);
                done();
            });
        });
    });

    describe("POST /daduser/:userid", function() {
        it("post a new BIG updated configuration for the test user", function(done) {
            $.ajax({
                url: "/daduser/testtenant-testuser",
                type:"POST",
                data: JSON.stringify({ userid:'testtenant-testuser', config:[CHARTS,CHARTS,CHARTS,CHARTS] }),
                contentType:"application/json",
                success: function(data, textStatus, jqXHR) {
                    expect(data).toBeDefined();
                    done();}
            });
        });

    });

    describe("GET /daduser/:userid", function() {
        it("returns the BIG updated configuration with the right test user id and configuration", function(done) {
            $.get("/daduser/testtenant-testuser", function(data, textStatus, jqXHR) {
                var resObj = JSON.parse(data)[0];
                var configString = JSON.stringify(resObj.config);
                var expectedConfigString = JSON.stringify([CHARTS,CHARTS,CHARTS,CHARTS]);
                expect(resObj).toBeDefined();
                expect(resObj.userid).toBe("testtenant-testuser");
                expect(configString).toBe(expectedConfigString);
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
