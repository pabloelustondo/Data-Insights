
Feature: IDA API Tests

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
    Given I set the xaccesskey to a modified JWT
    And I grab IDA url from the config file
    When I make GET call to endpoint "/Security/getAuthorizationToken"
    Then response code must be 400
    Then response body should be empty or contain error

  Scenario: As an administrator I want to make a POST request to IDA using my temporary Authorization Token
    Given I set the temporary AuthorizationToken
    And I grab IDA url from the config file
    When I Post :portnumber with example data
    Then response code must be 200
    And response body should be a valid IDA-POST response

  Scenario: As an administrator I want to make a POST request to IDA using an invalid token
    Given I set the AuthorizationToken to invalid token
    And I grab IDA url from the config file
    When I Post :portnumber with example data
    #Then response code must be 200
    And response body should be empty or contain error

  Scenario: As an administrator I want to validate that Kafka is receiving my posts to IDA
     Given grab IDA port number for kafka test
     Given Set headers and body for posting data to IDA
     When I Post :portnumber after setting headers and body
     Then Kafka Consumer should receive some message without error



