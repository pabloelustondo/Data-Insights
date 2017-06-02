Feature: Extend ODA with Pub/Sub (for DAD/3rd party apps)
  # https://jira.soti.net/browse/CB-438

Background:
  There is an API that returns list of existing topics
  There is an API customer may use to subscribe to a published topic
  Simple consumer should be able to subscribe/consume the data

  Scenario: GET list of existing topics
    Given I set the xaccesskey for ODA
    And I grab ODA port number from globalconfig.json
    When I GET topics
    Then response code must be 200
    Then response body should be error-free
    Then The response message should not include <testResponse>

  Scenario: Subscribe to a topic
    Given I set valid request header and body for POST call to ~/query
    And I grab ODA port number from globalconfig.json
    And I make a POST call to query
    Then response code is :200
    #Further validation is needed
    Then The response message should contain the merged dataset



