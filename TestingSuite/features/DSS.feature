Feature: DSS API Tests

  Scenario: Enroll a MobiControl data source using an invalid x-access-token
    Given I set invalid header and body for external_user
    And grab DSS port number
    When I POST :portnumber with endpoint "registerDataSource"
    Then response code should be 400

  Scenario: Delete a data source and invalid x-access-token
    Given I set invalid header and body for external_user for delete
    And grab DSS port number
    When I POST :portnumber with endpoint "deleteDataSource"
    Then response code should be 400

    # This is not implemented yet
  Scenario: Delete a data source with a valid x-access-token
    Given I set valid header and body for external_user for delete
    And grab DSS port number
    When I POST :portnumber with endpoint "deleteDataSource"
    Then response code should be 400

  Scenario: Get temp authorizationToken from IDA with reset Data source
    Given I set head and body for handling credentials
    And grab DSS port number
    When I GET :portnumber with endpoint "sourceCredentials" to download credentials
    Then I set head and body for handling credentials
    Then I POST :portnumber with endpoint "resetCredentials" to reset credentials
    And grab IDA's port number
    Then I GET :idaportnumber with old credentials and endpoint "Security/GetAuthorizationToken"
    And response body contain some sort of error

  # GUI Enrollment & Login
  Scenario: Complete POST SignUp Form Submission Previously Enrolled Values
    Given I submit using previously enrolled values
    Then The HTTP Code should be 400
    Then The response should contain 'Tenant ID already enrolled'

  Scenario Outline: Incomplete POST SignUp Form Submission
    Given I submit with missing <valueField>
    Then The HTTP Code should be 400
    Then The response should contain '<valueErrorResponse>'

    Examples:
      | valueField   | valueErrorResponse      |
      | domainid     | Missing DomainID        |
      | mcurl        | Missing MobiControl Url |
      | apikey       | Missing API key         |
      | clientsecret | Missing API Password    |
      | username     | Missing Username        |
      | password     | Missing Password        |
      | accountid    | Missing AccountID       |

  #Todo -> Validation does not occur server-side for provided values.
  Scenario Outline: Complete POST SignUp Form Submission with Invalid Values
    Given I submit with invalid <valueField> value: <valueUsed>
    Then The HTTP Code should be 400
    Then The response should contain '<valueErrorResponse>'

    Examples:
      | valueField   | valueUsed                   | valueErrorResponse                             |
      | TenantID     | _____+_+.A                  | Invalid TenantID Provided                      |
      | MobiURL      | http://google.com/r/Android | Invalid MobiControl URL Provided               |
      | ClientID     | _!+!+@_#+$_%+!@+#_          | Client ID Cannot Contain Special Characters    |
      | ClientSecret | *                           | Client Secret Cannot Be Less Than 8 Characters |
      | Username     | ^!^#^^^#^^#^#^^#            | Username Cannot Contain Special Characters     |
      | Password     | 12                          | Password Cannot Be Less Than 8 Characters      |

  Scenario: Complete POST SignUp Form Submission with Response Token
    Given I do a 'POST' request with valid values
    Then The HTTP Code should be 200
    Then The response's id_token should be valid

  Scenario: Complete GET SignUp Form Submission
    Given I do a 'GET' request with valid values
    Then The HTTP Code should be 400
    Then The response should be a HTML Document -> features/assets/dss_cannot_get.html

  Scenario: Incomplete POST Login Form Submission
    Given I do a 'POST' request with no login values
    Then The HTTP Code should be 400
    Then The response should contain 'Missing AccountID'

  Scenario: Invalid GET Login Form Submission
    Given I do a 'GET' request with no login values
    Then The HTTP Code should be 400
    Then The response should be a HTML Document -> features/assets/dss_cannot_get.html

  Scenario: Complete POST Login Form Submission
    Given I do a 'POST' request with valid login values
    Then The HTTP Code should be 200

  Scenario: Complete GET Login Form Submission
    Given I do a 'GET' request with valid login values
    Then The HTTP Code should be 400
