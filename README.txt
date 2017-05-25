Welcome to SOTI Insights

SHORT STORY (Windows)
make sure you have the LATEST versions of : GIT, NODE.JS, MONGODB, KAFKA (you need Java for kafka)
(follow official websites)
make sure you have two scripts to start kafka "startkafka"  "startzoo" (for zookeper) that can run anywhere.
also make sure you can run mongod from anywhere, you have in your path.

git clone
install   (takes a few minutes, get a coffee)
run     (by default will run on localhost)
http://localhost:5000

run config  for specific configuration ...
for example
"dev" is for sotiinsights.clooudapp.net

default configurations are in the globalconfigs folder.
each microservice is able to overwrite the global configuration.....for that you need to go into each service folder.
(in vanilla deployments you do not need that)

LONG STORY

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

 Ok, let get started from simple to complex.
 This readme assumes that you got the code doing
 git clone -b stable http://taipan:8080/tfs/SOTITFS/_git/CustomerBI

 If you got your copy form the master/head there is more chances that you will have a problem

 Anyway, if you already understood the architecture and modules well and your are getting tired of doing cd ..npm install by hand ... use the 'install.bat'.
 Thenm yiou can run all your modules from Webstorm so you do not need to open so many terminal (this is what I do).

 0) Make sure you have Node.js (+7.7.4), Npm (+4.4.4) and Mongodb (+3.0.7). You can find the code at https://nodejs.org and https://www.mongodb.com
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
npm start
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

  3.2) DAD Front End  (Development Mode - Test Mode)

           open a new terminal
           cd CustomerBI/dad
           npm install
           npm start
           hit http://localhost:4200, you should see  dashbaord with some widgets and charts

           if all went well, you will see a dashboard with some pages and charts. This is running in test mode,
           data is comming from a sample user using sample configuration and sample data. This is how normally we develop.
           We avoid calling real dependencies while developing visual components.
           we will run for real when we install ODA which provides data to the dashboard. 

   3.3) DAD Front End  (Production Mode - Calling real DSS and DAD Backend dependencies)
            (NOTE: We are NOT calling ODA for now as it is being refactor)

           stop the previous process or command prompt (otherwise you will have a port conflict)
           npm run startprod
           hit http://localhost:4200, you should be redirected to DSS login page
















