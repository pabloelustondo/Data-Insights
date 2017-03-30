Data Analytics Dashboard Service (DAS)

NOTE: This readme file still contains some useful information but is OUTDATED.

This project is written using modern javascript and organized in modules that can be built, run and test independently.
Key technologies are: Node.js (7), Angular.js 2, Typescript 2 and nv23.js / D3.js (for charts). 

To get and run this project 

install git (I have version st2.9 )
install node.js (version 7)

Stop all the MobiControl services (MS, DS, Elastic Search Proxy Server(if you have it))
Ensure Port in TSOA.json and Appconfig.json match.

Ensure MONGO db installed and running


=== pull code from the repository ===
1) git clone http://taipan:8080/tfs/SOTITFS/_git/CustomerBI
2) retireve AWS access credential files and store them locally (Ask Sergey Khanzin for now)
3) Place local SSL certificates (self-signed). These are provided in the repository for now. 

open command prompt and nagivate to the folder that has mongodb data
mongod -dbpath ./

open command prompt to start database adapter
cd CustomerBI
cd ddb
npm install
npm start
in your browser navigate to http://localhost:8000/dataSources and verify response

open a command prompt to start ODA (output data adapter)
1) cd CustomerBI
2) cd oda
3) npm install
4) npm start  
5) check out data adapter (ODA) at  port specified in command prompt https://localhost:3002/

open a command prompt to start data service back endpoint
1) cd CustomerBI
2) cd dss\backend
3) npm install
4) npm start

open a command prompt to start data service front end. (This serves as log in and admin screen)
1) cd CustomerBI
2) cd dss
3) npm install
4) npm start

open command prompt to start database engine endpoint (ddb)
1) cd CustomerBI
2) cd ddb
3) npm install
4) npm start

open another command prompt to start input data adapter 
1) cd CustomerBI
2) cd ida
3) open appconfig.json and replace the "aws-accessKeyFileLocation" and "aws-secretKeyFileLocation" with address of local storage
4) update "https-key-location" and "https-cert-location" in app config to point to 
the SSL key are and certificate location for ida. 
5) npm install
6) npm start
check out input data adapter (IDA) at https://localhost:3010/


open another command prompt
1) cd CustomerBI
2) cd dad
3) npm install
4) npm start  
5) check Data Analytics Dashboard(DAD) at the port specified in command prompt  https://localhost:4200/


Note: Data Analytics Dashboard(DAD) is only the client side for now, server side coming soon
Note: We recommend using WebStorm as IDE but this is not necessary.

If using WebStorm, after npm install is done, our suggestion is to right click on the package.json and execute the 'start' task from there.
In the case of DAD the start takes care of everything (builds and runs). In case of ODA you need to build.

Warning: If using WebStorm,  please remove indexing from 'dist' folders as well as node_modules,as this is going to be slow.
(Settings/Directories   exclude button)

===== Prod server ====

Port assignment on prod server
5494 : Dad2
5495 : ODA
5496 : IDA

==== Installation of Dad2 on Prod ====
open dad2 folder
open dad2\src\app\appconfig
Ensure each endpoint points to http://34.192.3.52:5495/...
navigate back to dad2 root folder
open package file
add the following line in scripts folder: "startprod": "ng serve --host 10.0.2.76 --port 5494",
npm install
npm run-script startprod

==== To install as a service ===
1) Get NSSM - the Non-Sucking Service Manager from http://nssm.cc/download
2) Open terminal as windows administrator
3) Register IDA as a service with the following command
nssm.exe install IDA "C:\Program Files\nodejs\node.exe" C:\Users\vdave\WebstormProjects\current_head\CustomerBI\ida\dist\server.js
4) Register ODA as a service with the following command
nssm.exe install ODA "C:\Program Files\nodejs\node.exe" C:\Users\vdave\WebstormProjects\current_head\CustomerBI\oda\dist\server.js
5) Build IDA
6) Build ODA
7) To start/stop IDA application nssm start/stop IDA
8) To start/stop ODA application nssm start/stop ODA

Glossary:

    Tools:
    1) WS - WebStorm
    2) TS - TypeScript

    Components:
    1) DAD - Data Analytics Dashboard
    2) ODA - Checkout Data Adapter
    3) IDA - Input data Adapter
	4) DSS - Data Service Server
	5) DDB - Data Database
