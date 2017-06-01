Feature: SOTI Insights- ODA Backend Components

        #New ODA endpoints CB-437 and CB-438
    Scenario: valid POST to Query
        Given I set request header and body to query "vehicleInfo"
        And grab ODA port number
        And I make a POST call to ~/query
        Then response code is :200
        Then The response message should include "CreatedAt"
        Then The response message should not include "Query is Not Supported"


    Scenario: invalid POST to Query
      Given I set request header and body to query "unicornCollection"
      And grab ODA port number
      And I make a POST call to ~/query
      Then response code is :200
      Then The response message should include "Query is Not Supported"


    Scenario: GET Topics
        Given I make a GET request to ~/query/topics
        And a <testStep> submission with the following request paramaters <testRequest>
        Then The response message should not include <testResponse>
