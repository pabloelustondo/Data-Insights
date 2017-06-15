Feature: Tenancy Management

  #DataSources

  Scenario: As an administrator I want to create a DataSource
  #  Given I delete previous test information
    Given I login as "test1"
    Given I grab 'dssback' url from config file
    When  I POST with endpoint "registerDataSource"
    Then response code should be 200
    # Then I should receive datasource information and store it for usage in the next step


 Scenario: As an administrator I want to download DataSource credentials
    Given I login as "test1"
    Given I grab 'dssback' url from config file
    When  I POST with endpoint "sourceCredentials"
    Then response code should be 200
   # Then I should verify the credentials that I receive

  Scenario: As an administrator I want to reset DataSource credentials
    Given I login as "test1"
    And grab DSS port number
    When I GET :portnumber with endpoint "sourceCredentials" to download credentials
    Then I set head and body for handling credentials
    Then I POST :portnumber with endpoint "resetCredentials" to reset credentials
    And grab IDA's port number
    Then I GET :idaportnumber with old credentials and endpoint "Security/GetAuthorizationToken"
    And response body contain some sort of error
