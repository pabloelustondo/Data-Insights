Feature: Finalize data incoming flow
  # https://jira.soti.net/browse/CB-425

Background:
  New service (supposedly CDB) should take care of data persistence
  Lambda function that triggers S3->MongoDB data transfer should be decommissioned
  New service (CDB) should save data into S3 and MongoDB in parallel asynchronously
  S3 keeps all the data in the document whereas MongoDB keeps only subset defined in the DataModel

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


