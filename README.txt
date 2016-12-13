Data Analytics Dashboard (DAD) preliminary code & experiments.

This project is written using modern javascript and organized in modules that can be built, run and test independently. 
Key technologies are: Node.js (7), Angular.js 2, Typescript 2 and nv23.js / D3.js (for charts). 

To get and run this project 

install git (I have version st2.9 )
install node.js (version 7)

Stop all the MobiControl services (MS, DS, Elastic Search Proxy Server(if you have it))
Ensure Port in TSOA.json and Appconfig.json match.

open a commend prompt
git clone http://taipan:8080/tfs/SOTITFS/_git/CustomerBI
cd CustomerBI
cd oda
npm install
npm start  
check out data adapter (ODA) at http://localhost:3001/

open another command prompt
cd CustomerBI
cd dad
npm install
npm start  
check Data Analytics Dashboard(DAD) at http://localhost:3000/

open a commend prompt
git clone http://taipan:8080/tfs/SOTITFS/_git/CustomerBI
cd CustomerBI
cd ida
npm install
npm start
check out input data adapter (IDA) at http://localhost:3003/


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
