Feature: SOTI Insights- ODA Backend Components

        #New ODA endpoints CB-437 and CB-438
    Scenario Outline: POST to Query
        Given I make a POST call to ~/query
        And a <testStep> submission with the following request paramaters <testRequest>
        Then The response message should include <testResponse>

        Examples: POST to Query
            | testStep  | testResponse    | testRequest                    |
            | POST      | data            | {"metricName": "DevicesDidNotLastShift","predicates": ["batteryNotFullyChargedBeforeShift"],"parameters": {"shiftStartDateTime": "2017-04-17T17:47:39.884Z","endDate": "2017-04-17T17:47:39.884Z","shiftDuration": 0,"minimumBatteryPercentageThreshold": 0}} |
            | Negative  | [object Object] | {"metricName": "DevicesDidNotLastShift","predicates": ["batteryNotFullyChargedBeforeShift"],"parameters": {"shiftStartDateTime": "2017-04-17T17:47:39.884Z","endDate": "xyz","shiftDuration": 0,"minimumBatteryPercentageThreshold": 0}}   |

    Scenario Outline: GET Topics
        Given I make a GET request to ~/query/topics
        And a <testStep> submission with the following request paramaters <testRequest>
        Then The response message should include <testResponse>

        Examples: GET Topics
            | testStep  | testResponse    | testRequest                    |
            | POST      | data            | {"metricName": "DevicesDidNotLastShift","predicates": ["batteryNotFullyChargedBeforeShift"],"parameters": {"shiftStartDateTime": "2017-04-17T17:47:39.884Z","endDate": "2017-04-17T17:47:39.884Z","shiftDuration": 0,"minimumBatteryPercentageThreshold": 0}} |
            | Negative  | [object Object] | {"metricName": "DevicesDidNotLastShift","predicates": ["batteryNotFullyChargedBeforeShift"],"parameters": {"shiftStartDateTime": "2017-04-17T17:47:39.884Z","endDate": "xyz","shiftDuration": 0,"minimumBatteryPercentageThreshold": 0}}   |