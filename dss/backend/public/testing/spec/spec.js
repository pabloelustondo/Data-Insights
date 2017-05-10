describe("SOTI Data Analytics Security Service (DSS)", function() {

  describe("POST /sessions/create (login) before enrollment has happen", function() {
    it("is able to initialize test enrollments", function(done) {
      $.ajax({
        url: "/delete_test_domains",
        type:"POST",
        data: JSON.stringify({}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          expect(textStatus).toBe("success");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          fail("could not initialize the testing domains");
          done();
        }
      });
    });
    it("fails and send error message if domainid is not present", function(done) {
      $.ajax({
        url: "/sessions/create",
        type:"POST",
        data: JSON.stringify({}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no domainid is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_domainid);
          done();
          }
      });
    });
    it("fails and send error message if username is not present", function(done) {
      $.ajax({
        url: "/sessions/create",
        type:"POST",
        data: JSON.stringify({domainid:"utest"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no username is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_username);
          done();
        }
      });
    });
    it("fails and send error message if password is not present", function(done) {
      $.ajax({
        url: "/sessions/create",
        type:"POST",
        data: JSON.stringify({domainid:"utest", username:"Administrator"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no password is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_password);
          done();
        }
      });
    });
    it("fails and send error message if domainid has not been enrolled", function(done) {
      $.ajax({
        url: "/urlbydomainid",
        type:"get",
        data: {domainid:"autest", username:"Administrator", password:"1"},
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when provided domain id was not found");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Not Found");
          expect(jqXHR.responseText).toBe(ErrorMsg.tenantid_not_registered);
          done();
        }
      });
    });
  });

  describe("POST /enrollments(enrollment)", function() {
    it("fails and send error message if Account ID is not present", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no accountid is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_accountid);
          done();
        }
      });
    });
    it("fails and send error message if MobiControl Url is not present", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'acme'}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no domainid is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_mcurl);
          done();
        }
      });
    });
    it("fails and send error message if api key is not present", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no  api key is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_apikey);
          done();
        }
      });
    });
    it("fails and send error message if domainid is not present", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004" , apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no domainid is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_domainid);
          done();
        }
      });
    });
    it("fails and send error message if username is not present", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"utest"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no username is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_username);
          done();
        }
      });
    });
    it("fails and send error message if password is not present", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"utest", username:"Administrator"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when no password is provided");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_password);
          done();
        }
      });
    });
    it("fails to enroll the url/domain/admin user if url not reachable", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'1237897410', mcurl:"http://localhost:9999", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"test2", username:"Administrator", password:"wrongpassword"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("Enrollment did not fail even the password was wrong");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
     //     expect(textStatus).toBe("error");
     //     expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.mcurl_enrollement_failed_url_not_reachable);
          done();
        }
      });
    });
    it("fails to enroll the url/domain/admin user if admin user is NOT authorized by MobiControl url", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'1234567890', mcurl:"http://localhost:3004", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"1234567890", username:"Administrator", password:"nada"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("Enrollment did not fail even the password was wrong");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
      //    expect(jqXHR.responseText).toBe(ErrorMsg.mcurl_enrollement_failed_authentication);
          done();
        }
      });
    });
    it("enrolls the url/domain/admin user if admin user get authorized by MobiControl url", function(done) {
      $.ajax({
        url: "/enrollments",
        type:"POST",
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:Math.random().toString(), username:"Administrator", password:"1"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          expect(textStatus).toBe("success");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
     //     expect(errorThrown).toBe("Bad Request");
     //    expect(jqXHR.responseText).toBe(ErrorMsg.domainid_not_enrolled);
          done();
        }
      });
    });
  });

  describe("GET /urlbydomainid", function() {

    it("it fails if missing domainid", function(done) {
      $.ajax({
        url: "/urlbydomainid",
        type:"GET",
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("it should reject a call without domain id")
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(jqXHR.responseText).toBe(ErrorMsg.missing_domainid);
          done();
        }
      });
    });

    it("returns the URL for a given domainid", function(done) {
      $.ajax({
        url: "/urlbydomainid?domainid=test",
        type:"GET",
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          expect(textStatus).toBe('success');
          expect(jqXHR.responseJSON.url).toBeDefined();
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          fail("This call should not fail");
          done();
        }
      });
    });
  });

});
