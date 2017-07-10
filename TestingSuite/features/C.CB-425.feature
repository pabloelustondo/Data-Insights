Feature: Finalize data incoming flow (CB-425)
  # https://jira.soti.net/browse/CB-425

Background:
  New service (supposedly CDB) should take care of data persistence
  Lambda function that triggers S3->MongoDB data transfer should be decommissioned
  New service (CDB) should save data into S3 and MongoDB in parallel asynchronously
  S3 keeps all the data in the document whereas MongoDB keeps only subset defined in the DataModel

  Scenario: As an administrator I want to get a temporary Authorization Token from IDA to use the other API endpoints
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

    #Todo: Query Mongo for the DataModel DataSet


