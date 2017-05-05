Welcome to SOTI Insights

SOTI Insights is a distributed application to allow customers to consolidate, store, transform and consume information insights
from its internal or external data sources. SOTI Insights is intended to be run on a cloud environment and is
composed by various modules (or microservices) that run independently and communicate to each other to accomplish the general
goals.

The application has been written in node.js and most modules only rely on that. Only our database APIS rely on mongodb
and other cloud resoures. So to install and run this application your need:

Node.js 7.0+ and Mongodb 3.4+. By default it assume that mongodb runs on the standard port.

to install and run the whole application you can just do

npm install (it will taka few minutes go for coffee)
npm start   (you will see other starts for non default configurations)

or , if you just want to see specific modules do:

cd folder
npm install
npm start  (you will see other starts for non default configurations)

Thi will run the application in testing mode. For running in a more realistic mode read how to set the configuration
parameters, We discuss this at the end of this document.

Every module is in a specific folder of the same name. Here a quick overview of the modules and what they do:

DAD is a client side application that allows customer to consume data set by displaying charts, alerts, tables..etc.
Client side applications such as DAD also have a corresponding 'backend' module.

DSS is another client side application to allow administrators with a valid SOTI account to create a 'tenant' and define
an external method for the users to login. (for now only Mobicontrol IDP is supported).
DSS is in charge of allowing user to login by generating JWT tokens they use to exchange for inforamtion.

TMM is used by administrators to create the metadata taht defined the tenant data lake. Metadata specifies which data sources,
dataset and processed that the tenant will have in his data lake.

ODA is the API conterpart of DAD an allow user that prefer to access our information directly and use their own dashboard applicaations.

IDA is the API for anybody, customets and us, to input data into the data lake.

DDB and CDL are our database / datalake APIs.

DDB wraps the SOTI database that we use to store customer tenant information.
This is general a small size database and we use mongo DB for it.

CDL is our customer data lake interface and is in charge to interpret metadata.

MCDP and DLM are data collection modules.

MCDP is a specific data collection agent to collect data from mobicontrol.

DLM is a data collection server that pulls data from.

AWS is a folder that temporarily contains code that runs on aws but will be deprecated.

Please read the SOTI Insights Introduction for further explanations.

---- Setting for running in production and other modes -----






