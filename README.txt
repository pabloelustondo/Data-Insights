Welcome to SOTI Insights

This README is only about how to install and run this application from the source code in one machine for testing/development,
Please read the included PDF for a conceptual introduction to what is this as we will assume you did it.
Another document will explain how to deploy this application to the target cloud environment.

The application has been written in Node.js. Some modules also depend on MongoDb and Apache Kafka (comming soon).

Although everything we do in this readme can be automated with a script, we think is better for you to understand
and do this process module by module for 3 reasons:

 - you will understand better how the application and the components play together
 - the final goal is to deploy / mantain this application to the cloud module by module. So, this way is more realistic.
 - as a developer you should work module by module in isolation. Code changes are supposed to be tested without dependnecies.

 YOU CAN INSTALL AND RUN THE MODULES IN ANY ORDER but we suggest here a way that goes from simple to complex

 Ok, let get started from simple to complex


 0) Make sure you have Node.js (+7.5.0), Npm (+4.1.2) and Mongodb (+3.0.7). You can find the code at https://nodejs.org and https://www.mongodb.com
    Make sure mongodb is running in the url specified in appconfig "mongodb_url" (by default mongodb://localhost:27017)

 1) DDB - SOTI Insights Database, here we store tenants, users, system information)

    open a new terminal     (all modules run independently..so you will need lots of terminals)
    cd CustomerBI/ddb
    npm install
    npm start
    hit http://localhost:8000/e2etest, you should see various test passing in green
    hit http://localhost:8000/status?secret=1234, you see the status of the service and its configuration
    you should see something like this
    {"name":"DDB","testingmode":true,"port":8000,"mongodb_url":"mongodb://localhost:27017/udb_test"}

    troubleshooting: do you have mongod running in the url specified in appconfig "mongodb_url"?.

  2) DSS - SOTI Insights Security System - Enrollment, Login (and add data sources for now, to be moved to TMM)

  2.1) DSS Back End

     open a new terminal     (all modules run independently..so you will need lots of terminals)
     cd CustomerBI/dss/backend
     npm install
     npm start
     hit http://localhost:3004/e2etest, you should see various test passing in green
     hit http://localhost:3004/status?secret=1234, you see the status of the service and its configuration

     you should see something like this:
     {"name":"DSS_Backend","testingmode":true,"port":3004,"hostname":"localhost","ddb_url":"http://localhost:8000","dlm_url":"http://localhost:3004"}

  2.2) DSS Front End

    open a new terminal
    cd CustomerBI/dss
    npm install
    npm start
    hit http://localhost:3003, you should see DSS login screen

    The login screen is asking you for a tenantid which you have not create at this point.
    But, you can always use the "test" tenantid.
    So, login with "test" tenant id and provide any user and password in the simulated IDP screen.
    user and password is arbitrary... but try to use something unique that you can remember as this username will be used to store a user based configuration.

    If all went well, you should see a page that says that you
    You are logged in and your JWT is:
    .....code.....
    {
      "username": "useryouentered",
      "tenantId": "test",
      "iat": 1494389546,
      "exp": 1500389546
    }

  3) DAD - SOTI Data Analytics Dashboard - Pages, Charts, Widgets,..etc.. you can see data

  3.1) DAD Backend

     open a new terminal
     cd CustomerBI/dad/backend
     npm install
     npm start
     hit http://localhost:4201/e2etest, you should see various test passing in green
     hit http://localhost:4201/status?secret=1234, you see the status of the service and its configuration

     you should see something like this:
     {"name":"DAD_Backend","testingmode":"false","port":4201,"ddb_url":"http://localhost:8000"}

  3.2) DAD Front End  (In testing / development mode   we will see production mode next)

           open a new terminal
           cd CustomerBI/dad
           npm install
           npm start
           hit http://localhost:4200, you should see  dashbaord with some widgets and charts


.....to be continued











