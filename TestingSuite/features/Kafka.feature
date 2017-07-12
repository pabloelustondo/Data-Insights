Feature: Kafka Tests

Background:
  Tests that ensure kafka is up and running and properly working

  Scenario:
    Given I set up producer to post to topic 'existingTopic'
    Given I set up consumer to listen to topic 'existingTopic'
    When I post "random message"
    Then I should receive "random message"

    Given I set up producer to post to topic