Feature: DSS API Tests

  #Enrollment


  Scenario: As an administrator I want to enroll
    Given I delete old test information
    Given I grab DSS port number
    Given I create new user named "test1" with the following data:
      | accountid       |  apikey                          | clientsecret | domainid               | mcurl                                     |password|username          |
      | external_user		|  244cc44394ba4efd8fe38297ee8213d3| 1            | stupidshit2ss442       | https://cad099.corp.soti.net/MobiControl  |1       |administrator     |
    When I POST to endpoint "enrollments"
    Then The HTTP Code should be 200
    Then The response's id_token should be valid

Scenario: As an administrator I want to verify my enrollment
  Given "test1" is created
  When I GET "myenrollments"
  # http://10.0.91.2:8024/api/myenrollments
  Then I should receive my user information
  # {"status":"new","tenantid":"test_user","mcurl":"https://cad145.corp.soti.net/MobiControl","domainid":"peter.meaney@soti.net","username":"peter.meaney@soti.net"}
