Feature: Server-side metadata with merge (non-persisted, for interactive queries)
  # https://jira.soti.net/browse/CB-437

Background:
based on given data set metadata definition we should be able to return merged data set.

  Scenario: As an administrator, I want to post my data to ODA and get a merged dataSet returned
    Given I grab the xaccesskey for ODA from 'testTemporaryToken'
    And I grab ODA url from globalconfig.json
    Then I set valid request for posting to ~/query
      |dataSetId|from       |
      |TestSet | BatteryCharge   |
    And I make a POST call to ~/query
    Then response code is :200
    #Further validation is needed
    Then the response doesnt have to be merged
