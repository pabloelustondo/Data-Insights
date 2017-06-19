Feature: Tenancy Management

  #DataSources
  Scenario: As an administrator I want to check my additional information is correct
    Given I grab 'dssback' url from config file
    Given Given I create a login session as "test"
    |domainid |code         |
    |test     |administrator|
    Then response code should be 200
  #{"domainid": "test", "code": "administrator"}
    When I GET with endpoint "api/myenrollments"
    # http://10.0.91.2:8024/api/myenrollments
    Then I should receive my user information with all the valid fields
      |accountid     |domainid |
      |external_user |test_user|

  # {"status":"new","tenantid":"test_user","mcurl":"https://cad145.corp.soti.net/MobiControl","domainid":"peter.meaney@soti.net","username":"peter.meaney@soti.net"}

  Scenario: As an administrator I want to create a DataSource
  #  Given I delete previous test information
    #Given I login as "test1"
    Given I grab 'dssback' url from config file
    Given I set request for test_user
      | tenantid        |  dataSourceType | agentid    | data                                      |
      | test_user		|  MobiControl    | asdas      | {inputName: "mcurl",inputValue: mobiUrl}  |
    When  I POST with endpoint "registerDataSource"
    Then response code should be 200

#  Scenario: As an administrator I want to see all DataSources
##    Given I login as "test1"
#    Given I grab 'dssback' url from config file
#    When  I GET with endpoint "getDataSources"
#    Then response code should be 200
#
#  Scenario: As an administrator I want to download DataSource credentials
#    Given I login as "test1"
#    Given I grab 'dssback' url from config file
#    When  I GET "getDataSources"
#     # [{"_id":"5940323b1be26ef4060bf410","tenantId":"test","agentId":"6dac06ef-2fae-4f60-a474-6e7dd21575fb","dataSourceType":"Other...","dataSourceData":[{"inputName":"agentLabel","inputValue":"android agent"}],"activationKey":"9f7e78a9-f647-4612-a6c7-8a5427c719bf","status":"active"},{"_id":"594036f31be26ef4060bf411","tenantId":"test","agentId":"59ed8f91-9436-4708-a0a9-1fbddb0808dd","dataSourceType":"Other...","dataSourceData":[{"inputName":"agentLabel","inputValue":"AndroidAgent"}],"activationKey":"0dea3c5e-4757-4c05-bd2b-d1e144f20cfc","status":"active"},{"_id":"5942c77f236d4a3c0f701063","tenantId":"test","agentId":"062f968f-c197-4686-a029-e78a43d78997","dataSourceType":"Other...","dataSourceData":[{"inputName":"agentLabel","inputValue":"test"}],"activationKey":"63871ae2-c5ba-4a4f-a360-44fcb290ae6a","status":"active"},{"_id":"5942c78b236d4a3c0f701064","tenantId":"test","agentId":"528e0211-bdf2-48d1-aa79-b0081259a88e","dataSourceType":"Other...","dataSourceData":[{"inputName":"agentLabel","inputValue":"dfasasdf"}],"activationKey":"64a13fc2-47ba-45dc-8a0d-5dde76e08309","status":"active"},{"_id":"5942c792236d4a3c0f701065","tenantId":"test","agentId":"6d079252-9df7-4487-bada-926c08805ccb","dataSourceType":"MobiControl","dataSourceData":[{"inputName":"mcurl","inputValue":"vasdsaf"}],"activationKey":"ecaf526a-54e0-47ac-a517-e44b1ac93638","status":"active"},{"_id":"5942e189236d4a3c0f701069","tenantId":"test","agentId":"b0317e01-c8be-4e14-aa06-78a199481c44","dataSourceType":"MobiControl","dataSourceData":[{"inputName":"mcurl","inputValue":"bch"}],"activationKey":"c559c3c1-962f-4ce8-ac7a-10dc3dcae487","status":"active"},{"_id":"5942e1a7236d4a3c0f70106a","tenantId":"test","agentId":"b96d6f27-5015-424e-a813-c47b5f719722","dataSourceType":"MobiControl","dataSourceData":[{"inputName":"mcurl","inputValue":"789789789789"}],"activationKey":"b7ef7324-3aad-4e12-8fdd-1e2a3f93060a","status":"active"},{"_id":"5943ed69dcf5e9bc18e8c49b","tenantId":"test","agentId":"c9ac4e40-bc5f-4ffe-b185-3cfb7c6b8839","dataSourceType":"MobiControl","dataSourceData":[{"inputName":"mcurl","inputValue":"http://a.com"}],"activationKey":"899df10e-6513-4b67-bac1-55894b0e0f29","status":"active"}]
#    And I download my credentials
#     # http://10.0.91.2:8024/sourceCredentials/6dac06ef-2fae-4f60-a474-6e7dd21575fb
#    Then response code should be 200
#
#  Scenario: As an administrator I want to reset DataSource credentials
#    Given I login as "test1"
#    Given I grab 'dssback' url from config file
#    When  I POST with endpoint "resetCredentials"
#    # http://10.0.91.2:8024/resetCredentials/6dac06ef-2fae-4f60-a474-6e7dd21575fb
#    Then I should get a success message
#    # {"message":"Success fully reset"}
#    Then response code should be 200
#
#  Scenario: As an administrator I want to download MCDP
#    Given I login as "test1"
#    Given I grab 'dssback' url from config file
#    # Next step will be depreciated
#    When  I GET MCDP location
#    Then response code should be 200
#
#  Scenario: As an administrator, I want to navigate to the dashboard from the tenancy management page
#    Given I login as "test1"
#    When I click on the Dashboard button
#    Then I should be brought directly to Dashboard
#
#  Scenario: As an administrator, I want to navigate to the tenancy management page from the dashboard
#    Given I login as "test1"
#    When I click on the Admin button
#    Then I should be brought directly to Tenacy Management page
#
#  Scenario: As an administrator I want to Logout
#    Given I login as "test1"
#    When  I click on the Logout button
#    Then  I should be logged out


