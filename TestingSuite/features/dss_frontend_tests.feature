Feature: GUI Enrollment & Login

  Background:
    My baseURL is https://dev2012r2-sk.sotidev.com:3003/#/
    My default AccountID is 'ray.gervais@soti.net'
    My default TenacyID is 'ray'
    My default mobiControlURL is 'https://cad099.corp.soti.net/MobiControl'
    My default DomainID is 'administrator'
    My default ClientID is '898b6784bf964c5c9940ffc618feb7ed'
    My default Client Secret & Pass is '1'

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
