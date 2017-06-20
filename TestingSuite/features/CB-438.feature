Feature: Extend ODA with Pub/Sub (for DAD/3rd party apps)
  # https://jira.soti.net/browse/CB-438

Background:
  There is an API that returns list of existing topics
  There is an API customer may use to subscribe to a published topic
  Simple consumer should be able to subscribe/consume the data

  Scenario: As an admininstrator I want to GET a list of existing topics
    Given I grab ODA url from globalconfig.json
    And I grab the xaccesskey for ODA from 'testTemporaryToken'
    When I GET topics
    Then response code is :200
    Then response body should be error-free

  Scenario: As an admininstrator I want to subscribe to a topic
    Given I set valid request header and body for POST call to ~/query with metadata id
    And I grab ODA url from globalconfig.json
    And I make a POST call to ~/query
    Then response code is :200
    #Further validation is needed
    Then the response doesnt have to be merged





