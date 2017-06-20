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

  Scenario: As an administrator, I want to create a new data set
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
    Then The response code needs to be '400'
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