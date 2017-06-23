Feature: Enrollment

  #Enrollment

  Scenario: As an administrator I want to enroll
  #  Given I delete previous test information
    Given I grab 'dssback' url from config file
    Given I create new user with the following data
      | accountid           |  apikey                                  | clientsecret | domainid               | mcurl                                      |password|username          |
        | test		        |  244cc44394ba4efd8fe38297ee8213d3        | 1            | test_user                   | https://cad099.corp.soti.net/MobiControl  |1       |administrator     |
    When I POST to endpoint "enrollments"
    Then The HTTP Code should be 200
    Then The response's id_token should be valid

Scenario: As an administrator I want to verify my enrollment
    Given I grab 'dssback' url from config file
    Given I create a login session as "test"
      |domainid |code         |
      |test_user   |85daa60d-eb8e-4845-918e-894d7368bd65|
    Then response code should be 200
    #{"domainid": "test", "code": "administrator"}
    Given I grab the access token from 'test_userPermanentToken'
    When I make GET request to endpoint "api/myenrollments"
      # http://10.0.91.2:8024/api/myenrollments
    Then response code should be 200
    Then I should receive my user information with all the valid fields
      |domainid     |tenantid |
      |peter.meaney@soti.net |test_user|