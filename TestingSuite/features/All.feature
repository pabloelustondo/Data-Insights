
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



Feature: Create TMM service
  # https://jira.soti.net/browse/CB-505

  Background:
  simple UI should allow customer to define data sets (CRUD operations);
  each data set should allow customer to define metadata (as a bare json document for now);
  user should be able to see a list of all existing data sets;
  DSS should be responsible only for data sources management and the future feature of suspending incoming data belongs to DSS - it is not a data sets operation.
# add TMM positive/negative validation tests

  Scenario: As an administrator, I want to create a new data set
    Given I Create a new Tenant Metadata Object
    And grab tmm port number
    Then I set headers and body for posting to tmm
    When I POST to "/tenant"
    Then The response code needs to be '200'
    And The response body should contain an array of valid meta data objects

  Scenario: As an administrator, I want to create a new modified data set
    Given I modify a Tenant Metadata Object such that it remains valid
    And grab tmm port number
    Then I set headers and body for posting to tmm
    When I POST to "/tenant"
    Then The response code needs to be '200'
    And The response body should contain an array of valid meta data objects

  Scenario: As an administrator, I want to post to tmm with an invalid Tenant Metadata Object
    Given I modify a Tenant Metadata Object to have an invalid tenantid
    And grab tmm port number
    Then I set headers and body for posting to tmm
    When I POST to "/tenant"
    Then The response code needs to be '204'
    #And The response body should contain statusCode 400

  Scenario: As an administrator, I want to post to tmm with the wrong tenantid in the url
    Given I modify a Tenant Metadata Object to have different tenantid from the one passed in through url
    And grab tmm port number
    When I POST to "/tenant"
    Then The response code needs to be '200'
    And The response body should contain the error "url tenantid different from body tenantid"

  Scenario: As an administrator I want to make a get request to tmm
    Given I Create a new Tenant Metadata Object
    And grab tmm port number
    Then I set header for making get to tmm
    When I get "/tenant"
    Then The response code needs to be '200'
    And the response body should be an array with at least 1 Tenant Metadata Object with the correct tenantid

  Scenario: As an administrator I want to make an invalid get request to tmm
    Given I Create a new Tenant Metadata Object
    And grab tmm port number
    Then I set header for making get to tmm with non-existent tenantid
    When I get "/tenant"
    Then The response code needs to be '200'
    And The response body should be an empty array


Feature: SOTI Insight ODA Backend Components

      #New ODA endpoints CB-437 and CB-438

  Scenario: As an admininstrator I want to GET a list of existing topics
    Given I set the xaccesskey for ODA
    And I grab ODA port number from globalconfig.json
    When I GET topics
    Then response code is :200
    Then response body should be error-free
    Then The response message should not include <testResponse>

  Scenario: As an admininstrator I want to subscribe to a topic
    Given I set valid request header and body for POST call to ~/query with metadata id
    And I grab ODA port number from globalconfig.json
    And I make a POST call to ~/query
    Then response code is :200
   #Further validation is needed
    Then the response doesnt have to be merged

  Scenario: invalid POST to Query
    Given I set invalid request header and body for POST call to ~/query
    And I grab ODA port number from globalconfig.json
    And I make a POST call to ~/query
    Then response code is :200
    Then The response message should contain error



Feature: Finalize data incoming flow
  # https://jira.soti.net/browse/CB-425

  Background:
  New service (supposedly CDB) should take care of data persistence
  Lambda function that triggers S3->MongoDB data transfer should be decommissioned
  New service (CDB) should save data into S3 and MongoDB in parallel asynchronously
  S3 keeps all the data in the document whereas MongoDB keeps only subset defined in the DataModel

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
    Then response code must be 200
    Then response body should be empty or contain error

  Scenario: As an administrator I want to Post to /data
    Given I set the temporary AuthorizationToken
    And grab and store IDA port number
    When I Post :portnumber with example data
    Then response code must be 200
    And response body should be a valid IDA-POST response

  Scenario: As an administrator I want to send Invalid Post information to /data
    Given I set the AuthorizationToken to invalid token
    And grab and store IDA port number
    When I Post :portnumber with example data
    #Then response code must be 200
    And response body should be empty or contain error

    #Todo: Query Mongo for the DataModel DataSet


