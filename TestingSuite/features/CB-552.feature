Feature: TMM service

  Background: Data set definition as a pre-requisite to data source creation


    Scenario: Creating a MCDP data source without a dataset definition
      Given I grab tmm backend url from the config file
      Given I create a new Tenant Metadata Object for tenant 'newTenant'
      When I define a new data source for 'newTenant'
      |name            |url                                                  |type| dataSets  |
      |BatteryCharge   | https://cad145.corp.soti.net/MobiControl/oauth/logon|MCDP|    []     |
      When I setup request for posting to tmm backend
      And I POST to "/tenant/dev/dataSource/newTenant"
      Then The response code needs to be '400'

    Scenario: Creating a MCDP data source with a dataset definition
      Given I grab tmm backend url from the config file
      Given I create a new Tenant Metadata Object for tenant 'newTenant'
      Given I define a new dataset for this tenant
        |id       |name       |from             |persist  |filter |merge  |projections  |metadata |
        |TestSet  |testDataSet|[testDataSource] |true     |[]     |[]     |[]           |[]       |
      When I define a new data source for this tenant
        |name            |url                                                  |type| dataSets  |
        |BatteryCharge   | https://cad145.corp.soti.net/MobiControl/oauth/logon|MCDP| [TestSet]     |
      When I setup request for posting to tmm backend
      And I POST to "/tenant/dev/dataSource/"
      Then The response code needs to be '200'

    Scenario: Creating a MCDP data source with multiple dataset definitions
      Given I grab tmm backend url from the config file
      Given I create a new Tenant Metadata Object for tenant 'newTenant'
      Given I define a new dataset for this tenant
        |id       |name       |from             |persist  |filter |merge  |projections  |metadata |
        |TestSet  |testDataSet|[testDataSource] |true     |[]     |[]     |[]           |[]       |
      Given I define a new dataset for this tenant
        |id       |name       |from             |persist  |filter |merge  |projections  |metadata |
        |TestSet2  |testDataSet|[testDataSource] |true     |[]     |[]     |[]           |[]       |
      When I define a new datasource for this tenant
        |Data Source name|  MobiControl Url                                    |dataSets           |
        |BatteryCharge   | https://cad145.corp.soti.net/MobiControl/oauth/logon|[TestSet1, TestSet2]|
      When I setup request for posting to tmm backend
      And I POST to "/tenant/dev/dataSource/"
      Then The response code needs to be '200'


    Scenario: Creating an API data Source without a dataset definition


    Scenario: Creating an API data Source with a dataset definition


    Scenario: Creating an API data Source with multiple dataset definitions



