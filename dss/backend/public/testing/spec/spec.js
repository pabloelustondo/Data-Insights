ErrorMsg =
  {
    "missing_accountid": "Missing AccountID",
    "missing_apisecret": "Missing API secret",
    "missing_domainid": "Missing DomainID",
    "not_found_domainid": "DomainID was not found",
    "missing_username": "Missing Username",
    "missing_password": "Missing Password",
    "missing_mcurl": "Missing MobiControl Url",
    "missing_apikey": "Missing API key",
    "mcurl_already_enrolled": "MobiControl Url already enrolled",
    "domainid_already_enrolled": "Domain ID already enrolled",
    "mcurl_enrollement_failed_authentication": "Failed to enroll due to authentication failure",
    "mcurl_enrollement_failed_url_not_reachable": "Failed to enroll due to url not reachable",
    "login_failed_authentication": "Failed to login due to MobiControl authentication failure",
    "session_missing_callback_token" : "Redirect mechanism did not provide auth Token.",
    "db_connection_not_establish" : "Could not connect to DB. Please contact SOTI support",
    "tenantid_not_registered": "System could not find IDP for provided tenantID",
  }
;

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
        data: JSON.stringify({accountid:'1237897410', mcurl:"http://localhost:9999", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"1237897410", username:"Administrator", password:"nada"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("Enrollment did not fail even the password was wrong");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
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
          expect(jqXHR.responseText).toBe(ErrorMsg.mcurl_enrollement_failed_authentication);
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
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.domainid_not_enrolled);
          done();
        }
      });
    });
    it("created enrollment has accountid, mcurl, apikey, domainid, tenantid and username", function(done) {
      $.ajax({
        url: "/api/myenrollments",
        type:"GET",
        data: JSON.stringify({}),
        headers : {
          "x-access-token" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRfdCIsImFjY291bnRpZCI6InZhcnVuLmRhdmVAc290aS5uZSIsImRvbWFpbmlkIjoiZF90IiwidGVuYW50SWQiOiJkX3QiLCJjb21wYW55bmFtZSI6IiIsImNvbXBhbnlhZGRyZXNzIjoiIiwiY29tcGFueXBob25lIjoiIiwiaWF0IjoxNDg4NDYzMzQwLCJleHAiOjE4NDg0NjMzNDB9.9nFWb1c0g5e7sqX4DAIwBS9a2Q9_kHK7IX2J15yyj9o",
        },
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          expect(data).toBeDefined();
          expect(data.domainid).toBe('varun.dave@soti.ne');
          expect(data.tenantid).toBe('d_t');
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          fail('this call must return data successfuly');
          done();
        }
      });
    });

  });

  describe("POST /sessions/create (login) after enrollment has happen", function() {
    it("fails to log in if user cannot authenticate", function(done) {
      $.ajax({
        url: "/sessions/create",
        type:"POST",
        data: JSON.stringify({domainid:"utest", username:"Administrator", password:"2"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when user cannot be authenticated");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.session_missing_callback_token);
          done();
        }
      });
    });
    // this test case is no longer valid as sessions are forced by redirection
    /*
    it("logs in if domainid, user and password are ok", function(done) {
      $.ajax({
        url: "/sessions/create",
        type:"POST",
        data: JSON.stringify({domainid:"utest", username:"Administrator", password:"1"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          expect(textStatus).toBe('success');
          expect(jqXHR.responseJSON.id_token).toBeDefined();
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          fail("Use should be able to log in in this case")
          done();
        }
      });

    });*/
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
        url: "/urlbydomainid?domainid=utest",
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
