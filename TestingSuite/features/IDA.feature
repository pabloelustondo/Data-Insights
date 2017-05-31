
Feature: IDA API Tests

  Scenario: getting a temporary Authorization Token from IDA
    Given I set the xaccesskey
    And grab IDA port number
    When I Get :portnumber
    Then response code must be 200
    And response body should be error-free
    And AuthorizationToken is not empty
    Then I store the returned value in file named AuthorizationToken

  Scenario: getting a temporary Authorization Token from IDA with wrong xaccesskey
    Given I set the xaccesskey to a modified JWT
    And grab IDA port number
    When I Get :portnumber
    Then response code must be 200
    Then response body should be empty or contain error

  Scenario: making simple POST request to IDA
    Given I set the temporary AuthorizationToken
    And grab IDA port number
    When I Post :portnumber with example data
    Then response code must be 200
    And response body should be a valid IDA-POST response

  Scenario: making a invalid POST request to IDA
    Given I set the AuthorizationToken to PermanentToken
    And grab IDA port number
    When I Post :portnumber with example data
    #Then response code must be 200
    And response body should be empty or contain error





