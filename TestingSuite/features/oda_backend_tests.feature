Feature: SOTI Insights- ODA Backend Components
    Scenario Outline: Initial Charge Levels
        Given I Make a GET Call to ~/Devices/Battery/Summary/InitialChargeLevels
        And a <testStep> submission with the following request URL <testRequest>
        Then The response message should include <testResponse>

    Examples: Initial Charge Levels
    | testStep         | testResponse                                        | testRequest                              |
    | Positive         | data                                                | ?dateFrom=2016-01-01&dateTo=2016-12-31   |
    | Invalid DateFrom | invalid input syntax for type timestamp: \"xyz\"\n" | ?dateFrom=xyz&dateTo=2016-12-31          |
    | Invalid DateTo   | invalid input syntax for type timestamp: \"xyz\"\n" | ?dateFrom=2016-12-31&dateTo=xyz          |

    Scenario Outline: Discharge Rate
        Given I Make a GET Call to ~/Devices/Battery/Summary/DischargeRate
        And a <testStep> submission with the following request URL <testRequest>
        Then The response message should include  <testResponse>

    Examples: Discharge Rates
    | testStep         | testResponse                                        | testRequest                              |
    | Invalid DateFrom | invalid input syntax for type timestamp: \"xyz\"\n" | ?dateFrom=xyz&dateTo=2016-12-31          |
    | Invalid DateTo   | invalid input syntax for type timestamp: \"xyz\"\n" | ?dateFrom=2016-12-31&dateTo=xyz          |

    Scenario Outline: Count Of Devices Did Not Survive Shift
        Given I make a GET call to ~/Devices/BatterySummary/countOfDevicesDidNotSurviveShift
        And a <testStep> submission with the following request URL <testRequest>
        Then The response message should include

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: Devices Did Not Survive Shift
    | testStep                              | testResponse    | testRequest                                                                            |
    | Positive                              | data            | ?shiftDuration=8&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=50    |
    | Invalid shiftDuration                 | [object Object] | ?shiftDuration=xyz&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=50  |
    | Invalid Invalid Shift Start Date Time | [object Object] | ?shiftDuration=8&shiftStartDateTime=xyz&minimumBatteryPercentageThreshold=50           |
    | Invalid Minimum Battery Percentage    | [object Object] | ?shiftDuration=8&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=xyz   |


    Scenario Outline: Devices Did Not Survive Shift
        Given I make a GET call to ~/Devices/BatterySummary/DevicesDidNotSurviveShift
        And a <testStep> submission with the following request URL <testRequest>
        Then The response message should include <testResponse>

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: Devices Did Not Survive Shift
    | testStep                              | testResponse    | testRequest                                                                                                  |
    | Positive                              | data            | ?shiftDuration=8&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=50&rowsSkip=0&rowsTake=0    |
    | Invalid shiftDuration                 | [object Object] | ?shiftDuration=xyz&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=50&rowsSkip=0&rowsTake=0  |
    | Invalid Invalid Shift Start Date Time | [object Object] | ?shiftDuration=8&shiftStartDateTime=xyz&minimumBatteryPercentageThreshold=50&rowsSkip=0&rowsTake=0           |
    | Invalid Minimum Battery Percentage    | [object Object] | ?shiftDuration=8&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=xyz&rowsSkip=0&rowsTake=0   |
    | Invalid Rows Skip                     | [object Object] | ?shiftDuration=8&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=50&rowsSkip=xyz&rowsTake=0  |
    | Invalid Rows Take                     | [object Object] | ?shiftDuration=8&shiftStartDateTime=2016-12-31&minimumBatteryPercentageThreshold=50&rowsSkip=0&rowsTake=xyz  |


    Scenario Outline: Devices Not Fully Charged
        Given I make a GET call to ~/Devices/Battery/List/DidNotSurviveShift/DevicesNotFullyCharged
        And a <testStep> submission with the following request URL <testRequest>
        Then The response message should include <testResponse>

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: Devices Not Fully Charged
    | testStep                              | testResponse    | testRequest                                                                                                  |
    | Positive                              | data            | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&minimumBatteryPercentageThreshold=50    |
    | Invalid shiftDuration                 | [object Object] | ?shiftDuration=xyz&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&minimumBatteryPercentageThreshold=50  |
    | Invalid Row Skips                     | [object Object] | ?shiftDuration=8&rowsSkip=xyz&rowsTake=0&shiftStartDateTime=2016-01-01&minimumBatteryPercentageThreshold=50  |
    | Invalid Row Takes                     | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=xyz&shiftStartDateTime=2016-01-01&minimumBatteryPercentageThreshold=50  |
    | Invalid Shift Start Date Time         | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=xyz&minimumBatteryPercentageThreshold=50           |
    | Invalid Minimum Battery Percentage    | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&minimumBatteryPercentageThreshold=xyz   |

    Scenario Outline: High Average Discharge Rate Per Shift
        Given I make a GET call to ~/Devices/Battery/List/DidNotSurviveShift/HighAverageDischargeRatePerShift
        And a <testStep> submission with the following request URL <testRequest>
        Then The response message should include <testResponse>

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: High Average Discharge Rate Per Shift
    | testStep                      | testResponse    | testRequest                                                                                                                      |
    | Positive                      | data            | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&endDate=2016-12-31&minimumThresholdDischargeRate=50         |
    | Invalid shiftDuration         | [object Object] | ?shiftDuration=9000000&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&endDate=2016-12-31&minimumThresholdDischargeRate=50   |
    | Invalid Row Skips             | [object Object] | ?shiftDuration=8&rowsSkip=xyz&rowsTake=0&shiftStartDateTime=2016-01-01&endDate=2016-12-31&minimumThresholdDischargeRate=50       |
    | Invalid Row Takes             | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=xyz&shiftStartDateTime=2016-01-01&endDate=2016-12-31&minimumThresholdDischargeRate=50       |
    | Invalid Shift Start Date Time | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=xyz&endDate=2016-12-31&minimumThresholdDischargeRate=50                |
    | Invalid End Date              | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&endDate=xyz&minimumThresholdDischargeRate=50                |
    | Invalid Threshold             | [object Object] | ?shiftDuration=8&rowsSkip=0&rowsTake=0&shiftStartDateTime=2016-01-01&endDate=2016-12-31&minimumThresholdDischargeRate=xyz        |


    Scenario Outline: Get Metrics
        Given I make a POST call to ~/Devices/Battery/getMetrics
        And a <testStep> submission with the following request paramaters <testRequest>
        Then The response message should include <testResponse>

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: Get Metrics
    | testStep  | testResponse    | testRequest                    |
    | POST      | data            | {"metricName": "DevicesDidNotLastShift","predicates": ["batteryNotFullyChargedBeforeShift"],"parameters": {"shiftStartDateTime": "2017-04-17T17:47:39.884Z","endDate": "2017-04-17T17:47:39.884Z","shiftDuration": 0,"minimumBatteryPercentageThreshold": 0}} |
    | Negative  | [object Object] | {"metricName": "DevicesDidNotLastShift","predicates": ["batteryNotFullyChargedBeforeShift"],"parameters": {"shiftStartDateTime": "2017-04-17T17:47:39.884Z","endDate": "xyz","shiftDuration": 0,"minimumBatteryPercentageThreshold": 0}}   |
    
    Scenario Outline: Get Device Information
        Given I make a POST call to ~/Devicces/getDeviceInformation
        And a <testStep> submission with the following request parameters <testRequest>
        Then The response message should include <testResponse>

    Examples: Get Device Information
    | testStep | testResponse | testRequest | 
    | POST     | deviceProperties | {"deviceId": "1234avcde","deviceProperties": ["deviceName","deviceManufacturer","deviceOwner","deviceDriver"]} |
    | Negative | deviceProperties | {"deviceId": "1234avcde","deviceProperties": ["deviceName","deviceManufacturer","deviceOwner","deviceDriver","booyeah"]} |

    Scenario Outline: Get Device Information
        Given I make a <testStep> call to ~/Devicces/numberOfInstallations
        And Include the following x-access parameters <testRequest>
        Then The response message should include <testResponse>

    Examples: Get Device Information
    | testStep | testResponse | testRequest | 
    | POST     | data         | eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw |
    | GET      | body         |''|

    Scenario Outline: Application Execution Time
        Given I make a GET call to ~/Devices/ApplicationexecutionTime
        And a <testStep> submission with the following request URL <testRequest>
        And x-access token: <testAuth>
        Then The response message should include <testResponse>

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: Application Execution Time
    | testStep           | testResponse     | testRequest                             | testAuth |
    | Positive           | data             | ?dateFrom=2016-01-01&dateTo=2016-12-01  | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw |
    | Blank Access Token |  body            | ?dateFrom=2016-01-01&dateTo=2016-12-01  | |
    | Invalid DateFrom   |  [object Object] | ?dateFrom=xyz&dateTo=2016-12-01         | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw | 
    | Invalid DateTo     |  [object Object]  | ?dateFrom=2016-12-01&dateTo=xyz         | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw | 

    Scenario Outline: Average Discharge Rate
        Given I make a GET call to ~/Devices/ApplicationexecutionTime
        And a <testStep> submission with the following request URL <testRequest>
        And x-access token: <testAuth>
        Then The response message should include <testResponse>

    # Figure out what the JSON Error Objects contain before commiting [object Object]
    Examples: Average Discharge Rate
    | testStep           | testResponse     | testRequest                             | testAuth |
    | Positive           | data             | ?dateFrom=2016-01-01&dateTo=2016-12-01  | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw |
    | Blank Access Token |  body            | ?dateFrom=2016-01-01&dateTo=2016-12-01  | |
    | Invalid DateFrom   |  [object Object] | ?dateFrom=xyz&dateTo=2016-12-01         | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw | 
    | Invalid DateTo     |  [object Object] | ?dateFrom=2016-12-01&dateTo=xyz         | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJ2YXJ1bi5kYXZlQHNvdGkubmUiLCJ0ZW5hbnRJZCI6ImV4dGVybmFsX3VzZXIiLCJhZ2VudElkIjoiNDI3MzQ5MzUtNTdkOC00YTFkLWEyZDQtMGZkM2U5OGJmNGIzIiwiYWN0aXZhdGlvbktleSI6Ijg1Njk0YjU1LTY1ZWEtNGVlNi1hNDNmLTI1ZDE4Yzk3YWMwMSIsImlhdCI6MTQ5NDUxMjI0OCwiZXhwIjoxNTAwNTEyMjQ4fQ.YO8rHP2FF0OHW7uu41A5sRBthw3PLel2pwtNM0mWUWw | 

    Scenario Outline: Get Vehicle Locations
        Given I make a GET request to https://dev2012r2-sk.sotidev.com:3002/Vehicles/Data/GetLocations
        Then The response should contain 'data'
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