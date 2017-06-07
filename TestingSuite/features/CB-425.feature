Feature: Finalize data incoming flow
  # https://jira.soti.net/browse/CB-425

Background:
  New service (supposedly CDB) should take care of data persistence
  Lambda function that triggers S3->MongoDB data transfer should be decommissioned
  New service (CDB) should save data into S3 and MongoDB in parallel asynchronously
  S3 keeps all the data in the document whereas MongoDB keeps only subset defined in the DataModel

  Scenario: As an administrator I want to get a temporary Authorization Token from IDA to use the other API endpoints
    Given I set the xaccesskey
    And grab IDA port number
    When I Get :portnumber with endpoint "/Security/getAuthorizationToken"
    Then response code must be 200
    And response body should be error-free
    And AuthorizationToken is not empty
    Then I store the returned value in file named AuthorizationToken

  Scenario: As an administrator I want to try to get a temporary Authorization Token from IDA to use the other API endpoints using an invalid xaccesskey
    Given I set the xaccesskey to a modified JWT
    And grab IDA port number
    When I Get :portnumber with endpoint "/Security/getAuthorizationToken"
    Then response code must be 200
    Then response body should be empty or contain error

  Scenario: Post to /data and get a valid AWS response
    Given I set the temporary AuthorizationToken
    And grab IDA port number
    When I Post :portnumber with example data
    Then response code must be 200
    And response body should be a valid IDA-POST response

  Scenario: Invalid Post to /data
    Given I set the AuthorizationToken to PermanentToken
    And grab IDA port number
    When I Post :portnumber with example data
    #Then response code must be 200
    And response body should be empty or contain error

    #Todo: Query Mongo for the DataModel DataSet


