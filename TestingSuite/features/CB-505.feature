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
    When I POST to 'URL_TBD'
    Then The response code should be '200'
    And The response body should contain an array of valid meta data objects

  Scenario: As an administrator, I want to create a new modified data set
    Given I modify a Tenant Metadata Object
    When I POST to 'URL_TBD'
    Then The response code should be '200'
    And The response body should contain an array of valid meta data objects