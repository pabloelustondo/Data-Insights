Feature: DSS API Tests

  #Enrollment
  Scenario: As an administrator I want to try to enroll a MobiControl data source
    Given I grab 'dssback' url from config file
    Given I create a login session as "test"
      |domainid |code         |
      |test     |administrator|
    Given I set request for test_user
      | tenantid        |  dataSourceType | agentid    | data                                      |
      | test_user		|  MobiControl    | asdas      | {inputName: "mcurl",inputValue: mobiUrl}  |
    When  I POST with endpoint "registerDataSource"
    Then response code should be 200

  Scenario: As an administrator I want to enroll a new tenant
    #  Given I delete previous test information
    Given I grab 'dssback' url from config file
    Given I create new user named "test1" with the following data:
      | accountid           |  apikey                          | clientsecret | domainid            | mcurl                                     |password|username          |
      | external_user		|  244cc44394ba4efd8fe38297ee8213d3| 1            | test1               | https://cad099.corp.soti.net/MobiControl  |1       |administrator     |
    When I POST with endpoint "enrollments"
    Then The HTTP Code should be 200
    Then The response's id_token should be valid
    Then I store the response token in a file 'InUserToken'

  Scenario: As an administrator I want to try to enroll with an existing tenant
    Given I grab 'dssback' url from config file
    Given I create new user named "test1" with the following data:
      | accountid           |  apikey                          | clientsecret | domainid               | mcurl                                     |password|username          |
      | external_user		|  244cc44394ba4efd8fe38297ee8213d3| 1            | test1               | https://cad099.corp.soti.net/MobiControl  |1       |administrator     |
    When I POST with endpoint "enrollments"
    Then The HTTP Code should be 200
    Then The response should contain 'Tenant ID already enrolled'

#  Scenario Outline: As an administrator I want to try to enroll with invalid values
#    Given I submit with invalid <valueField> value: <valueUsed>
#    Then The HTTP Code should be 400
#    Then The response should contain '<valueErrorResponse>'
#
#    Examples:
#      | valueField   | valueUsed                   | valueErrorResponse                             |
#      | TenantID     | _____+_+.A                  | Invalid TenantID Provided                      |
#      | MobiURL      | http://google.com/r/Android | Invalid MobiControl URL Provided               |
#      | ClientID     | _!+!+@_#+$_%+!@+#_          | Client ID Cannot Contain Special Characters    |
#      | ClientSecret | *                           | Client Secret Cannot Be Less Than 8 Characters |
#      | Username     | ^!^#^^^#^^#^#^^#            | Username Cannot Contain Special Characters     |
#      | Password     | 12                          | Password Cannot Be Less Than 8 Characters      |
#
#   #Login
#  Scenario: As an administrator I want to login
#    Given I do a 'POST' request with valid login values
#    Then The HTTP Code should be 200
#
#  Scenario: As an administrator I want to try to login without using an accountid
#    Given I do a 'POST' request with no login values
#    Then The HTTP Code should be 400
#    Then The response should contain 'Missing AccountID'
#
#    #DataSources
#  Scenario: As an administrator I want to download DataSource credentials
#    Given I set head and body for handling credentials
#    And grab DSS port number
#    When I GET :portnumber with endpoint "sourceCredentials" to download credentials
#    Then response code should be 200
#
#  Scenario: As an administrator I want to reset DataSource credentials
#    Given I set head and body for handling credentials
#    And grab DSS port number
#    When I GET :portnumber with endpoint "sourceCredentials" to download credentials
#    Then I set head and body for handling credentials
#    Then I POST :portnumber with endpoint "resetCredentials" to reset credentials
#    And grab IDA's port number
#    Then I GET :idaportnumber with old credentials and endpoint "Security/GetAuthorizationToken"
#    And response body contain some sort of error
#
#  Scenario: As an administrator I want to try to delete a data source and invalid x-access-token
#    Given I set invalid header and body for test_user for delete
#    And grab DSS port number
#    When I POST :portnumber with endpoint "deleteDataSource"
#    Then response code should be 400
#
#    # This is not implemented yet
#  Scenario: As an administrator I want to try to delete a data source with a valid x-access-token
#    Given I set valid header and body for test_user for delete
#    And grab DSS port number
#    When I POST :portnumber with endpoint "deleteDataSource"
#    Then response code should be 400
#
#  # Negative Tests
#  Scenario: As an administrator I want to try to GET /login
#    Given I do a 'GET' request with valid login values
#    Then The HTTP Code should be 400
#
#  Scenario: As an administrator I want to try to GET /enrollments
#    Given I do a 'GET' request with valid values
#    Then The HTTP Code should be 400
#    Then The response should be a HTML Document -> features/assets/dss_cannot_get.html
#
#   # Scenario: As an administrator I want to try to GET /enrollments
#   # Given I do a 'GET' request with no login values
#   # Then The HTTP Code should be 400
#   # Then The response should be a HTML Document -> features/assets/dss_cannot_get.html
#
#    #Scenario Outline: Incomplete POST SignUp Form Submission
#  #  Given I submit with missing <valueField>
#  #  Then The HTTP Code should be 400
#  #  Then The response should contain '<valueErrorResponse>'
#
#  #  Examples:
#  #    | valueField   | valueErrorResponse      |
#  #    | domainid     | Missing DomainID        |
#  #    | mcurl        | Missing MobiControl Url |
#  #    | apikey       | Missing API key         |
#  #    | clientsecret | Missing API Password    |
#  #    | username     | Missing Username        |
#  #    | password     | Missing Password        |
#  #    | accountid    | Missing AccountID       |




