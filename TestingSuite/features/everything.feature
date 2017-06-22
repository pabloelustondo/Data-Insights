Feature: Everything

  Background:
  Everything

  Scenario: As an administrator I want to try to enroll a MobiControl data source
    Given I grab 'dssback' url from config file
    Given I create a login session as "test"
      |domainid |code         |
      |test     |administrator|
    Given I set request for test_user
      | tenantid        |  dataSourceType | agentid    | data                                      |
      | test_user		|  MobiControl    | asdas      | {inputName: "mcurl",inputValue: mobiUrl}  |
    When  I POST with endpoint "registerDataSource"
    Then response code should be 200

  Scenario: As an administrator I want to enroll a new tenant
    #  Given I delete previous test information
    Given I grab 'dssback' url from config file
    Given I create new user named "test1" with the following data:
      | accountid           |  apikey                          | clientsecret | domainid            | mcurl                                     |password|username          |
      | external_user		|  244cc44394ba4efd8fe38297ee8213d3| 1            | test1               | https://cad099.corp.soti.net/MobiControl  |1       |administrator     |
    When I POST with endpoint "enrollments"
    Then The HTTP Code should be 200
    Then The response's id_token should be valid
    Then I store the response token in a file 'InUserToken'

  Scenario: As an administrator I want to try to enroll with an existing tenant
    Given I grab 'dssback' url from config file
    Given I create new user named "test1" with the following data:
      | accountid           |  apikey                          | clientsecret | domainid               | mcurl                                     |password|username          |
      | external_user		|  244cc44394ba4efd8fe38297ee8213d3| 1            | test1               | https://cad099.corp.soti.net/MobiControl  |1       |administrator     |
    When I POST with endpoint "enrollments"
    Then The HTTP Code should be 200
    Then The response should contain 'Tenant ID already enrolled'

  Scenario: As an administrator I want to verify my enrollment
    Given I grab 'dssback' url from config file
    Given I create a login session as "test"
      |domainid |code         |
      |test_user   |85daa60d-eb8e-4845-918e-894d7368bd65|
    Then response code should be 200
  #{"domainid": "test", "code": "administrator"}
    Given I grab the access token from 'test_userPermanentToken'
    When I GET with endpoint "api/myenrollments"
    # http://10.0.91.2:8024/api/myenrollments
    Then response code should be 200
    Then I should receive my user information with all the valid fields
      |domainid     |tenantid |
      |peter.meaney@soti.net |test_user|

  Scenario: As an administrator I want to download an x-access-token for a data source
    #enroll a data source, store xaccesskey in permanent token
    Given I grab the xaccesskey from 'testToken'
    And I grab 'dssback' url from the config file
    And I set up request for making get call to '/getDataSources'
    When I make a GET call
    Then response code must be 200
    Then I get the agentID of a data source
    Then I set up request for making get call to get permanent token for the data source
    Then I make a GET call
    Then response code must be 200
    And response body should be error-free
    Then I store the response in 'testPermanentToken'

  Scenario: As an administrator I want to get a temporary Authorization Token from IDA to use the other API endpoints
    #enroll a data source, store xaccesskey in permanent token
    Given I grab the xaccesskey from 'testPermanentToken'
    And I grab 'ida' url from the config file
    And I set up request for making get call to '/Security/getAuthorizationToken'
    When I make a GET call
    Then response code must be 200
    And response body should be error-free
    And response body should contain a temporary token
    Then I store the response in 'testTemporaryToken'

  Scenario: As an administrator I want to try to get a temporary Authorization Token from IDA to use the other API endpoints using an invalid xaccesskey
    Given I modify the xaccesskey to an invalid JWT
    And I grab 'ida' url from the config file
    And I set up request for making get call to '/Security/getAuthorizationToken'
    When I make a GET call
    Then response code must be 400
    Then response body should be empty or contain error

  Scenario: As an administrator I want to make a POST request to IDA using my temporary Authorization Token
    Given I grab the xaccesskey from 'testTemporaryToken'
    And I grab 'ida' url from the config file
    And I set up request for making post call to '/data'
    When I make a POST call
    Then response code must be 200
    And response body should be a valid IDA-POST response

  Scenario: As an administrator I want to make a POST request to IDA using an invalid token
    Given I modify the xaccesskey to an invalid JWT
    And I grab 'ida' url from the config file
    And I set up request for making post call to '/data'
    When I make a POST call
    Then response code must be 400
    And response body should be empty or contain error

  Scenario: As an administrator I want to validate that Kafka is receiving my posts to IDA
    Given grab IDA port number for kafka test
    Given I set up request for making post call to '/data'
    When I make a POST call to /data
    Then Kafka Consumer should receive some message without error


  Scenario: As an administrator, I want to create a new data set
    Given I create a new Tenant Metadata Object for tenant test_user
      |id   |name       |from             |persist  |filter |merge  |projections  |metadata |
      |123  |testDataSet|[testDataSource] |true     |[]     |[]     |[]           |[]       |
    And I grab tmm backend url from the config file
    Then I setup request for posting to tmm backend
    When I POST to "/tenant/test_user"
    Then The response code needs to be '200'
    And The response body should contain an array of valid meta data objects

  Scenario: As an administrator, I want to create a duplicate data set
    Given I create a new Tenant Metadata Object for tenant test_user
      |id   |name       |from             |persist  |filter |merge  |projections  |metadata |
      |123  |testDataSet|[testDataSource] |true     |[]     |[]     |[]           |[]       |
    And I grab tmm backend url from the config file
    Then I setup request for posting to tmm backend
    When I POST to "/tenant/test_user"
    Then The response code needs to be '400'
    And The response body should contain the error "object already exists"

#  Scenario: As an administrator, I want to post to tmm with an invalid Tenant Metadata Object
#    Given I modify a Tenant Metadata Object to have an invalid tenantid
#    And I grab tmm backend url from the config file
#    Then I setup request for posting to tmm backend
#    When I POST to "/tenant"
#    Then The response code needs to be '400'
#    #And The response body should contain statusCode 400
#
  Scenario: As an administrator, I want to post to tmm with a tenantid different from the one passed through the url
    Given I modify the Tenant Metadata Object tenantid to "best_user"
    And I grab tmm backend url from the config file
    Then I setup request for posting to tmm backend
    When I POST to "/tenant/test_user"
    Then The response code needs to be '400'
    And The response body should contain the error "url tenantid different from body tenantid"
#
  Scenario: As an administrator I want to make a get request to tmm
    Given I grab tmm backend url from the config file
    Then I set header for making a get request to tmm
    When I GET "/tenant/test_user"
    Then The response code needs to be '200'
    And the response body should be an array with at least 1 Tenant Metadata Object with the correct tenantid