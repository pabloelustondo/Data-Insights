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
    "mcurl_enrollement_failed_authentication": "Failed to enroll due to authentication failure",
    "mcurl_enrollement_failed_url_not_reachable": "Failed to enroll due to url not reachable",
    "login_failed_authentication": "Failed to login due to MobiControl authentication failure"
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
        url: "/sessions/create",
        type:"POST",
        data: JSON.stringify({domainid:"utest", username:"Administrator", password:"1"}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          fail("this API call must return an error when provided domain id was not found");
          done();},
        error: function( jqXHR, textStatus, errorThrown){
          expect(textStatus).toBe("error");
          expect(errorThrown).toBe("Bad Request");
          expect(jqXHR.responseText).toBe(ErrorMsg.not_found_domainid);
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
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:9999", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"utest", username:"Administrator", password:"nada"}),
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
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"utest", username:"Administrator", password:"nada"}),
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
        data: JSON.stringify({accountid:'acme', mcurl:"http://localhost:3004", apikey:"NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0", domainid:"utest", username:"Administrator", password:"1"}),
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
        url: "/api/enrollments",
        type:"GET",
        data: JSON.stringify({}),
        contentType:"application/json",
        success: function(data, textStatus, jqXHR) {
          expect(data).toBeDefined();
          var enrollm = _.find(data, function(d){ return d.domainid === 'utest';});
          expect(enrollm).toBeDefined();
          expect(enrollm.domainid).toBe('utest');
          expect(enrollm.mcurl).toBe('http://localhost:3004');
          expect(enrollm.apikey).toBe('NTUwYmMyNDU3MWRhNGI1NmIxMWM3NGM5YjM5NGZhMjc6REFEU2VjcmV0');
          expect(enrollm.username).toBe('Administrator');
          expect(enrollm.tenantid).toBe('utest');
          expect(enrollm.accountid).toBe('acme');
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
          expect(jqXHR.responseText).toBe(ErrorMsg.login_failed_authentication);
          done();
        }
      });
    });
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
    });
  });

});
