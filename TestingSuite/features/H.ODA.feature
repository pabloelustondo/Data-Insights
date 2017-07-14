Feature: SOTI Insight ODA Backend Components

        #New ODA endpoints CB-437 and CB-438

   Scenario: As an administrator I want to GET a list of existing topics
    Given I grab the xaccesskey for ODA from 'testTemporaryToken'
    And I grab ODA url from globalconfig.json
    When I GET topics for "test"
    Then response code is :200
    Then response body must be error-free
    #Then The response message should not include <testResponse>

   Scenario: As an administrator I want to subscribe to a topic
    Given I grab the xaccesskey for ODA from 'testTemporaryToken'
    And I grab ODA url from globalconfig.json
    Then I set valid request for posting to ~/query
      |dataSetId|from       |
      |TestSet  |TestSet       |
    And I make a POST call to ~/query
    Then response code is :200
    #Further validation is needed
    Then the response doesnt have to be merged

   Scenario: invalid POST to Query
     Given I set invalid request for POST call to ~/query
       |dataSetId|from              |
       |string   |unicornCollection |
      And I grab ODA url from globalconfig.json
      And I make a POST call to ~/query
      Then response code is :400
      Then The response message should contain error
