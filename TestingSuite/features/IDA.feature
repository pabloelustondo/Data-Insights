
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


  Scenario: As an admininstrator I want to GET a list of existing topics
    Given I grab the xaccesskey for ODA from 'testTemporaryToken'
    And I grab ODA url from globalconfig.json
    When I GET topics
    Then response code is :200
    Then response body should be error-free
    #Then The response message should not include <testResponse>

  Scenario: As an admininstrator I want to subscribe to a topic
    Given I grab the xaccesskey for ODA from 'testTemporaryToken'
    And I grab ODA url from globalconfig.json
    Then I set valid request for posting to ~/query
      |dataSetId|from       |
      |string   |vehicleInfo|
    And I make a POST call to ~/query
    Then response code is :200
   #Further validation is needed
    Then the response doesnt have to be merged

  Scenario: invalid POST to Query
    Given I set invalid request for POST call to ~/query
      |dataSetId|from              |
      |string   |unicornCollection |
    And I grab ODA url from globalconfig.json
    And I make a POST call to ~/query
    Then response code is :400
    Then The response message should contain error