Feature: Server-side metadata with merge (non-persisted, for interactive queries)
  # https://jira.soti.net/browse/CB-437

  Background:
  based on given data set metadata definition we should be able to return merged data set.

  Scenario: Return Merged DataSet
    Given I set valid request header and body for POST call to ~/query with metadata id
    And I grab ODA port number from globalconfig.json
    And I make a POST call to ~/query
    Then response code is :200
    #Further validation is needed
    Then The response message should contain the merged dataset

Feature: Extend ODA with Pub/Sub (for DAD/3rd party apps)
  # https://jira.soti.net/browse/CB-438

  Background:
  There is an API that returns list of existing topics
  There is an API customer may use to subscribe to a published topic
  Simple consumer should be able to subscribe/consume the data

  Scenario: As an admininstrator I want to GET a list of existing topics
    Given I set the xaccesskey for ODA
    And I grab ODA port number from globalconfig.json
    When I GET topics
    Then response code is :200
    Then response body should be error-free

  Scenario: As an admininstrator I want to subscribe to a topic
    Given I set valid request header and body for POST call to ~/query with metadata id
    And I grab ODA port number from globalconfig.json
    And I make a POST call to ~/query
    Then response code is :200
    #Further validation is needed
    Then the response doesnt have to be merged


Feature: Create TMM service
  # https://jira.soti.net/browse/CB-505

  Background:
  simple UI should allow customer to define data sets (CRUD operations);
  each data set should allow customer to define metadata (as a bare json document for now);
  user should be able to see a list of all existing data sets;
  DSS should be responsible only for data sources management and the future feature of suspending incoming data belongs to DSS - it is not a data sets operation.
# add TMM positive/negative validation tests

  Scenario: As an administrator, I want to create a new data set
    Given I Create a new Tenant Metadata Object
    And grab tmm port number
    Then I set headers and body for posting to tmm
    When I POST to "/tenant"
    Then The response code needs to be '200'
    And The response body should contain an array of valid meta data objects

  Scenario: As an administrator, I want to create a new modified data set
    Given I modify a Tenant Metadata Object such that it remains valid
    And grab tmm port number
    Then I set headers and body for posting to tmm
    When I POST to "/tenant"
    Then The response code needs to be '200'
    And The response body should contain an array of valid meta data objects

  Scenario: As an administrator, I want to post to tmm with an invalid Tenant Metadata Object
    Given I modify a Tenant Metadata Object to have an invalid tenantid
    And grab tmm port number
    Then I set headers and body for posting to tmm
    When I POST to "/tenant"
    Then The response code needs to be '204'
    #And The response body should contain statusCode 400

  Scenario: As an administrator, I want to post to tmm with the wrong tenantid in the url
    Given I modify a Tenant Metadata Object to have different tenantid from the one passed in through url
    And grab tmm port number
    When I POST to "/tenant"
    Then The response code needs to be '200'
    And The response body should contain the error "url tenantid different from body tenantid"

  Scenario: As an administrator I want to make a get request to tmm
    Given I Create a new Tenant Metadata Object
    And grab tmm port number
    Then I set header for making get to tmm
    When I get "/tenant"
    Then The response code needs to be '200'
    And the response body should be an array with at least 1 Tenant Metadata Object with the correct tenantid

  Scenario: As an administrator I want to make an invalid get request to tmm
    Given I Create a new Tenant Metadata Object
    And grab tmm port number
    Then I set header for making get to tmm with non-existent tenantid
    When I get "/tenant"
    Then The response code needs to be '200'
    And The response body should be an empty array

