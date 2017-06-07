Feature: Create TMM service
  # https://jira.soti.net/browse/CB-505

Background:
simple UI should allow customer to define data sets (CRUD operations);
each data set should allow customer to define metadata (as a bare json document for now);
user should be able to see a list of all existing data sets;
DSS should be responsible only for data sources management and the future feature of suspending incoming data belongs to DSS - it is not a data sets operation.
# add TMM positive/negative validation tests

  Scenario: Valid POST Submission of new Meta Data Structure
    Given I Create a new Tennant Metadata Object
    When I POST to 'URL_TBD'
    Then The response code should be '200'
    And The response body should contain an array of valid meta data objects
  Scenario: Invalid GET Submission of new Meta Data Structure
    Given I Create a new Tennant Metadata Object
    When I GET to 'URL_TBD'
    Then The response code should be '404'
    And The response body should contain 'cannot GET to URL_TBD'
  Scenario: Invalid POST Submission Using an Empty JSON Object
    Given I Create an empty Tennant Metadata Object
    When I GET to 'URL_TBD'
    Then The response code should be '404'
    And The response body should contain 'Invalid Submission'
  Scenario: Invalid POST Submission using non-unique ID
    Given I Create a new Tennant Metadata Object
    And Leave ID set as a previous Metadata Object ID
    When I POST to 'URL_TBD'
    Then The response code should be '404'
    And The response body should contain 'Invalid ID Provided'

  Scenario Outline: Invalid POST Submission with empty <fieldName> field from the <objectNode> object
    Given I Create a new Tennant Metadata Object
    And Leave '<fieldName>' undefined in '<objectNode>'
    When I POST to 'URL_TBD'
    Then The response code should be '404'
    And An error message indicating invalid '<objectNode>' was submitted
    Examples:
      | fieldName  | objectNode        |
      | ID         | SmlTenantMetadata |
      | Name       | SmlTenantMetadata |
      | tenantID   | SmlTenantMetadata |
      | dataSet    | SmlTenantMetadata |
      | dataSource | SmlTenantMetadata |
      | properties | SmlDataSource     |
      | active     | SmlDataSource     |
      | type       | SmlDataSource     |
      | from       | SmlDataSet        |
      | persist    | SmlDataSet        |
  Scenario: Valid POST Submission of Modified Metadata Object
    Given I modify a Tennant Metadata Object
    When I POST to 'URL_TBD'
    Then The response code should be '200'
    And The response body should contain an array of valid meta data objects
  Scenario: Invalid GET Submission of Modified Metadata Object
    Given I modify a Tennant Metadata Object
    When I GET to 'URL_TBD'
    Then The response code should be '404'
    And The response body should contain 'cannot GET to URL_TBD'