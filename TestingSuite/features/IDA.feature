
Feature: IDA API Tests

  Scenario: As an administrator I want to get a temporary Authorization Token from IDA to use the other API endpoints
    Given I set the xaccesskey
    And grab and store IDA port number
    When I make GET call to endpoint "/Security/getAuthorizationToken"
    Then response code must be 200
    And response body should be error-free
    And AuthorizationToken is not empty
    Then I store the returned value in file named AuthorizationToken

  Scenario: As an administrator I want to try to get a temporary Authorization Token from IDA to use the other API endpoints using an invalid xaccesskey
    Given I set the xaccesskey to a modified JWT
    And grab and store IDA port number
    When I make GET call to endpoint "/Security/getAuthorizationToken"
    Then response code must be 400
    Then response body should be empty or contain error

  Scenario: As an administrator I want to make a POST request to IDA using my temporary Authorization Token
    Given I set the temporary AuthorizationToken
    And grab and store IDA port number
    When I Post :portnumber with example data
    Then response code must be 200
    And response body should be a valid IDA-POST response

  Scenario: As an administrator I want to make a POST request to IDA using an invalid token
    Given I set the AuthorizationToken to invalid token
    And grab and store IDA port number
    When I Post :portnumber with example data
    #Then response code must be 200
    And response body should be empty or contain error

  Scenario: As an administrator I want to validate that Kafka is receiving my posts to IDA
     Given grab IDA port number for kafka test
     Given Set headers and body for posting data to IDA
     When I Post :portnumber after setting headers and body
     Then Kafka Consumer should receive some message without error





